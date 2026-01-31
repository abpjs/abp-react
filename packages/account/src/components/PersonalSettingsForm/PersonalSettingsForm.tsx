import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalization, useProfile, Profile } from '@abpjs/core';
import { Button, useToaster } from '@abpjs/theme-shared';
import { Input, Stack } from '@chakra-ui/react';
import { Field, InputGroup } from '@chakra-ui/react';
import { LuMail, LuUser, LuPhone } from 'react-icons/lu';

/**
 * Zod schema for personal settings form validation
 */
const personalSettingsSchema = z.object({
  userName: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be at most 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z.string().max(64, 'Name must be at most 64 characters').optional(),
  surname: z.string().max(64, 'Surname must be at most 64 characters').optional(),
  phoneNumber: z.string().max(16, 'Phone number must be at most 16 characters').optional(),
});

type PersonalSettingsFormData = z.infer<typeof personalSettingsSchema>;

/**
 * Props for PersonalSettingsForm component
 */
export interface PersonalSettingsFormProps {
  /**
   * Callback fired on successful profile update
   */
  onSuccess?: () => void;

  /**
   * Callback fired on profile update error
   */
  onError?: (error: string) => void;
}

/**
 * PersonalSettingsForm - User personal settings form component
 *
 * This is the React equivalent of Angular's PersonalSettingsComponent.
 * It provides a form for authenticated users to update their personal information.
 *
 * @since 1.1.0
 *
 * @example
 * ```tsx
 * <PersonalSettingsForm
 *   onSuccess={() => console.log('Profile updated!')}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export function PersonalSettingsForm({ onSuccess, onError }: PersonalSettingsFormProps) {
  const { t } = useLocalization();
  const { profile, loading, fetchProfile, updateProfile } = useProfile();
  const toaster = useToaster();

  const [inProgress, setInProgress] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalSettingsFormData>({
    resolver: zodResolver(personalSettingsSchema),
    defaultValues: {
      userName: '',
      email: '',
      name: '',
      surname: '',
      phoneNumber: '',
    },
  });

  // Fetch profile on mount (ngOnInit equivalent)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Build form when profile data changes (buildForm equivalent)
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

  /**
   * Handle form submission
   */
  const submit = async (data: PersonalSettingsFormData) => {
    setInProgress(true);

    try {
      const updateData: Profile.Response = {
        userName: data.userName,
        email: data.email,
        name: data.name || '',
        surname: data.surname || '',
        phoneNumber: data.phoneNumber || '',
      };

      await updateProfile(updateData);

      toaster.success(
        t('AbpAccount::PersonalSettingsSaved') || 'Personal settings have been saved successfully.',
        t('AbpAccount::Success') || 'Success'
      );

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

  if (loading && !profile) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <Stack gap="5">
        {/* Username Field */}
        <Field.Root invalid={!!errors.userName}>
          <Field.Label>{t('AbpAccount::UserName')}</Field.Label>
          <InputGroup startElement={<LuUser />} width="full">
            <Input
              id="user-name"
              type="text"
              autoComplete="username"
              {...register('userName')}
            />
          </InputGroup>
          {errors.userName && <Field.ErrorText>{errors.userName.message}</Field.ErrorText>}
        </Field.Root>

        {/* Email Field */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>{t('AbpAccount::EmailAddress')}</Field.Label>
          <InputGroup startElement={<LuMail />} width="full">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
          </InputGroup>
          {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
        </Field.Root>

        {/* Name Field */}
        <Field.Root invalid={!!errors.name}>
          <Field.Label>{t('AbpAccount::DisplayName:Name')}</Field.Label>
          <InputGroup startElement={<LuUser />} width="full">
            <Input
              id="name"
              type="text"
              autoComplete="given-name"
              {...register('name')}
            />
          </InputGroup>
          {errors.name && <Field.ErrorText>{errors.name.message}</Field.ErrorText>}
        </Field.Root>

        {/* Surname Field */}
        <Field.Root invalid={!!errors.surname}>
          <Field.Label>{t('AbpAccount::DisplayName:Surname')}</Field.Label>
          <InputGroup startElement={<LuUser />} width="full">
            <Input
              id="surname"
              type="text"
              autoComplete="family-name"
              {...register('surname')}
            />
          </InputGroup>
          {errors.surname && <Field.ErrorText>{errors.surname.message}</Field.ErrorText>}
        </Field.Root>

        {/* Phone Number Field */}
        <Field.Root invalid={!!errors.phoneNumber}>
          <Field.Label>{t('AbpAccount::PhoneNumber')}</Field.Label>
          <InputGroup startElement={<LuPhone />} width="full">
            <Input
              id="phone-number"
              type="tel"
              autoComplete="tel"
              {...register('phoneNumber')}
            />
          </InputGroup>
          {errors.phoneNumber && <Field.ErrorText>{errors.phoneNumber.message}</Field.ErrorText>}
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

export default PersonalSettingsForm;
