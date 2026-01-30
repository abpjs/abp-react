import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Alert, Button } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link } from '@chakra-ui/react';
import { useAccountProService } from '../../hooks/useAccountProService';
import type { ForgotPasswordFormData } from '../../models';
import {
  Container,
  Field,
  Flex,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuMail } from 'react-icons/lu';

/**
 * Zod schema for forgot password form validation
 */
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

/**
 * Props for ForgotPassword component
 */
export interface ForgotPasswordProps {
  /**
   * Custom login URL
   * @default '/account/login'
   */
  loginUrl?: string;

  /**
   * Callback fired when reset email is sent successfully
   */
  onSuccess?: () => void;

  /**
   * Callback fired on error
   */
  onError?: (error: string) => void;
}

/**
 * ForgotPassword - Password recovery form component
 *
 * This is the React equivalent of Angular's ForgotPasswordComponent from @volo/abp.ng.account.
 * It allows users to request a password reset code sent to their email.
 *
 * @since 0.7.2 (Pro feature)
 *
 * @example
 * ```tsx
 * function ForgotPasswordPage() {
 *   return (
 *     <ForgotPassword
 *       onSuccess={() => console.log('Email sent!')}
 *     />
 *   );
 * }
 * ```
 */
export function ForgotPassword({
  loginUrl = '/account/login',
  onSuccess,
  onError,
}: ForgotPasswordProps) {
  const { t } = useLocalization();
  const accountService = useAccountProService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await accountService.sendPasswordResetCode({
        email: data.email,
        appName: 'Angular', // For compatibility with ABP backend
      });
      setIsEmailSent(true);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error?.message ||
        err?.message ||
        t('AbpAccount::PasswordResetMailSentFailed') ||
        'Failed to send password reset email';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <Flex height="full" flex="1">
        <Box flex="1" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="8">
              <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                <Heading size={{ base: 'xl', md: '2xl' }}>
                  {t('AbpAccount::PasswordResetMailSentMessage') || 'Password Reset Email Sent'}
                </Heading>
                <Text color="fg.muted">
                  {t('AbpAccount::PasswordResetMailSentInfo') ||
                    'Please check your email for instructions to reset your password.'}
                </Text>
              </Stack>
              <Link asChild variant="plain" textAlign="center">
                <RouterLink to={loginUrl}>{t('AbpAccount::BackToLogin') || 'Back to Login'}</RouterLink>
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
                {t('AbpAccount::ForgotPassword') || 'Forgot Password'}
              </Heading>
              <Text color="fg.muted">
                {t('AbpAccount::SendPasswordResetLink_Information') ||
                  'Enter your email address and we will send you a link to reset your password.'}
              </Text>
            </Stack>

            {/* Error Alert */}
            {error && (
              <Alert status="error">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  {/* Email Field */}
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>{t('AbpAccount::EmailAddress') || 'Email Address'}</Field.Label>
                    <InputGroup startElement={<LuMail />} width="full">
                      <Input
                        id="forgot-password-email"
                        type="email"
                        autoComplete="email"
                        placeholder="me@example.com"
                        {...register('email')}
                      />
                    </InputGroup>
                    {errors.email && (
                      <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={isLoading}
                    loadingText={t('AbpAccount::Submit') || 'Submit'}
                  >
                    {t('AbpAccount::Submit') || 'Submit'}
                  </Button>

                  {/* Back to Login Link */}
                  <Link asChild variant="plain" textAlign="center">
                    <RouterLink to={loginUrl}>{t('AbpAccount::BackToLogin') || 'Back to Login'}</RouterLink>
                  </Link>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}

export default ForgotPassword;
