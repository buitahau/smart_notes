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
