import apiClient from './api-client';
import { API_ENDPOINTS, DEFAULT_NOTIFICATION_SETTINGS } from '@utils/constants';
import { NotificationSettings, NotificationSettingsResponse } from '@types/settings';

const normalizeSettings = (settings?: NotificationSettings | null): NotificationSettings => {
  if (!settings) {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }

  const interval = Number(settings.intervalMinutes) || DEFAULT_NOTIFICATION_SETTINGS.intervalMinutes;

  return {
    enabled: Boolean(settings.enabled),
    intervalMinutes: Math.max(1, interval),
  };
};

class SettingsService {
  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<NotificationSettingsResponse>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch notification settings');
    }

    return normalizeSettings(response.data.data);
  }

  async updateNotificationSettings(payload: NotificationSettings): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettingsResponse>(
      API_ENDPOINTS.SETTINGS.NOTIFICATIONS,
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update notification settings');
    }

    return normalizeSettings(response.data.data ?? payload);
  }
}

export const settingsService = new SettingsService();
