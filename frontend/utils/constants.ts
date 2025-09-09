/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  USER: 'smart_note_user',
  TOKEN: 'smart_note_token',
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
} as const;

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  APP_NAME: 'Smart Notes',
  VERSION: '1.0.0',
} as const;
