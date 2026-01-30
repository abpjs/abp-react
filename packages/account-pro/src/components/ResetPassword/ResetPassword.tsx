import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Alert, Button } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link } from '@chakra-ui/react';
import { useAccountProService } from '../../hooks/useAccountProService';
import type { ResetPasswordFormData } from '../../models';
import {
  Container,
  Field,
  Flex,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuLock } from 'react-icons/lu';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(32, 'Password must be at most 32 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export interface ResetPasswordProps {
  loginUrl?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ResetPassword({
  loginUrl = '/account/login',
  onSuccess,
  onError,
}: ResetPasswordProps) {
  const { t } = useLocalization();
  const [searchParams] = useSearchParams();
  const accountService = useAccountProService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const userId = searchParams.get('userId') || searchParams.get('UserId') || '';
  const resetToken = searchParams.get('resetToken') || searchParams.get('ResetToken') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!userId || !resetToken) {
      setError(t('AbpAccount::InvalidResetLink') || 'Invalid password reset link');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await accountService.resetPassword({
        userId,
        resetToken,
        password: data.password,
      });
      setIsPasswordReset(true);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.message ||
        'Failed to reset password';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || !resetToken) {
    return (
      <Flex height="full" flex="1">
        <Box flex="1" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="8">
              <Alert status="error">
                {t('AbpAccount::InvalidResetLink') || 'Invalid password reset link.'}
              </Alert>
              <Link asChild variant="plain" textAlign="center">
                <RouterLink to="/account/forgot-password">
                  {t('AbpAccount::ForgotPassword') || 'Forgot Password'}
                </RouterLink>
              </Link>
            </Stack>
          </Container>
        </Box>
      </Flex>
    );
  }

  if (isPasswordReset) {
    return (
      <Flex height="full" flex="1">
        <Box flex="1" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="8">
              <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                <Heading size={{ base: 'xl', md: '2xl' }}>
                  {t('AbpAccount::PasswordResetSuccess') || 'Password Reset Successful'}
                </Heading>
                <Text color="fg.muted">
                  Your password has been reset successfully.
                </Text>
              </Stack>
              <Link asChild variant="plain" textAlign="center">
                <RouterLink to={loginUrl}>{t('AbpAccount::Login') || 'Login'}</RouterLink>
              </Link>
            </Stack>
          </Container>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex height="full" flex="1">
      <Box flex="1" py={{ base: '24', md: '32' }}>
        <Container maxW="md">
          <Stack gap="8">
            <Stack gap={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: '2xl', md: '3xl' }}>
                {t('AbpAccount::ResetPassword') || 'Reset Password'}
              </Heading>
              <Text color="fg.muted">Enter your new password below.</Text>
            </Stack>
            {error && <Alert status="error">{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>{t('AbpAccount::NewPassword') || 'New Password'}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input
                        id="reset-password-new"
                        type="password"
                        autoComplete="new-password"
                        {...register('password')}
                      />
                    </InputGroup>
                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.confirmPassword}>
                    <Field.Label>{t('AbpAccount::ConfirmPassword') || 'Confirm Password'}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input
                        id="reset-password-confirm"
                        type="password"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                      />
                    </InputGroup>
                    {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword.message}</Field.ErrorText>}
                  </Field.Root>
                  <Button type="submit" colorPalette="blue" loading={isLoading}>
                    {t('AbpAccount::ResetPassword') || 'Reset Password'}
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

export default ResetPassword;
