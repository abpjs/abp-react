import React from 'react';
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
}

/**
 * A component for displaying error pages/messages.
 * Can be used for HTTP errors (404, 500, etc.) or general error states.
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
 * ```
 */
export function ErrorComponent({
  title = 'Error',
  details = 'An error has occurred.',
  onDestroy,
  showCloseButton = true,
  closeButtonText = 'Go Back',
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
        {showCloseButton && onDestroy && (
          <Button
            colorPalette="blue"
            size="lg"
            onClick={onDestroy}
          >
            {closeButtonText}
          </Button>
        )}
      </VStack>
    </Container>
  );
}

export default ErrorComponent;
