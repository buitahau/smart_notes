import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { InputField } from '@features/login';
import { useMiniRouter } from '@context/router-context';
import '../login/login.css';
import './change-password.css';

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialForm: ChangePasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ChangePassword() {
  const { navigate } = useMiniRouter();
  const [form, setForm] = useState<ChangePasswordForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordForm, string>>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ChangePasswordForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setStatusMessage(null);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ChangePasswordForm, string>> = {};
    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = 'Current password is required';
    }
    if (!form.newPassword.trim()) {
      nextErrors.newPassword = 'New password is required';
    }
    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Confirm password is required';
    } else if (form.newPassword.trim() && form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setStatusMessage('Password updated successfully');
    setForm(initialForm);
  };

  return (
    <div className="change-password-wrapper">
      <button className="change-password-back" onClick={() => navigate('home')}>
        <ArrowLeft className="change-password-back-icon" />
        Back
      </button>

      <div className="login-container change-password-card">
        <div className="change-password-header">
          <div className="change-password-icon">
            <Lock className="change-password-icon-svg" />
          </div>
          <h2>Change password</h2>
          <p>Update your password to keep your account secure.</p>
        </div>

        {statusMessage && <div className="change-password-status">{statusMessage}</div>}

        <form className="change-password-form" onSubmit={handleSubmit}>
          <InputField
            id="current-password"
            name="currentPassword"
            type="password"
            label="Current password"
            value={form.currentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
            icon={<Lock className="login-input-icon-svg" />}
            error={errors.currentPassword}
            onChange={event => updateField('currentPassword', event.target.value)}
          />

          <InputField
            id="new-password"
            name="newPassword"
            type="password"
            label="New password"
            value={form.newPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
            icon={<Lock className="login-input-icon-svg" />}
            error={errors.newPassword}
            onChange={event => updateField('newPassword', event.target.value)}
          />

          <InputField
            id="confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            value={form.confirmPassword}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            icon={<Lock className="login-input-icon-svg" />}
            error={errors.confirmPassword}
            onChange={event => updateField('confirmPassword', event.target.value)}
          />

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
