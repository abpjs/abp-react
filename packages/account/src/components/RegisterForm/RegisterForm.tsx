import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLocalization, useUserManager, useAbp, configActions } from '@abpjs/core';
import { Button, useToaster } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, HStack, Show } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import { useAccountService, useSelfRegistrationEnabled } from '../../hooks';
import type { RegisterFormData, RegisterRequest } from '../../models';
import {
  Card,
  Container,
  Field,
  Flex,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuLock, LuMail, LuUser } from 'react-icons/lu';

/**
 * Password validation regex patterns
 * Matches Angular's validatePassword(['small', 'capital', 'number', 'special'])
 */
const passwordValidation = {
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Zod schema for register form validation
 * Matches Angular validators
 */
const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username must be at most 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(32, 'Password must be at most 32 characters')
    .refine(
      (val) => passwordValidation.hasLowercase.test(val),
      'Password must contain at least one lowercase letter'
    )
    .refine(
      (val) => passwordValidation.hasUppercase.test(val),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (val) => passwordValidation.hasNumber.test(val),
      'Password must contain at least one number'
    )
    .refine(
      (val) => passwordValidation.hasSpecial.test(val),
      'Password must contain at least one special character'
    ),
});

/**
 * Props for RegisterForm component
 */
export interface RegisterFormProps {
  /**
   * Whether to show the tenant box
   * @default true
   */
  showTenantBox?: boolean;

  /**
   * Whether to show the login link
   * @default true
   */
  showLoginLink?: boolean;

  /**
   * Custom login URL
   * @default '/account/login'
   */
  loginUrl?: string;

  /**
   * Callback fired on successful registration
   */
  onRegisterSuccess?: () => void;

  /**
   * Callback fired on registration error
   */
  onRegisterError?: (error: string) => void;
}

/**
 * RegisterForm - User registration form component
 *
 * This is the React equivalent of Angular's RegisterComponent.
 *
 * In v0.9.0, this component now makes API calls for registration using
 * AccountService and automatically logs in the user after successful registration.
 *
 * @since 0.9.0 - Now uses AccountService for registration
 * @since 2.0.0 - Added isSelfRegistrationEnabled check from ABP settings
 *
 * @example
 * ```tsx
 * function RegisterPage() {
 *   return (
 *     <RegisterForm
 *       showTenantBox={true}
 *       onRegisterSuccess={() => console.log('Registered!')}
 *     />
 *   );
 * }
 * ```
 */
export function RegisterForm({
  showTenantBox = true,
  showLoginLink = true,
  loginUrl = '/account/login',
  onRegisterSuccess,
  onRegisterError,
}: RegisterFormProps) {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const accountService = useAccountService();
  const toaster = useToaster();
  const userManager = useUserManager();
  const { store, applicationConfigurationService } = useAbp();

  const [inProgress, setInProgress] = useState(false);

  // v2.0.0: Check if self-registration is enabled from ABP settings
  const isSelfRegistrationEnabled = useSelfRegistrationEnabled();

  // Redirect to login if self-registration is disabled
  useEffect(() => {
    if (!isSelfRegistrationEnabled) {
      navigate(loginUrl, { replace: true });
    }
  }, [isSelfRegistrationEnabled, navigate, loginUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  /**
   * Handle form submission
   * In v0.9.0, this calls the register API and auto-logs in the user
   */
  const onSubmit = async (data: RegisterFormData) => {
    setInProgress(true);

    const newUser: RegisterRequest = {
      userName: data.username,
      password: data.password,
      emailAddress: data.email,
      appName: 'React',
    };

    try {
      // Step 1: Register the user
      await accountService.register(newUser);

      // Step 2: Sign in the user using password flow
      if (userManager) {
        try {
          await userManager.signinResourceOwnerCredentials({
            username: newUser.userName,
            password: newUser.password,
          });

          // Step 3: Refresh application configuration
          const config = await applicationConfigurationService.getConfiguration();
          store.dispatch(configActions.setApplicationConfiguration(config));

          // Step 4: Navigate to home
          navigate('/');
          onRegisterSuccess?.();
        } catch (loginErr) {
          // Registration succeeded but auto-login failed
          // Still consider this a success, user can login manually
          console.warn('Auto-login failed after registration:', loginErr);
          toaster.success(
            t('AbpAccount::SuccessfullyRegistered') || 'Successfully registered! Please log in.',
            t('AbpAccount::Success') || 'Success'
          );
          navigate(loginUrl);
          onRegisterSuccess?.();
        }
      } else {
        // No user manager configured, just redirect to login
        toaster.success(
          t('AbpAccount::SuccessfullyRegistered') || 'Successfully registered! Please log in.',
          t('AbpAccount::Success') || 'Success'
        );
        navigate(loginUrl);
        onRegisterSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err?.error?.error_description ||
        err?.error?.error?.message ||
        t('AbpAccount::DefaultErrorMessage') ||
        'An error occurred';

      toaster.error(errorMessage, t('AbpUi::Error') || 'Error', { life: 7000 });
      onRegisterError?.(errorMessage);
    } finally {
      setInProgress(false);
    }
  };

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
              <Heading size={{ base: '2xl', md: '3xl' }}>{t('AbpAccount::Register')}</Heading>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  {/* Username Field */}
                  <Field.Root invalid={!!errors.username}>
                    <Field.Label>{t('AbpAccount::UserName')}</Field.Label>
                    <InputGroup startElement={<LuUser />} width="full">
                      <Input
                        id="input-user-name"
                        type="text"
                        autoFocus
                        autoComplete="username"
                        placeholder="johndoe"
                        {...register('username')}
                      />
                    </InputGroup>
                    {errors.username && (
                      <Field.ErrorText>{errors.username.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Email Field */}
                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>{t('AbpAccount::EmailAddress')}</Field.Label>
                    <InputGroup startElement={<LuMail />} width="full">
                      <Input
                        id="input-email-address"
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

                  {/* Password Field */}
                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>{t('AbpAccount::Password')}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input
                        id="input-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...register('password')}
                      />
                    </InputGroup>
                    {errors.password && (
                      <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={inProgress}
                    loadingText={t('AbpAccount::Register')}
                  >
                    {t('AbpAccount::Register')}
                  </Button>
                </Stack>

                {/* Login Link */}
                <Show when={showLoginLink}>
                  <Card.Root size="sm" mt="10">
                    <Card.Body>
                      <HStack textStyle="sm">
                        <Text>{t('AbpAccount::AlreadyRegistered')}</Text>
                        <Link asChild variant="underline" fontWeight="semibold">
                          <RouterLink to={loginUrl}>{t('AbpAccount::Login')}</RouterLink>
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

export default RegisterForm;
