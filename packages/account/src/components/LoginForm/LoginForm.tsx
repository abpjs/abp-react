import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Alert, Button, Checkbox } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, HStack, Show } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import { usePasswordFlow, useSelfRegistrationEnabled } from '../../hooks';
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
  remember: z.boolean().default(false),
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
   * Custom register URL
   * @default '/account/register'
   */
  registerUrl?: string;

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
 * This is the React equivalent of Angular's LoginComponent.
 * It handles user authentication using OAuth password flow.
 *
 * @since 2.0.0 - Added isSelfRegistrationEnabled check from ABP settings
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   return (
 *     <LoginForm
 *       showTenantBox={true}
 *       onLoginSuccess={() => console.log('Logged in!')}
 *     />
 *   );
 * }
 * ```
 */
export function LoginForm({
  showTenantBox = true,
  showRegisterLink = true,
  registerUrl = '/account/register',
  onLoginSuccess,
  onLoginError,
}: LoginFormProps) {
  const { t } = useLocalization();
  const { login, isLoading, error, clearError } = usePasswordFlow();

  // v2.0.0: Check if self-registration is enabled from ABP settings
  const isSelfRegistrationEnabled = useSelfRegistrationEnabled();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    clearError();

    const result = await login(data.username, data.password, {
      remember: data.remember,
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
              {/* <Text color="fg.muted">{t('AbpAccount::Login')}</Text> */}
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
                        placeholder="••••••••"
                        {...register('password')}
                      />
                    </InputGroup>
                    {errors.password && (
                      <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Remember Me Checkbox */}
                  <Checkbox id="login-input-remember-me" {...register('remember')}>
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

                  <Link variant="plain">{t('AbpAccount::ForgotPassword')}</Link>
                </Stack>

                {/* Register Link - only shown if self-registration is enabled (v2.0.0) */}
                <Show when={showRegisterLink && isSelfRegistrationEnabled}>
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
      {/* <Box flex="1" hideBelow="lg">
        <ImagePlaceholder />
      </Box> */}
    </Flex>
  );
}

export default LoginForm;
