import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Alert, Button, Checkbox } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, HStack, Show } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import { usePasswordFlow } from '../../hooks';
import type { LoginFormData } from '../../models';
import {
  Card,
  Container,
  Field,
  Flex,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuLock, LuMail } from 'react-icons/lu';

/**
 * Zod schema for login form validation
 * Matches Angular validators: required, maxLength(255) for username, maxLength(32) for password
 */
const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be at most 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(32, 'Password must be at most 32 characters'),
  rememberMe: z.boolean().default(false),
});

/**
 * Props for LoginForm component
 */
export interface LoginFormProps {
  /**
   * Whether to show the tenant box
   * @default true
   */
  showTenantBox?: boolean;

  /**
   * Whether to show the register link
   * @default true
   */
  showRegisterLink?: boolean;

  /**
   * Whether to show the forgot password link (Pro feature)
   * @default true
   * @since 0.7.2
   */
  showForgotPasswordLink?: boolean;

  /**
   * Custom register URL
   * @default '/account/register'
   */
  registerUrl?: string;

  /**
   * Custom forgot password URL (Pro feature)
   * @default '/account/forgot-password'
   * @since 0.7.2
   */
  forgotPasswordUrl?: string;

  /**
   * Callback fired on successful login
   */
  onLoginSuccess?: () => void;

  /**
   * Callback fired on login error
   */
  onLoginError?: (error: string) => void;
}

/**
 * LoginForm - User login form component
 *
 * This is the React equivalent of Angular's LoginComponent from @volo/abp.ng.account.
 * It handles user authentication using OAuth password flow.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   return (
 *     <LoginForm
 *       showTenantBox={true}
 *       showForgotPasswordLink={true}
 *       onLoginSuccess={() => console.log('Logged in!')}
 *     />
 *   );
 * }
 * ```
 */
export function LoginForm({
  showTenantBox = true,
  showRegisterLink = true,
  showForgotPasswordLink = true,
  registerUrl = '/account/register',
  forgotPasswordUrl = '/account/forgot-password',
  onLoginSuccess,
  onLoginError,
}: LoginFormProps) {
  const { t } = useLocalization();
  const { login, isLoading, error, clearError } = usePasswordFlow();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    clearError();

    const result = await login(data.username, data.password, {
      remember: data.rememberMe,
    });

    if (result.success) {
      onLoginSuccess?.();
    } else if (result.error) {
      onLoginError?.(result.error);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <Flex height="full" flex="1">
      <Box flex="1.5" py={{ base: '24', md: '32' }}>
        <Container maxW="md">
          <Stack gap="8">

            {/* Tenant Box */}
            <Show when={showTenantBox}>
              <TenantBox />
            </Show>

            <Stack gap={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: '2xl', md: '3xl' }}>{t('AbpAccount::Login')}</Heading>
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
                  {/* Username Field */}
                  <Field.Root invalid={!!errors.username}>
                    <Field.Label>{t('AbpAccount::UserNameOrEmailAddress')}</Field.Label>
                    <InputGroup startElement={<LuMail />} width="full">
                      <Input
                        id="login-input-user-name-or-email-address"
                        type="text"
                        autoComplete="username"
                        placeholder="me@example.com"
                        {...register('username')}
                      />
                    </InputGroup>
                    {errors.username && (
                      <Field.ErrorText>{errors.username.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Password Field */}
                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>{t('AbpAccount::Password')}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input
                        id="login-input-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        {...register('password')}
                      />
                    </InputGroup>
                    {errors.password && (
                      <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Remember Me Checkbox */}
                  <Checkbox id="login-input-remember-me" {...register('rememberMe')}>
                    {t('AbpAccount::RememberMe')}
                  </Checkbox>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={isFormLoading}
                    loadingText={t('AbpAccount::Login')}
                  >
                    {t('AbpAccount::Login')}
                  </Button>

                  {/* Forgot Password Link (Pro feature) */}
                  <Show when={showForgotPasswordLink}>
                    <Link asChild variant="plain">
                      <RouterLink to={forgotPasswordUrl}>{t('AbpAccount::ForgotPassword')}</RouterLink>
                    </Link>
                  </Show>
                </Stack>

                {/* Register Link */}
                <Show when={showRegisterLink}>
                  <Card.Root size="sm" mt="10">
                    <Card.Body>
                      <HStack textStyle="sm">
                        <Text>{t('AbpAccount::AreYouANewUser')}</Text>
                        <Link asChild variant="underline" fontWeight="semibold">
                          <RouterLink to={registerUrl}>{t('AbpAccount::Register')}</RouterLink>
                        </Link>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                </Show>

              </Stack>
            </form>
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}

export default LoginForm;
