import { User, Mail, Lock, Check } from "lucide-react";
import { useSignupForm } from "@features/signup";
import { SignupHeader, SignupFooter, SocialButton } from "@features/signup";
import { InputField, ErrorMessage } from "@features/login";
import "./signup.css";
import { SignupProps } from "@types/signup";

export function Signup({
  onSubmit,
  onGoogleSignup,
  onFacebookSignup,
  onSignIn,
}: SignupProps = {}) {
  const { formData, errors, isLoading, updateField, handleSubmit } =
    useSignupForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateField(
      name as keyof typeof formData,
      type === "checkbox" ? checked : value
    );
  };

  return (
    <div className="signup-container">
      <SignupHeader />

      {errors.general && <ErrorMessage message={errors.general} />}

      {/* Social Login Buttons */}
      <div className="signup-social-section">
        <SocialButton
          provider="google"
          onClick={onGoogleSignup}
          disabled={isLoading}
        />
        <SocialButton
          provider="facebook"
          onClick={onFacebookSignup}
          disabled={isLoading}
        />
      </div>

      <div className="signup-divider">
        <div className="signup-divider-line"></div>
        <span className="signup-divider-text">Or sign up with email</span>
        <div className="signup-divider-line"></div>
      </div>

      <form onSubmit={handleFormSubmit} className="signup-form">
        <div className="signup-name-row">
          <InputField
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            value={formData.firstName}
            placeholder="John"
            autoComplete="given-name"
            icon={<User className="signup-input-icon-svg" />}
            error={errors.firstName}
            onChange={handleInputChange}
          />
          <InputField
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            value={formData.lastName}
            placeholder="Doe"
            autoComplete="family-name"
            icon={<User className="signup-input-icon-svg" />}
            error={errors.lastName}
            onChange={handleInputChange}
          />
        </div>

        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="signup-input-icon-svg" />}
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
          autoComplete="new-password"
          icon={<Lock className="signup-input-icon-svg" />}
          error={errors.password}
          onChange={handleInputChange}
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock className="signup-input-icon-svg" />}
          error={errors.confirmPassword}
          onChange={handleInputChange}
        />

        <div className="signup-terms">
          <div className="signup-terms-container">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              className="signup-checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <label htmlFor="agreeToTerms" className="signup-terms-label">
              I agree to the{" "}
              <a href="#" className="signup-terms-link">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="signup-terms-link">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <div className="signup-field-error">{errors.agreeToTerms}</div>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="signup-button">
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <SignupFooter onSignIn={onSignIn} />
    </div>
  );
}