import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft as ArrowLeftIcon, Bell as BellIcon, Clock as ClockIcon } from 'lucide-react';
import { useMiniRouter } from '@context/router-context';
import { settingsService } from '@services/settings-service';
import { storage } from '@utils/storage';
import { DEFAULT_NOTIFICATION_SETTINGS, STORAGE_KEYS } from '@utils/constants';
import type { NotificationSettings } from '@types/settings';

const MIN_INTERVAL = 1;
const MAX_INTERVAL = 720;
const SAVE_DEBOUNCE_MS = 600;

const clampInterval = (value: number) => {
  if (Number.isNaN(value)) {
    return DEFAULT_NOTIFICATION_SETTINGS.intervalMinutes;
  }
  return Math.min(Math.max(value, MIN_INTERVAL), MAX_INTERVAL);
};

export const Settings: React.FC = () => {
  const { navigate } = useMiniRouter();

  const [settings, setSettings] = useState<NotificationSettings>({
    ...DEFAULT_NOTIFICATION_SETTINGS,
  });
  const [intervalInput, setIntervalInput] = useState(
    DEFAULT_NOTIFICATION_SETTINGS.intervalMinutes.toString()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<NotificationSettings | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalDescription = useMemo(() => {
    if (!settings.enabled) {
      return 'Notifications are disabled';
    }
    const minutes = settings.intervalMinutes;
    if (minutes < 60) {
      return `Every ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    const hours = (minutes / 60).toFixed(1);
    return `About every ${hours.endsWith('.0') ? hours.slice(0, -2) : hours} hours`;
  }, [settings.enabled, settings.intervalMinutes]);

  const persistLocally = useCallback(async (payload: NotificationSettings) => {
    await storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, payload);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await settingsService.getNotificationSettings();
        setSettings(response);
        setIntervalInput(response.intervalMinutes.toString());
        await persistLocally(response);
      } catch (err) {
        const fallback = { ...DEFAULT_NOTIFICATION_SETTINGS };
        setSettings(fallback);
        setIntervalInput(fallback.intervalMinutes.toString());
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load notification settings. Using defaults.'
        );
        await persistLocally(fallback);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadSettings();
  }, [persistLocally]);

  const saveSettings = useCallback(
    async (payload: NotificationSettings) => {
      setIsSaving(true);
      setError(null);
      try {
        const updated = await settingsService.updateNotificationSettings(payload);
        setSettings(updated);
        setIntervalInput(updated.intervalMinutes.toString());
        await persistLocally(updated);
        setStatusMessage('Settings saved');
        setTimeout(() => setStatusMessage(null), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save notification settings');
      } finally {
        setIsSaving(false);
      }
    },
    [persistLocally]
  );

  useEffect(() => {
    if (!pendingSettings || !initialized) {
      return;
    }

    const timeout = setTimeout(() => {
      void saveSettings(pendingSettings);
      setPendingSettings(null);
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [pendingSettings, initialized, saveSettings]);

  const handleToggleNotifications = () => {
    if (isLoading) return;

    const next = {
      ...settings,
      enabled: !settings.enabled,
    };
    setSettings(next);
    setPendingSettings(next);
  };

  const handleIntervalChange = (value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setIntervalInput(value);

    if (!value) {
      return;
    }

    const minutes = clampInterval(Number(value));
    if (minutes === settings.intervalMinutes) {
      return;
    }

    const next = {
      ...settings,
      intervalMinutes: minutes,
    };
    setSettings(next);
    setPendingSettings(next);
  };

  const handleIntervalBlur = () => {
    if (!intervalInput) {
      setIntervalInput(settings.intervalMinutes.toString());
    }
  };

  const handleNavigateBack = () => {
    navigate('home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleNavigateBack} aria-label="Back to home">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 style={styles.title}>Settings</h1>
        <div style={styles.headerSpacer} />
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <BellIcon size={18} />
            </div>
            <div>
              <h2 style={styles.sectionTitle}>Task notifications</h2>
              <p style={styles.sectionSubtitle}>Choose if and how often you get reminders</p>
            </div>
            <button
              style={{
                ...styles.toggle,
                ...(settings.enabled ? styles.toggleActive : {}),
                ...(isLoading ? styles.toggleDisabled : {}),
              }}
              onClick={handleToggleNotifications}
              role="switch"
              aria-checked={settings.enabled}
              disabled={isLoading}
            >
              <div
                style={{
                  ...styles.toggleThumb,
                  ...(settings.enabled ? styles.toggleThumbActive : {}),
                }}
              />
            </button>
          </div>

          <div style={styles.intervalWrapper}>
            <label style={styles.intervalLabel}>
              <ClockIcon size={16} />
              Notification interval (minutes)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={intervalInput}
              onChange={(e) => handleIntervalChange(e.target.value)}
              onBlur={handleIntervalBlur}
              disabled={!settings.enabled || isLoading}
              style={{
                ...styles.intervalInput,
                ...(!settings.enabled ? styles.intervalInputDisabled : {}),
              }}
              placeholder={`Between ${MIN_INTERVAL} and ${MAX_INTERVAL}`}
            />
            <p style={styles.intervalHelper}>{intervalDescription}</p>
          </div>
        </div>

        <div style={styles.footer}>
          {error && <span style={styles.errorText}>{error}</span>}
          {!error && (isSaving ? <span style={styles.savingText}>Saving...</span> : null)}
          {!error && !isSaving && statusMessage && (
            <span style={styles.successText}>{statusMessage}</span>
          )}
        </div>

        {isLoading && <div style={styles.loadingOverlay}>Loading settings...</div>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #4c6ef5 0%, #6c5ce7 100%)',
    color: 'white',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    color: 'white',
    letterSpacing: '-0.01em',
  },
  headerSpacer: {
    width: '40px',
  },
  content: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f9fafb',
    position: 'relative' as const,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)',
    border: '1px solid #eef2ff',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  sectionIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
  },
  toggle: {
    marginLeft: 'auto',
    width: '48px',
    height: '26px',
    borderRadius: '999px',
    // border: '1px solid #e5e7eb',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    padding: '0 3px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleActive: {
    backgroundColor: '#4f46e5',
    // borderColor: '#4f46e5',
  },
  toggleDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  toggleThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'transform 0.2s ease',
    transform: 'translateX(0px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
  toggleThumbActive: {
    transform: 'translateX(20px)',
  },
  intervalWrapper: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  intervalLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  intervalInput: {
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    fontWeight: 500,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.08)',
  },
  intervalInputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  intervalHelper: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
  },
  footer: {
    marginTop: '16px',
    minHeight: '20px',
  },
  savingText: {
    fontSize: '12px',
    color: '#6b7280',
  },
  successText: {
    fontSize: '12px',
    color: '#059669',
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
  },
  loadingOverlay: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    fontSize: '14px',
    fontWeight: 500,
    color: '#4b5563',
    borderRadius: '16px',
  },
};
