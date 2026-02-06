import { useState, useEffect, useMemo } from 'react';
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
 * Create Zod schema for change password form validation
 * Matches Angular validators
 *
 * @param hideCurrentPassword - Whether to hide the current password field
 * @since 3.1.0 - Added hideCurrentPassword parameter
 */
function createChangePasswordSchema(hideCurrentPassword: boolean) {
  const baseSchema = {
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
  };

  // Only require current password if not hidden
  const schema = hideCurrentPassword
    ? z.object({
        currentPassword: z.string().optional(),
        ...baseSchema,
      })
    : z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        ...baseSchema,
      });

  return schema.refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });
}

type ChangePasswordFormData = {
  currentPassword?: string;
  newPassword: string;
  confirmNewPassword: string;
};

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

  /**
   * Whether to hide the current password field.
   * When undefined, this is automatically determined based on the user's profile.
   * Users without a password (e.g., social login users) don't need to enter current password.
   *
   * @since 3.1.0
   */
  hideCurrentPassword?: boolean;
}

/**
 * ChangePasswordForm - Password change form component
 *
 * This is the React equivalent of Angular's ChangePasswordComponent.
 * It provides a form for authenticated users to change their password.
 *
 * @since 1.1.0
 * @since 3.1.0 - Added hideCurrentPassword prop for users without password (social login)
 *
 * @example
 * ```tsx
 * <ChangePasswordForm
 *   onSuccess={() => console.log('Password changed!')}
 *   onError={(err) => console.error(err)}
 * />
 *
 * // For social login users (no current password needed)
 * <ChangePasswordForm hideCurrentPassword={true} />
 * ```
 */
export function ChangePasswordForm({
  onSuccess,
  onError,
  hideCurrentPassword: hideCurrentPasswordProp,
}: ChangePasswordFormProps) {
  const { t } = useLocalization();
  const { profile, changePassword } = useProfile();
  const toaster = useToaster();

  const [inProgress, setInProgress] = useState(false);
  // Track if we should show current password after first successful change
  const [showCurrentPasswordAfterChange, setShowCurrentPasswordAfterChange] = useState(false);

  // Determine if current password should be hidden
  // v3.1.0: Hide current password if user doesn't have a password set (e.g., social login)
  const shouldHideCurrentPassword = useMemo(() => {
    // If explicitly set via prop, use that
    if (hideCurrentPasswordProp !== undefined) {
      return hideCurrentPasswordProp;
    }

    // After first password change, always show current password field
    if (showCurrentPasswordAfterChange) {
      return false;
    }

    // Auto-detect based on profile's hasPassword property
    // hasPassword === false means user logged in via social login and has no password
    return profile?.hasPassword === false;
  }, [hideCurrentPasswordProp, profile?.hasPassword, showCurrentPasswordAfterChange]);

  // Create schema based on whether current password is hidden
  const changePasswordSchema = useMemo(
    () => createChangePasswordSchema(shouldHideCurrentPassword),
    [shouldHideCurrentPassword]
  );

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

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ChangePasswordFormData) => {
    setInProgress(true);

    try {
      await changePassword({
        // Only include currentPassword if not hidden
        // v3.1.0: Support for users without password (social login)
        ...(!shouldHideCurrentPassword && data.currentPassword
          ? { currentPassword: data.currentPassword }
          : {}),
        newPassword: data.newPassword,
      });

      toaster.success(
        t('AbpAccount::PasswordChangedMessage') || 'Your password has been changed successfully.',
        t('AbpAccount::Success') || 'Success'
      );

      // Reset form after successful change
      reset();

      // v3.1.0: After first password change, show current password field
      // (user now has a password set)
      if (shouldHideCurrentPassword) {
        setShowCurrentPasswordAfterChange(true);
      }

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
        {/* Current Password Field - v3.1.0: Hide for users without password */}
        {!shouldHideCurrentPassword && (
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
        )}

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
