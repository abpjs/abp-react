import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalization, useProfile } from '@abpjs/core';
import { Button, useToaster } from '@abpjs/theme-shared';
import { Input, Stack } from '@chakra-ui/react';
import { Field, InputGroup } from '@chakra-ui/react';
import { LuLock } from 'react-icons/lu';

/**
 * Password validation regex patterns
 * Matches Angular's validatePassword(['small', 'capital', 'number', 'special'])
 */
const passwordValidation = {
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Zod schema for change password form validation
 * Matches Angular validators
 */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(32, 'Password must be at most 32 characters')
      .refine(
        (val) => passwordValidation.hasLowercase.test(val),
        'Password must contain at least one lowercase letter'
      )
      .refine(
        (val) => passwordValidation.hasUppercase.test(val),
        'Password must contain at least one uppercase letter'
      )
      .refine(
        (val) => passwordValidation.hasNumber.test(val),
        'Password must contain at least one number'
      )
      .refine(
        (val) => passwordValidation.hasSpecial.test(val),
        'Password must contain at least one special character'
      ),
    confirmNewPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Props for ChangePasswordForm component
 */
export interface ChangePasswordFormProps {
  /**
   * Callback fired on successful password change
   */
  onSuccess?: () => void;

  /**
   * Callback fired on password change error
   */
  onError?: (error: string) => void;
}

/**
 * ChangePasswordForm - Password change form component
 *
 * This is the React equivalent of Angular's ChangePasswordComponent.
 * It provides a form for authenticated users to change their password.
 *
 * @since 1.1.0
 *
 * @example
 * ```tsx
 * <ChangePasswordForm
 *   onSuccess={() => console.log('Password changed!')}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export function ChangePasswordForm({ onSuccess, onError }: ChangePasswordFormProps) {
  const { t } = useLocalization();
  const { changePassword } = useProfile();
  const toaster = useToaster();

  const [inProgress, setInProgress] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // Initialize form on mount (ngOnInit equivalent)
  useEffect(() => {
    // Form is already initialized via defaultValues
    // This effect is here for consistency with Angular's OnInit pattern
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ChangePasswordFormData) => {
    setInProgress(true);

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toaster.success(
        t('AbpAccount::PasswordChangedMessage') || 'Your password has been changed successfully.',
        t('AbpAccount::Success') || 'Success'
      );

      // Reset form after successful change
      reset();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err?.error?.error_description ||
        err?.error?.error?.message ||
        t('AbpAccount::DefaultErrorMessage') ||
        'An error occurred';

      toaster.error(errorMessage, t('AbpUi::Error') || 'Error', { life: 7000 });
      onError?.(errorMessage);
    } finally {
      setInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap="5">
        {/* Current Password Field */}
        <Field.Root invalid={!!errors.currentPassword}>
          <Field.Label>{t('AbpAccount::CurrentPassword')}</Field.Label>
          <InputGroup startElement={<LuLock />} width="full">
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('currentPassword')}
            />
          </InputGroup>
          {errors.currentPassword && (
            <Field.ErrorText>{errors.currentPassword.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* New Password Field */}
        <Field.Root invalid={!!errors.newPassword}>
          <Field.Label>{t('AbpAccount::NewPassword')}</Field.Label>
          <InputGroup startElement={<LuLock />} width="full">
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('newPassword')}
            />
          </InputGroup>
          {errors.newPassword && (
            <Field.ErrorText>{errors.newPassword.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Confirm New Password Field */}
        <Field.Root invalid={!!errors.confirmNewPassword}>
          <Field.Label>{t('AbpAccount::NewPasswordConfirm')}</Field.Label>
          <InputGroup startElement={<LuLock />} width="full">
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('confirmNewPassword')}
            />
          </InputGroup>
          {errors.confirmNewPassword && (
            <Field.ErrorText>{errors.confirmNewPassword.message}</Field.ErrorText>
          )}
        </Field.Root>

        {/* Submit Button */}
        <Button
          type="submit"
          colorPalette="blue"
          loading={inProgress}
          loadingText={t('AbpAccount::Submit')}
        >
          {t('AbpAccount::Submit')}
        </Button>
      </Stack>
    </form>
  );
}

export default ChangePasswordForm;
