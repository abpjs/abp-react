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
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useLocalization, useProfile } from '@abpjs/core';

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
 * Translated from Angular ProfileComponent.
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
  const toast = useToast();

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

      toast({
        title: t('AbpIdentity::ProfileUpdatedMessage') || 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onVisibleChange(false);
    } catch (error) {
      toast({
        title: t('AbpIdentity::ProfileUpdateFailed') || 'Failed to update profile',
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

  return (
    <Modal isOpen={visible} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {t('AbpIdentity::PersonalInfo') || 'Personal Info'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              {/* Username */}
              <FormControl isInvalid={!!errors.userName}>
                <FormLabel>
                  {t('AbpIdentity::DisplayName:UserName') || 'Username'}
                  <span style={{ color: 'red' }}> *</span>
                </FormLabel>
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
                <FormErrorMessage>{errors.userName?.message}</FormErrorMessage>
              </FormControl>

              {/* Name and Surname in a row */}
              <HStack spacing={4} w="full">
                {/* Name */}
                <FormControl isInvalid={!!errors.name} flex={1}>
                  <FormLabel>
                    {t('AbpIdentity::DisplayName:Name') || 'Name'}
                  </FormLabel>
                  <Input
                    type="text"
                    {...register('name', {
                      maxLength: {
                        value: 64,
                        message: 'Maximum 64 characters',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                {/* Surname */}
                <FormControl isInvalid={!!errors.surname} flex={1}>
                  <FormLabel>
                    {t('AbpIdentity::DisplayName:Surname') || 'Surname'}
                  </FormLabel>
                  <Input
                    type="text"
                    {...register('surname', {
                      maxLength: {
                        value: 64,
                        message: 'Maximum 64 characters',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>
                  {t('AbpIdentity::DisplayName:EmailAddress') || 'Email Address'}
                  <span style={{ color: 'red' }}> *</span>
                </FormLabel>
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
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Phone Number */}
              <FormControl isInvalid={!!errors.phoneNumber}>
                <FormLabel>
                  {t('AbpIdentity::DisplayName:PhoneNumber') || 'Phone Number'}
                </FormLabel>
                <Input
                  type="tel"
                  {...register('phoneNumber', {
                    maxLength: {
                      value: 16,
                      message: 'Maximum 16 characters',
                    },
                  })}
                />
                <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              {t('AbpIdentity::Cancel') || 'Cancel'}
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting || loading}
              leftIcon={<span>&#10003;</span>}
            >
              {t('AbpIdentity::Save') || 'Save'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default Profile;
