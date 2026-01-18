import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useLocalization } from '@abpjs/core';
import { Button } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, HStack, Show } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import type { RegisterFormData } from '../../models';
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
              {/* <Text color="fg.muted">{t('AbpAccount::CreateYourAccount')}</Text> */}
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
                    loading={isSubmitting}
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
