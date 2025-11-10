import { defineBackground } from 'wxt/sandbox';
import { DEFAULT_NOTIFICATION_SETTINGS, STORAGE_KEYS } from '@utils/constants';
import { storage } from '@utils/storage';
import type { Note } from '@services/note-service';
import type { NotificationSettings } from '@types/settings';

type BackgroundMessage = {
  type: string;
  payload?: unknown;
};

type StoredMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  notes?: Note[];
  intent?: string;
};

const NOTIFICATION_ALARM_NAME = 'smart_note_task_notification';

const getStoredNotificationSettings = async (): Promise<NotificationSettings> => {
  const stored =
    (await storage.get<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS)) ??
    DEFAULT_NOTIFICATION_SETTINGS;

  return {
    enabled: stored.enabled ?? DEFAULT_NOTIFICATION_SETTINGS.enabled,
    intervalMinutes: Math.max(1, stored.intervalMinutes ?? DEFAULT_NOTIFICATION_SETTINGS.intervalMinutes),
  };
};

const syncReminderAlarm = async () => {
  if (!chrome?.alarms) return;

  const settings = await getStoredNotificationSettings();

  if (!settings.enabled) {
    chrome.alarms.clear(NOTIFICATION_ALARM_NAME);
    return;
  }

  const desiredInterval = Math.max(1, settings.intervalMinutes);

  chrome.alarms.get(NOTIFICATION_ALARM_NAME, (existingAlarm) => {
    if (!existingAlarm || existingAlarm.periodInMinutes !== desiredInterval) {
      chrome.alarms.create(NOTIFICATION_ALARM_NAME, {
        periodInMinutes: desiredInterval,
      });
    }
  });
};

const pickRandomNote = (messages: StoredMessage[]): Note | null => {
  const notes = messages
    .flatMap((message) => message.notes ?? [])
    .filter((note): note is Note => Boolean(note?.content?.trim()));

  if (notes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

const truncateContent = (content: string) => {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
};

const showTaskReminderNotification = async () => {
  try {
    const settings = await getStoredNotificationSettings();
    if (!settings.enabled) {
      return;
    }

    const storedMessages =
      (await storage.get<StoredMessage[]>(STORAGE_KEYS.CHAT_MESSAGES)) ?? [];

    if (storedMessages.length === 0) return;

    const note = pickRandomNote(storedMessages);
    if (!note) return;

    chrome.notifications.create(`smart-note-${Date.now()}`, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon/128.png'),
      title: 'Task reminder',
      message: truncateContent(note.content),
      contextMessage: note.dateAt ? new Date(note.dateAt).toLocaleDateString() : undefined,
      priority: 1,
    });
  } catch (error) {
    console.error('Failed to display task reminder notification', error);
  }
};

export default defineBackground(() => {
  console.log('Background script loaded');

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Extension installed');
    } else if (details.reason === 'update') {
      console.log('Extension updated');
    }
    void syncReminderAlarm();
  });

  chrome.runtime.onStartup?.addListener(() => {
    void syncReminderAlarm();
  });
  void syncReminderAlarm();

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return;
    }

    if (STORAGE_KEYS.NOTIFICATION_SETTINGS in changes) {
      void syncReminderAlarm();
    }
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === NOTIFICATION_ALARM_NAME) {
      showTaskReminderNotification();
    }
  });

  chrome.runtime.onMessage.addListener((message: unknown, _sender, _sendResponse) => {
    const msg = message as BackgroundMessage;
    console.log('Message received in background script:', msg);

    switch (msg?.type) {
      case 'example':
        console.log('Example message received with payload:', msg.payload);
        break;
      case 'show-task-reminder':
        showTaskReminderNotification();
        break;
      default:
        console.warn('Unknown message type:', msg?.type);
    }
  });

  return () => {
    console.log('Background script unloaded');
  };
});
