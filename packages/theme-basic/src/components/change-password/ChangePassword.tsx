import React, { useEffect } from 'react';
import {
  Button,
  VStack,
  Input,
  Field,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useLocalization, useProfile } from '@abpjs/core';
import { Modal, useToaster } from '@abpjs/theme-shared';
import { Check } from 'lucide-react';

export interface ChangePasswordProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when visibility changes */
  onVisibleChange: (visible: boolean) => void;
}

interface ChangePasswordFormData {
  password: string;
  newPassword: string;
  repeatNewPassword: string;
}

/**
 * Change password modal component.
 * Translated from Angular ChangePasswordComponent.
 *
 * Provides a modal dialog for changing the user's password with:
 * - Current password input
 * - New password input with validation
 * - Confirm new password with match validation
 *
 * @example
 * ```tsx
 * <ChangePassword
 *   visible={isOpen}
 *   onVisibleChange={setIsOpen}
 * />
 * ```
 */
export function ChangePassword({
  visible,
  onVisibleChange,
}: ChangePasswordProps): React.ReactElement {
  const { t } = useLocalization();
  const { changePassword } = useProfile();
  const toaster = useToaster();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  // Watch new password for confirmation validation
  const newPassword = watch('newPassword');

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.password,
        newPassword: data.newPassword,
      });

      toaster.success(
        t('AbpIdentity::PasswordChangedMessage') || 'Password changed successfully',
        t('AbpUi::Success') || 'Success'
      );

      onVisibleChange(false);
    } catch (error) {
      toaster.error(
        error instanceof Error ? error.message : 'An error occurred',
        t('AbpIdentity::PasswordChangeFailed') || 'Failed to change password'
      );
    }
  };

  const handleClose = () => {
    onVisibleChange(false);
  };

  // Password validation rules
  const passwordValidation = {
    required: t('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
    minLength: {
      value: 6,
      message: t('AbpIdentity::PasswordTooShort') || 'Password must be at least 6 characters',
    },
    validate: {
      hasLowercase: (value: string) =>
        /[a-z]/.test(value) ||
        t('AbpIdentity::PasswordRequiresLower') ||
        'Password must contain a lowercase letter',
      hasUppercase: (value: string) =>
        /[A-Z]/.test(value) ||
        t('AbpIdentity::PasswordRequiresUpper') ||
        'Password must contain an uppercase letter',
      hasNumber: (value: string) =>
        /[0-9]/.test(value) ||
        t('AbpIdentity::PasswordRequiresDigit') ||
        'Password must contain a number',
      hasSpecial: (value: string) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        t('AbpIdentity::PasswordRequiresNonAlphanumeric') ||
        'Password must contain a special character',
    },
  };

  const modalFooter = (
    <>
      <Button variant="ghost" mr={3} onClick={handleClose}>
        {t('AbpIdentity::Cancel') || 'Cancel'}
      </Button>
      <Button
        colorPalette="blue"
        type="submit"
        loading={isSubmitting}
        form="change-password-form"
      >
        <Check size={16} />
        {t('AbpIdentity::Save') || 'Save'}
      </Button>
    </>
  );

  return (
    <Modal
      visible={visible}
      onVisibleChange={onVisibleChange}
      header={t('AbpIdentity::ChangePassword') || 'Change Password'}
      footer={modalFooter}
      centered
    >
      <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4}>
          {/* Current Password */}
          <Field.Root invalid={!!errors.password}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:CurrentPassword') || 'Current Password'}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="password"
              {...register('password', {
                required:
                  t('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
              })}
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          {/* New Password */}
          <Field.Root invalid={!!errors.newPassword}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:NewPassword') || 'New Password'}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="password"
              {...register('newPassword', passwordValidation)}
            />
            <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
          </Field.Root>

          {/* Confirm New Password */}
          <Field.Root invalid={!!errors.repeatNewPassword}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:NewPasswordConfirm') ||
                'Confirm New Password'}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="password"
              {...register('repeatNewPassword', {
                required:
                  t('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
                validate: (value) =>
                  value === newPassword ||
                  t('AbpIdentity::Identity.PasswordConfirmationFailed') ||
                  'Passwords do not match',
              })}
            />
            <Field.ErrorText>{errors.repeatNewPassword?.message}</Field.ErrorText>
          </Field.Root>
        </VStack>
      </form>
    </Modal>
  );
}

export default ChangePassword;
