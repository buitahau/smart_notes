interface LoginFooterProps {
  onSignUp?: () => void;
}

export const LoginFooter = ({ onSignUp }: LoginFooterProps) => {
  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignUp) {
      onSignUp();
    }
  };

  return (
    <div className="login-footer">
      <p className="login-footer-text">
        Don't have an account?{' '}
        <a href="#" className="login-signup-link" onClick={handleSignUpClick}>
          Sign up
        </a>
      </p>
    </div>
  );
};
