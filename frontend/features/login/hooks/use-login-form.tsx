import { useState } from 'react';
import { LoginFormData, LoginErrors, LoginResponse } from '@types/login';
import { validateLoginForm } from '@features/login/utils';
import { useMiniRouter } from '@context/router-context';

export const useLoginForm = () => {
  const { navigate } = useMiniRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (onSubmit?: (data: LoginFormData) => Promise<LoginResponse>) => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        const response = await onSubmit(formData);
        if (!response.error) {
          navigate('home');
        }
        if (response.error) {
          const errors: LoginErrors = {};
          errors.general = 'Invalid email or password';
          setErrors(errors);
        }
      } else {
        // Default behavior - log to console
        console.log('Login attempt with:', formData);
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred during login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    updateField,
    handleSubmit,
  };
};
