import { Box, Heading, Text, VStack, Button, Container } from '@chakra-ui/react';

export interface ErrorComponentProps {
  /** Error title (e.g., "404", "500", "Error") */
  title?: string;
  /** Error details/message */
  details?: string;
  /** Callback when user wants to dismiss/destroy the error display */
  onDestroy?: () => void;
  /** Whether to show a close/back button */
  showCloseButton?: boolean;
  /** Custom close button text */
  closeButtonText?: string;
  /**
   * Whether to show the home button.
   * When true, shows a "Go Home" button alongside or instead of the close button.
   * @since 2.7.0
   */
  isHomeShow?: boolean;
  /**
   * Callback when user clicks the home button.
   * @since 2.7.0
   */
  onHomeClick?: () => void;
  /**
   * Custom home button text.
   * @since 2.7.0
   */
  homeButtonText?: string;
}

/**
 * A component for displaying error pages/messages.
 * Can be used for HTTP errors (404, 500, etc.) or general error states.
 *
 * @since 2.7.0 - Added isHomeShow, onHomeClick, homeButtonText props
 *
 * @example
 * ```tsx
 * // Basic error display
 * <ErrorComponent
 *   title="404"
 *   details="The page you are looking for was not found."
 * />
 *
 * // With close button
 * <ErrorComponent
 *   title="Error"
 *   details="Something went wrong."
 *   showCloseButton
 *   onDestroy={() => navigate('/')}
 * />
 *
 * // With home button (v2.7.0)
 * <ErrorComponent
 *   title="404"
 *   details="Page not found."
 *   isHomeShow
 *   onHomeClick={() => navigate('/')}
 * />
 * ```
 */
export function ErrorComponent({
  title = 'Error',
  details = 'An error has occurred.',
  onDestroy,
  showCloseButton = true,
  closeButtonText = 'Go Back',
  isHomeShow = false,
  onHomeClick,
  homeButtonText = 'Go Home',
}: ErrorComponentProps) {
  return (
    <Container maxW="container.md" py={20}>
      <VStack gap={6} textAlign="center">
        <Heading
          size="4xl"
          color="red.500"
          fontWeight="bold"
        >
          {title}
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {details}
        </Text>
        <Box display="flex" gap={3}>
          {isHomeShow && onHomeClick && (
            <Button
              colorPalette="green"
              size="lg"
              onClick={onHomeClick}
            >
              {homeButtonText}
            </Button>
          )}
          {showCloseButton && onDestroy && (
            <Button
              colorPalette="blue"
              size="lg"
              onClick={onDestroy}
            >
              {closeButtonText}
            </Button>
          )}
        </Box>
      </VStack>
    </Container>
  );
}

export default ErrorComponent;
