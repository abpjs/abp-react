import { ReactNode } from 'react';
import { Box, Container, Stack, Flex, Text } from '@chakra-ui/react';
import { useLocalization, useSetting } from '@abpjs/core';
import { eAccountComponents } from '../../enums';

/**
 * ABP setting key for local login
 */
const ENABLE_LOCAL_LOGIN_SETTING = 'Abp.Account.EnableLocalLogin';

/**
 * Props for AuthWrapper component
 */
export interface AuthWrapperProps {
  /**
   * Main content to be rendered in the wrapper
   */
  children?: ReactNode;

  /**
   * Main content template reference (for consistency with Angular API)
   */
  mainContent?: ReactNode;

  /**
   * Cancel/footer content template reference
   */
  cancelContent?: ReactNode;

  /**
   * Whether local login (username/password) is enabled.
   * When false, the wrapper will show a message that local login is disabled.
   * This is read from ABP settings by default.
   *
   * @since 2.0.0
   * @default true (from ABP settings or if not configured)
   */
  enableLocalLogin?: boolean;

  /**
   * Whether multi-tenancy is enabled.
   * When true, the tenant box will be displayed (if rendered).
   * This corresponds to Angular's isMultiTenancyEnabled$ observable.
   *
   * In ABP, this is read from ConfigState.getDeep('multiTenancy.isEnabled').
   * This prop allows overriding the default behavior.
   *
   * @since 2.4.0
   * @default true (multi-tenancy enabled by default)
   */
  isMultiTenancyEnabled?: boolean;
}

/**
 * AuthWrapper - Authentication wrapper component
 *
 * This is the React equivalent of Angular's AuthWrapperComponent.
 * It provides a consistent wrapper layout for authentication-related forms
 * like login, register, and password reset.
 *
 * In Angular, this used TemplateRef for content projection.
 * In React, we use children and render props pattern.
 *
 * @since 1.1.0
 * @since 2.0.0 - Added enableLocalLogin prop to control local login visibility
 * @since 2.4.0 - Added isMultiTenancyEnabled prop (equivalent to Angular's isMultiTenancyEnabled$)
 * @since 2.7.0 - Added tenantBoxKey static property for component replacement system
 *
 * @example
 * ```tsx
 * <AuthWrapper
 *   mainContent={<LoginForm />}
 *   cancelContent={<Link to="/register">Create account</Link>}
 *   isMultiTenancyEnabled={true}
 * />
 * ```
 */
export function AuthWrapper({
  children,
  mainContent,
  cancelContent,
  enableLocalLogin,
  isMultiTenancyEnabled = true,
}: AuthWrapperProps) {
  const { t } = useLocalization();

  // v2.0.0: Check if local login is enabled from ABP settings
  const localLoginSetting = useSetting(ENABLE_LOCAL_LOGIN_SETTING);

  // Determine if local login should be enabled
  // Priority: prop value > setting value > default (true)
  const isLocalLoginEnabled = enableLocalLogin ?? (
    localLoginSetting === undefined || localLoginSetting === null
      ? true
      : localLoginSetting.toLowerCase() === 'true'
  );

  // If local login is disabled, show a message
  if (!isLocalLoginEnabled) {
    return (
      <Flex height="full" flex="1" className="auth-wrapper">
        <Box flex="1" py={{ base: '24', md: '32' }}>
          <Container maxW="md">
            <Stack gap="8" textAlign="center">
              <Text fontSize="lg" color="fg.muted">
                {t('AbpAccount::LocalLoginDisabledMessage') || 'Local login is disabled. Please use an external login provider.'}
              </Text>
            </Stack>
          </Container>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex height="full" flex="1" className="auth-wrapper">
      <Box flex="1" py={{ base: '24', md: '32' }}>
        <Container maxW="md">
          <Stack gap="8">
            {/* Main content area */}
            {mainContent || children}

            {/* Cancel/footer content area */}
            {cancelContent && (
              <Box textAlign="center" mt={4}>
                {cancelContent}
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </Flex>
  );
}

/**
 * Component key for TenantBox used in AuthWrapper
 * @since 2.7.0
 */
AuthWrapper.tenantBoxKey = eAccountComponents.TenantBox;

export default AuthWrapper;
