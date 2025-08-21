import { useState } from 'react';
import './style.css';
import { Login } from '@pages/login';
import { Signup } from '@pages/signup';
import { Home } from '@pages/home';
import { LoginFormData, SignupFormData } from '@types';
import { signUp } from '@services';

type AppView = 'login' | 'signup' | 'home';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');

  const handleLoginSuccess = async (data: LoginFormData) => {
    // In a real app, you would typically validate credentials here
    console.log('Login successful', data);
    setCurrentView('home');
    return Promise.resolve();
  };

  const handleSignupSuccess = async (data: SignupFormData) => {
    try {
      console.log('Attempting signup', data);
      const response = await signUp(data);
      
      if (response.error) {
        console.error('Signup failed:', response.error);
        // Handle signup error (show error message to user)
        return;
      }
      
      console.log('Signup successful', response.user);
      setCurrentView('home');
    } catch (error) {
      console.error('Unexpected error during signup:', error);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google OAuth login
    console.log('Google login initiated');
    // In a real app, you would integrate with Google OAuth
    setCurrentView('home');
  };

  const handleFacebookLogin = () => {
    // Handle Facebook OAuth login
    console.log('Facebook login initiated');
    // In a real app, you would integrate with Facebook OAuth
    setCurrentView('home');
  };

  const handleGoogleSignup = () => {
    // Handle Google OAuth signup
    console.log('Google signup initiated');
    // In a real app, you would integrate with Google OAuth
    setCurrentView('home');
  };

  const handleFacebookSignup = () => {
    // Handle Facebook OAuth signup
    console.log('Facebook signup initiated');
    // In a real app, you would integrate with Facebook OAuth
    setCurrentView('home');
  };

  const navigateToSignup = () => {
    setCurrentView('signup');
  };

  const navigateToLogin = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <Signup
            onSubmit={handleSignupSuccess}
            onGoogleSignup={handleGoogleSignup}
            onFacebookSignup={handleFacebookSignup}
            onSignIn={navigateToLogin}
          />
        );
      case 'home':
        return <Home />;
      case 'login':
      default:
        return (
          <Login
            onSubmit={handleLoginSuccess}
            onSignUp={navigateToSignup}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {renderCurrentView()}
      </div>
    </div>
  );
}

export default App;