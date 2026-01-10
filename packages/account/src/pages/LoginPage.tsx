import { Container, Center } from '@chakra-ui/react';
import { LoginForm, type LoginFormProps } from '../components';

/**
 * Props for LoginPage component
 */
export interface LoginPageProps extends LoginFormProps {
  /**
   * Maximum width of the container
   * @default 'container.sm'
   */
  maxWidth?: string;
}

/**
 * LoginPage - Page wrapper for the login form
 *
 * This component wraps LoginForm with proper layout and spacing.
 * It's designed to be used as a route component.
 *
 * @example
 * ```tsx
 * // In your routes configuration
 * <Route path="/account/login" element={<LoginPage />} />
 * ```
 */
export function LoginPage({
  maxWidth = 'container.sm',
  ...loginFormProps
}: LoginPageProps) {
  return (
    <Container maxW={maxWidth} py={10}>
      <Center>
        <LoginForm {...loginFormProps} />
      </Center>
    </Container>
  );
}

export default LoginPage;
