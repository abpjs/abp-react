import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Link,
  VStack,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import { usePasswordFlow } from '../../hooks';
import type { LoginFormData } from '../../models';

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
    <Box maxW="md" mx="auto">
      {/* Tenant Box */}
      {showTenantBox && <TenantBox />}

      {/* Login Container */}
      <Box className="abp-account-container" p={6} bg="white" borderRadius="md" shadow="sm">
        <Heading as="h2" size="lg" mb={6}>
          {t('AbpAccount::Login')}
        </Heading>

        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <VStack spacing={4} align="stretch">
            {/* Username Field */}
            <FormControl isInvalid={!!errors.username}>
              <FormLabel htmlFor="login-input-user-name-or-email-address">
                {t('AbpAccount::UserNameOrEmailAddress')}
              </FormLabel>
              <Input
                id="login-input-user-name-or-email-address"
                type="text"
                autoComplete="username"
                {...register('username')}
              />
              <FormErrorMessage>
                {errors.username?.message}
              </FormErrorMessage>
            </FormControl>

            {/* Password Field */}
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="login-input-password">
                {t('AbpAccount::Password')}
              </FormLabel>
              <Input
                id="login-input-password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              <FormErrorMessage>
                {errors.password?.message}
              </FormErrorMessage>
            </FormControl>

            {/* Remember Me Checkbox */}
            <FormControl>
              <Checkbox
                id="login-input-remember-me"
                {...register('remember')}
              >
                {t('AbpAccount::RememberMe')}
              </Checkbox>
            </FormControl>

            {/* Action Buttons */}
            <HStack spacing={2} pt={2}>
              <Button
                type="button"
                variant="outline"
                colorScheme="gray"
                isDisabled={isFormLoading}
              >
                {t('AbpAccount::Cancel')}
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isFormLoading}
                loadingText={t('AbpAccount::Login')}
              >
                {t('AbpAccount::Login')}
              </Button>
            </HStack>
          </VStack>
        </form>

        {/* Register Link */}
        {showRegisterLink && (
          <Box pt={5}>
            <Link as={RouterLink} to={registerUrl} color="blue.500">
              {t('AbpAccount::Register')}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default LoginForm;
