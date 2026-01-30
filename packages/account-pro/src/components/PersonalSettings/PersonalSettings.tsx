import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalization } from '@abpjs/core';
import { Alert, Button, useToaster } from '@abpjs/theme-shared';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useAccountProService } from '../../hooks/useAccountProService';
import type { PersonalSettingsFormData } from '../../models';
import { Container, Field, Flex, InputGroup, Stack } from '@chakra-ui/react';
import { LuUser, LuMail, LuPhone } from 'react-icons/lu';

const personalSettingsSchema = z.object({
  userName: z.string().min(1, 'Username is required').max(256, 'Username is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  name: z.string().max(64, 'Name is too long').optional(),
  surname: z.string().max(64, 'Surname is too long').optional(),
  phoneNumber: z.string().max(16, 'Phone number is too long').optional(),
});

export interface PersonalSettingsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * PersonalSettings - User profile settings form
 * @since 0.7.2 (Pro feature)
 */
export function PersonalSettings({ onSuccess, onError }: PersonalSettingsProps) {
  const { t } = useLocalization();
  const accountService = useAccountProService();
  const toaster = useToaster();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PersonalSettingsFormData>({
    resolver: zodResolver(personalSettingsSchema),
    defaultValues: { userName: '', email: '', name: '', surname: '', phoneNumber: '' },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await accountService.getProfile();
        reset({
          userName: profile.userName,
          email: profile.email,
          name: profile.name || '',
          surname: profile.surname || '',
          phoneNumber: profile.phoneNumber || '',
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load profile');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [accountService, reset]);

  const onSubmit = async (data: PersonalSettingsFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await accountService.updateProfile(data);
      toaster.success(t('AbpAccount::PersonalSettingsSaved') || 'Profile updated successfully');
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to update profile';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Flex height="full" flex="1" alignItems="center" justifyContent="center">
        <Box>Loading...</Box>
      </Flex>
    );
  }

  return (
    <Flex height="full" flex="1">
      <Box flex="1" py={{ base: '12', md: '16' }}>
        <Container maxW="md">
          <Stack gap="8">
            <Stack gap={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xl', md: '2xl' }}>{t('AbpAccount::PersonalSettings') || 'Personal Settings'}</Heading>
            </Stack>
            {error && <Alert status="error">{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  <Field.Root invalid={!!errors.userName}>
                    <Field.Label>{t('AbpAccount::UserName') || 'Username'}</Field.Label>
                    <InputGroup startElement={<LuUser />} width="full">
                      <Input id="userName" type="text" {...register('userName')} />
                    </InputGroup>
                    {errors.userName && <Field.ErrorText>{errors.userName.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>{t('AbpAccount::EmailAddress') || 'Email'}</Field.Label>
                    <InputGroup startElement={<LuMail />} width="full">
                      <Input id="email" type="email" {...register('email')} />
                    </InputGroup>
                    {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>{t('AbpAccount::Name') || 'Name'}</Field.Label>
                    <InputGroup startElement={<LuUser />} width="full">
                      <Input id="name" type="text" {...register('name')} />
                    </InputGroup>
                    {errors.name && <Field.ErrorText>{errors.name.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.surname}>
                    <Field.Label>{t('AbpAccount::Surname') || 'Surname'}</Field.Label>
                    <InputGroup startElement={<LuUser />} width="full">
                      <Input id="surname" type="text" {...register('surname')} />
                    </InputGroup>
                    {errors.surname && <Field.ErrorText>{errors.surname.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.phoneNumber}>
                    <Field.Label>{t('AbpAccount::PhoneNumber') || 'Phone Number'}</Field.Label>
                    <InputGroup startElement={<LuPhone />} width="full">
                      <Input id="phoneNumber" type="tel" {...register('phoneNumber')} />
                    </InputGroup>
                    {errors.phoneNumber && <Field.ErrorText>{errors.phoneNumber.message}</Field.ErrorText>}
                  </Field.Root>
                  <Button type="submit" colorPalette="blue" loading={isLoading}>
                    {t('AbpAccount::Save') || 'Save'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}

export default PersonalSettings;
