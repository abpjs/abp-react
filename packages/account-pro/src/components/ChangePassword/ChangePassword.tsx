import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalization } from '@abpjs/core';
import { Alert, Button, useToaster } from '@abpjs/theme-shared';
import { Box, Heading, Input } from '@chakra-ui/react';
import { useAccountProService } from '../../hooks/useAccountProService';
import type { ChangePasswordFormData } from '../../models';
import { Container, Field, Flex, InputGroup, Stack } from '@chakra-ui/react';
import { LuLock } from 'react-icons/lu';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(32, 'Password must be at most 32 characters'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

export interface ChangePasswordProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * ChangePassword - Password change form component
 * @since 0.7.2 (Pro feature)
 */
export function ChangePassword({ onSuccess, onError }: ChangePasswordProps) {
  const { t } = useLocalization();
  const accountService = useAccountProService();
  const toaster = useToaster();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await accountService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toaster.success(t('AbpAccount::PasswordChangedMessage') || 'Password changed successfully');
      reset();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to change password';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex height="full" flex="1">
      <Box flex="1" py={{ base: '12', md: '16' }}>
        <Container maxW="md">
          <Stack gap="8">
            <Stack gap={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xl', md: '2xl' }}>{t('AbpAccount::ChangePassword') || 'Change Password'}</Heading>
            </Stack>
            {error && <Alert status="error">{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  <Field.Root invalid={!!errors.currentPassword}>
                    <Field.Label>{t('AbpAccount::CurrentPassword') || 'Current Password'}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input id="current-password" type="password" autoComplete="current-password" {...register('currentPassword')} />
                    </InputGroup>
                    {errors.currentPassword && <Field.ErrorText>{errors.currentPassword.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.newPassword}>
                    <Field.Label>{t('AbpAccount::NewPassword') || 'New Password'}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input id="new-password" type="password" autoComplete="new-password" {...register('newPassword')} />
                    </InputGroup>
                    {errors.newPassword && <Field.ErrorText>{errors.newPassword.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.confirmNewPassword}>
                    <Field.Label>{t('AbpAccount::ConfirmNewPassword') || 'Confirm New Password'}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input id="confirm-new-password" type="password" autoComplete="new-password" {...register('confirmNewPassword')} />
                    </InputGroup>
                    {errors.confirmNewPassword && <Field.ErrorText>{errors.confirmNewPassword.message}</Field.ErrorText>}
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

export default ChangePassword;
