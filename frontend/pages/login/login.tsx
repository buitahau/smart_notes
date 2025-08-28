import { useEffect } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useLoginForm } from '@features/login';
import { LoginHeader, LoginFooter, InputField, ErrorMessage } from '@features/login';
import { SocialButton } from '@features/signup';
import './login.css';
import { LoginFormData } from '@types/login';
import { useMiniRouter } from '@context/router-context';
import { signIn } from '@services/auth-service';
import { supabaseClient } from '@services/supabase-client-service';

export function Login() {
  const { navigate } = useMiniRouter();
  const { formData, errors, isLoading, updateField, handleSubmit } = useLoginForm();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        const session = data.session;
        if (session) {
          navigate('home');
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
      }
    };

    checkAuthToken();
  }, [navigate]);

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
    // In a real app, you would typically validate credentials here
    const response = await signIn(data);
    if (!response.error) {
      navigate('home');
    }
    return Promise.resolve();
  };

  const onSignUp = () => {
    navigate('signup');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateField(name as keyof typeof formData, type === 'checkbox' ? checked : value);
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const onForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="login-container">
      <LoginHeader />

      {errors.general && <ErrorMessage message={errors.general} />}

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
