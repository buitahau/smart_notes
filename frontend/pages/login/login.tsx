import { useEffect, useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useLoginForm } from '@features/login';
import {
  LoginHeader,
  LoginFooter,
  InputField,
  ErrorMessage,
  NotificationMessage,
} from '@features/login';
import { SocialButton } from '@features/signup';
import './login.css';
import { LoginFormData } from '@types/login';
import { useMiniRouter } from '@context/router-context';
import { signIn, validateToken } from '@services/auth-service';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';
import { NotificationMessageProps } from '@types/login';

export function Login() {
  const { params, navigate } = useMiniRouter();
  const { formData, errors, isLoading, updateField, handleSubmit } = useLoginForm();
  const [notification, setNotification] = useState<NotificationMessageProps | null>(null);

  // Handle notification params
  useEffect(() => {
    if (params?.notification) {
      showNotification(params.notification);
    }
  }, [params]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  const onFacebookLogin = () => {
    // Handle Facebook OAuth login
    console.log('Facebook login initiated');
    // In a real app, you would integrate with Facebook OAuth
    navigate('home');
  };

  const onGoogleLogin = () => {
    // Handle Google OAuth login
    console.log('Google login initiated');
    // In a real app, you would integrate with Google OAuth
    navigate('home');
  };

  const onSubmit = async (data: LoginFormData) => {
    const response = await signIn(data);
    return Promise.resolve(response);
  };

  const onSignUp = () => {
    navigate('signup');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateField(name as keyof typeof formData, type === 'checkbox' ? checked : value);
  };

  const onForgotPassword = () => {
    navigate('forgot-password');
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onForgotPassword();
  };

  // Function to show notification (can be called from signup or other components)
  const showNotification = (payload: NotificationMessageProps) => {
    setNotification(payload);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="login-container">
      <LoginHeader />

      {/* Social Login Buttons */}
      <div className="login-social-section">
        <SocialButton provider="google" onClick={onGoogleLogin} disabled={isLoading} />
        <SocialButton provider="facebook" onClick={onFacebookLogin} disabled={isLoading} />
      </div>

      <div className="login-divider">
        <div className="login-divider-line"></div>
        <span className="login-divider-text">Or sign in with email</span>
        <div className="login-divider-line"></div>
      </div>

      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}

      {errors.general && <ErrorMessage message={errors.general} />}

      <form onSubmit={handleFormSubmit} className="login-form">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="login-input-icon-svg" />}
          error={errors.email}
          onChange={handleInputChange}
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock className="login-input-icon-svg" />}
          error={errors.password}
          onChange={handleInputChange}
        />

        <div className="login-remember-me">
          <div className="login-remember-me-container">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="login-checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="rememberMe" className="login-remember-me-label">
              Remember me
            </label>
          </div>

          <div className="login-forgot-password-container">
            <a href="#" className="login-forgot-password" onClick={handleForgotPasswordClick}>
              Forgot your password?
            </a>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <LoginFooter onSignUp={onSignUp} />
    </div>
  );
}
