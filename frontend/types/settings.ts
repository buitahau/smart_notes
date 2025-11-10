export interface NotificationSettings {
  enabled: boolean;
  intervalMinutes: number;
}

export interface NotificationSettingsResponse {
  success: boolean;
  message?: string;
  data?: NotificationSettings;
}
