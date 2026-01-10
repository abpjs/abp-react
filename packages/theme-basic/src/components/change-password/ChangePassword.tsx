import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useLocalization, useProfile } from '@abpjs/core';

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
  const { instant } = useLocalization();
  const { changePassword } = useProfile();
  const toast = useToast();

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

      toast({
        title: instant('AbpIdentity::PasswordChangedMessage') || 'Password changed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onVisibleChange(false);
    } catch (error) {
      toast({
        title: instant('AbpIdentity::PasswordChangeFailed') || 'Failed to change password',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    onVisibleChange(false);
  };

  // Password validation rules
  const passwordValidation = {
    required: instant('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
    minLength: {
      value: 6,
      message: instant('AbpIdentity::PasswordTooShort') || 'Password must be at least 6 characters',
    },
    validate: {
      hasLowercase: (value: string) =>
        /[a-z]/.test(value) ||
        instant('AbpIdentity::PasswordRequiresLower') ||
        'Password must contain a lowercase letter',
      hasUppercase: (value: string) =>
        /[A-Z]/.test(value) ||
        instant('AbpIdentity::PasswordRequiresUpper') ||
        'Password must contain an uppercase letter',
      hasNumber: (value: string) =>
        /[0-9]/.test(value) ||
        instant('AbpIdentity::PasswordRequiresDigit') ||
        'Password must contain a number',
      hasSpecial: (value: string) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        instant('AbpIdentity::PasswordRequiresNonAlphanumeric') ||
        'Password must contain a special character',
    },
  };

  return (
    <Modal isOpen={visible} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {instant('AbpIdentity::ChangePassword') || 'Change Password'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              {/* Current Password */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>
                  {instant('AbpIdentity::DisplayName:CurrentPassword') || 'Current Password'}
                  <span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  type="password"
                  {...register('password', {
                    required:
                      instant('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              {/* New Password */}
              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel>
                  {instant('AbpIdentity::DisplayName:NewPassword') || 'New Password'}
                  <span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  type="password"
                  {...register('newPassword', passwordValidation)}
                />
                <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
              </FormControl>

              {/* Confirm New Password */}
              <FormControl isInvalid={!!errors.repeatNewPassword}>
                <FormLabel>
                  {instant('AbpIdentity::DisplayName:NewPasswordConfirm') ||
                    'Confirm New Password'}
                  <span style={{ color: 'red' }}> *</span>
                </FormLabel>
                <Input
                  type="password"
                  {...register('repeatNewPassword', {
                    required:
                      instant('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
                    validate: (value) =>
                      value === newPassword ||
                      instant('AbpIdentity::Identity.PasswordConfirmationFailed') ||
                      'Passwords do not match',
                  })}
                />
                <FormErrorMessage>{errors.repeatNewPassword?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              {instant('AbpIdentity::Cancel') || 'Cancel'}
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<span>&#10003;</span>}
            >
              {instant('AbpIdentity::Save') || 'Save'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default ChangePassword;
