import { ReactNode } from 'react';
import { Box, Container, Stack, Flex } from '@chakra-ui/react';

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
 *
 * @example
 * ```tsx
 * <AuthWrapper
 *   mainContent={<LoginForm />}
 *   cancelContent={<Link to="/register">Create account</Link>}
 * />
 * ```
 */
export function AuthWrapper({
  children,
  mainContent,
  cancelContent,
}: AuthWrapperProps) {
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

export default AuthWrapper;
