import { Container, Center } from '@chakra-ui/react';
import { RegisterForm, type RegisterFormProps } from '../components';

/**
 * Props for RegisterPage component
 */
export interface RegisterPageProps extends RegisterFormProps {
  /**
   * Maximum width of the container
   * @default 'container.sm'
   */
  maxWidth?: string;
}

/**
 * RegisterPage - Page wrapper for the registration form
 *
 * This component wraps RegisterForm with proper layout and spacing.
 * It's designed to be used as a route component.
 *
 * @example
 * ```tsx
 * // In your routes configuration
 * <Route path="/account/register" element={<RegisterPage />} />
 * ```
 */
export function RegisterPage({
  maxWidth = 'container.sm',
  ...registerFormProps
}: RegisterPageProps) {
  return (
    <Container maxW={maxWidth} py={10}>
      <Center>
        <RegisterForm {...registerFormProps} />
      </Center>
    </Container>
  );
}

export default RegisterPage;
