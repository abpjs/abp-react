import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Button, FormField } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, VStack, Text } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import type { RegisterFormData } from '../../models';

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
 * Note: In v0.7.6, the onSubmit only validates the form but does not
 * make an API call. This matches the Angular implementation.
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
  // Note: onRegisterError will be used when registration API is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRegisterError: _onRegisterError,
}: RegisterFormProps) {
  const { t } = useLocalization();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
   * Note: In v0.7.6, this only validates - no API call is made
   */
  const onSubmit = async (data: RegisterFormData) => {
    // In v0.7.6, the Angular RegisterComponent.onSubmit() only validates
    // and returns if form is invalid. No API call is made.
    // We maintain this behavior for version parity.
    console.log('Register form submitted (no API call in v0.7.6):', data);
    onRegisterSuccess?.();
  };

  return (
    <Box maxW="md" mx="auto">
      {/* Tenant Box */}
      {showTenantBox && <TenantBox />}

      {/* Register Container */}
      <Box className="abp-account-container" p={6} bg="white" borderRadius="md" shadow="sm">
        <Heading as="h2" size="lg" mb={6}>
          {t('AbpAccount::Register') || 'Register'}
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <VStack gap={4} align="stretch">
            {/* Username Field */}
            <FormField
              label={t('AbpAccount::UserName') || 'User name'}
              htmlFor="input-user-name"
              invalid={!!errors.username}
              errorText={errors.username?.message}
              required
            >
              <Input
                id="input-user-name"
                type="text"
                autoFocus
                autoComplete="username"
                {...register('username')}
              />
            </FormField>

            {/* Email Field */}
            <FormField
              label={t('AbpAccount::EmailAddress') || 'Email address'}
              htmlFor="input-email-address"
              invalid={!!errors.email}
              errorText={errors.email?.message}
              required
            >
              <Input
                id="input-email-address"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
            </FormField>

            {/* Password Field */}
            <FormField
              label={t('AbpAccount::Password') || 'Password'}
              htmlFor="input-password"
              invalid={!!errors.password}
              errorText={errors.password?.message}
              required
            >
              <Input
                id="input-password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
            </FormField>

            {/* Submit Button */}
            <Button
              type="submit"
              colorPalette="blue"
              loading={isSubmitting}
              loadingText={t('AbpAccount::Register') || 'Register'}
            >
              {t('AbpAccount::Register') || 'Register'}
            </Button>
          </VStack>
        </form>

        {/* Login Link */}
        {showLoginLink && (
          <Box pt={5}>
            <Text fontSize="sm">
              {t('AbpAccount::AlreadyRegistered') || 'Already have an account?'}{' '}
              <Link asChild color="blue.500">
                <RouterLink to={loginUrl}>{t('AbpAccount::Login')}</RouterLink>
              </Link>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RegisterForm;
