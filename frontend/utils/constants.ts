/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  USER: 'smart_note_user',
  TOKEN: 'smart_note_token',
  CHAT_MESSAGES: 'smart_note_chat_messages',
  NOTIFICATION_SETTINGS: 'smart_note_notification_settings',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VALIDATE: '/api/auth/validate',
    LOGOUT: '/api/auth/logout',
  },
  NOTES: {
    BASE: '/api/notes',
    BY_ID: (id: string) => `/api/notes/${id}`,
  },
  QUERY: {
    BASE: '/api/query',
  },
  SETTINGS: {
    NOTIFICATIONS: '/api/settings/notifications',
  },
} as const;

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  APP_NAME: 'Smart Notes',
  VERSION: '1.0.0',
} as const;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  intervalMinutes: 60,
} as const;
