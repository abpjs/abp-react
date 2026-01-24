import React, { useEffect } from 'react';
import {
  Button,
  VStack,
  HStack,
  Input,
  Field,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useLocalization, useProfile } from '@abpjs/core';
import { Modal } from '../modal';
import { useToaster } from '../../contexts';
import { Check } from 'lucide-react';

export interface ProfileProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when visibility changes */
  onVisibleChange: (visible: boolean) => void;
}

interface ProfileFormData {
  userName: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

/**
 * Profile modal component for editing user profile.
 * Translated from Angular ProfileComponent (moved from theme-basic in v0.9.0).
 *
 * Provides a modal dialog for editing user profile with:
 * - Username (required)
 * - Email (required)
 * - Name
 * - Surname
 * - Phone number
 *
 * @example
 * ```tsx
 * <Profile
 *   visible={isOpen}
 *   onVisibleChange={setIsOpen}
 * />
 * ```
 */
export function Profile({
  visible,
  onVisibleChange,
}: ProfileProps): React.ReactElement {
  const { t } = useLocalization();
  const { profile, fetchProfile, updateProfile, loading } = useProfile();
  const toaster = useToaster();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      userName: '',
      email: '',
      name: '',
      surname: '',
      phoneNumber: '',
    },
  });

  // Track if modal is busy (submitting or loading)
  const modalBusy = isSubmitting || loading;

  // Fetch profile and populate form when modal opens
  useEffect(() => {
    if (visible) {
      fetchProfile().then(() => {
        // Profile will be available via the profile state
      });
    }
  }, [visible, fetchProfile]);

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        userName: profile.userName || '',
        email: profile.email || '',
        name: profile.name || '',
        surname: profile.surname || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);

      toaster.success(
        t('AbpIdentity::ProfileUpdatedMessage') || 'Profile updated successfully',
        t('AbpUi::Success') || 'Success'
      );

      onVisibleChange(false);
    } catch (error) {
      toaster.error(
        error instanceof Error ? error.message : 'An error occurred',
        t('AbpIdentity::ProfileUpdateFailed') || 'Failed to update profile'
      );
    }
  };

  const handleClose = () => {
    if (!modalBusy) {
      onVisibleChange(false);
    }
  };

  const modalFooter = (
    <>
      <Button variant="ghost" mr={3} onClick={handleClose} disabled={modalBusy}>
        {t('AbpIdentity::Cancel') || 'Cancel'}
      </Button>
      <Button
        colorPalette="blue"
        type="submit"
        loading={modalBusy}
        form="profile-form"
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
      busy={modalBusy}
      header={t('AbpIdentity::PersonalInfo') || 'Personal Info'}
      footer={modalFooter}
      size="lg"
      centered
    >
      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4}>
          {/* Username */}
          <Field.Root invalid={!!errors.userName}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:UserName') || 'Username'}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              {...register('userName', {
                required:
                  t('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
                maxLength: {
                  value: 256,
                  message: 'Maximum 256 characters',
                },
              })}
            />
            <Field.ErrorText>{errors.userName?.message}</Field.ErrorText>
          </Field.Root>

          {/* Name and Surname in a row */}
          <HStack gap={4} w="full">
            {/* Name */}
            <Field.Root invalid={!!errors.name} flex={1}>
              <Field.Label>
                {t('AbpIdentity::DisplayName:Name') || 'Name'}
              </Field.Label>
              <Input
                type="text"
                {...register('name', {
                  maxLength: {
                    value: 64,
                    message: 'Maximum 64 characters',
                  },
                })}
              />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>

            {/* Surname */}
            <Field.Root invalid={!!errors.surname} flex={1}>
              <Field.Label>
                {t('AbpIdentity::DisplayName:Surname') || 'Surname'}
              </Field.Label>
              <Input
                type="text"
                {...register('surname', {
                  maxLength: {
                    value: 64,
                    message: 'Maximum 64 characters',
                  },
                })}
              />
              <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
            </Field.Root>
          </HStack>

          {/* Email */}
          <Field.Root invalid={!!errors.email}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:EmailAddress') || 'Email Address'}
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="email"
              {...register('email', {
                required:
                  t('AbpIdentity::ThisFieldIsRequired') || 'This field is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('AbpIdentity::InvalidEmail') || 'Invalid email address',
                },
                maxLength: {
                  value: 256,
                  message: 'Maximum 256 characters',
                },
              })}
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          {/* Phone Number */}
          <Field.Root invalid={!!errors.phoneNumber}>
            <Field.Label>
              {t('AbpIdentity::DisplayName:PhoneNumber') || 'Phone Number'}
            </Field.Label>
            <Input
              type="tel"
              {...register('phoneNumber', {
                maxLength: {
                  value: 16,
                  message: 'Maximum 16 characters',
                },
              })}
            />
            <Field.ErrorText>{errors.phoneNumber?.message}</Field.ErrorText>
          </Field.Root>
        </VStack>
      </form>
    </Modal>
  );
}

export default Profile;
