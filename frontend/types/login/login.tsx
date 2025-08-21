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
  
  export interface LoginProps {
    onSubmit?: (data: LoginFormData) => Promise<void>;
    onForgotPassword?: () => void;
    onSignUp?: () => void;
    onGoogleLogin?: () => void;
    onFacebookLogin?: () => void;
  }