import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLocalization, useUserManager, useAbp, configActions } from '@abpjs/core';
import { Button, useToaster } from '@abpjs/theme-shared';
import { Box, Heading, Input, Link, HStack, Show } from '@chakra-ui/react';
import { TenantBox } from '../TenantBox';
import { useAccountProService } from '../../hooks/useAccountProService';
import type { RegisterFormData, RegisterRequest } from '../../models';
import { Card, Container, Field, Flex, InputGroup, Stack, Text } from '@chakra-ui/react';
import { LuLock, LuMail, LuUser } from 'react-icons/lu';

const passwordValidation = {
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
};

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required').max(255, 'Username must be at most 255 characters'),
  emailAddress: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(32, 'Password must be at most 32 characters')
    .refine((val) => passwordValidation.hasLowercase.test(val), 'Password must contain at least one lowercase letter')
    .refine((val) => passwordValidation.hasUppercase.test(val), 'Password must contain at least one uppercase letter')
    .refine((val) => passwordValidation.hasNumber.test(val), 'Password must contain at least one number')
    .refine((val) => passwordValidation.hasSpecial.test(val), 'Password must contain at least one special character'),
});

export interface RegisterFormProps {
  showTenantBox?: boolean;
  showLoginLink?: boolean;
  loginUrl?: string;
  /**
   * Whether self-registration is enabled
   * When false, the registration form may redirect or show a message
   * @default true
   * @since 2.0.0
   */
  isSelfRegistrationEnabled?: boolean;
  onRegisterSuccess?: () => void;
  onRegisterError?: (error: string) => void;
}

/**
 * RegisterForm - User registration form component
 * @since 0.7.2
 * @updated 2.0.0 Added isSelfRegistrationEnabled prop
 */
export function RegisterForm({
  showTenantBox = true,
  showLoginLink = true,
  loginUrl = '/account/login',
  isSelfRegistrationEnabled = true,
  onRegisterSuccess,
  onRegisterError,
}: RegisterFormProps) {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const accountService = useAccountProService();
  const toaster = useToaster();
  const userManager = useUserManager();
  const { store, applicationConfigurationService } = useAbp();
  const [inProgress, setInProgress] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', emailAddress: '', password: '' },
  });

  // If self-registration is disabled, show a message and redirect to login
  if (!isSelfRegistrationEnabled) {
    return (
      <Flex height="full" flex="1">
        <Box flex="1.5" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="8">
              <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                <Heading size={{ base: '2xl', md: '3xl' }}>{t('AbpAccount::Register')}</Heading>
              </Stack>
              <Card.Root size="sm">
                <Card.Body>
                  <Text textAlign="center" mb={4}>
                    {t('AbpAccount::SelfRegistrationDisabledMessage') || 'Self-registration is not enabled. Please contact an administrator.'}
                  </Text>
                  <HStack justifyContent="center" textStyle="sm">
                    <Link asChild variant="underline" fontWeight="semibold">
                      <RouterLink to={loginUrl}>{t('AbpAccount::Login')}</RouterLink>
                    </Link>
                  </HStack>
                </Card.Body>
              </Card.Root>
            </Stack>
          </Container>
        </Box>
      </Flex>
    );
  }

  const onSubmit = async (data: RegisterFormData) => {
    setInProgress(true);
    const newUser: RegisterRequest = {
      userName: data.username,
      password: data.password,
      emailAddress: data.emailAddress,
      appName: 'React',
    };

    try {
      await accountService.register(newUser);
      if (userManager) {
        try {
          await userManager.signinResourceOwnerCredentials({ username: newUser.userName, password: newUser.password });
          const config = await applicationConfigurationService.getConfiguration();
          store.dispatch(configActions.setApplicationConfiguration(config));
          navigate('/');
          onRegisterSuccess?.();
        } catch (loginErr) {
          console.warn('Auto-login failed after registration:', loginErr);
          toaster.success(t('AbpAccount::SuccessfullyRegistered') || 'Successfully registered! Please log in.');
          navigate(loginUrl);
          onRegisterSuccess?.();
        }
      } else {
        toaster.success(t('AbpAccount::SuccessfullyRegistered') || 'Successfully registered! Please log in.');
        navigate(loginUrl);
        onRegisterSuccess?.();
      }
    } catch (err: any) {
      const errorMessage = err?.error?.error_description || err?.error?.error?.message || 'An error occurred';
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
            <Show when={showTenantBox}><TenantBox /></Show>
            <Stack gap={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: '2xl', md: '3xl' }}>{t('AbpAccount::Register')}</Heading>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack gap="6">
                <Stack gap="5">
                  <Field.Root invalid={!!errors.username}>
                    <Field.Label>{t('AbpAccount::UserName')}</Field.Label>
                    <InputGroup startElement={<LuUser />} width="full">
                      <Input id="input-user-name" type="text" autoFocus autoComplete="username" {...register('username')} />
                    </InputGroup>
                    {errors.username && <Field.ErrorText>{errors.username.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.emailAddress}>
                    <Field.Label>{t('AbpAccount::EmailAddress')}</Field.Label>
                    <InputGroup startElement={<LuMail />} width="full">
                      <Input id="input-email-address" type="email" autoComplete="email" {...register('emailAddress')} />
                    </InputGroup>
                    {errors.emailAddress && <Field.ErrorText>{errors.emailAddress.message}</Field.ErrorText>}
                  </Field.Root>
                  <Field.Root invalid={!!errors.password}>
                    <Field.Label>{t('AbpAccount::Password')}</Field.Label>
                    <InputGroup startElement={<LuLock />} width="full">
                      <Input id="input-password" type="password" autoComplete="new-password" {...register('password')} />
                    </InputGroup>
                    {errors.password && <Field.ErrorText>{errors.password.message}</Field.ErrorText>}
                  </Field.Root>
                  <Button type="submit" colorPalette="blue" loading={inProgress} loadingText={t('AbpAccount::Register')}>
                    {t('AbpAccount::Register')}
                  </Button>
                </Stack>
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
