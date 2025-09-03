export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginResponse {
  username: any | null;
  error: string | null;
}

export interface LogoutResponse {
  status: boolean;
  error?: string | null;
}

export interface ValidateTokenResponse {
  valid: boolean;
  error?: string;
}

export interface UserDetails {
  username: string;
}

export interface NotificationMessageProps {
  type: 'success' | 'error';
  message: string;
}
