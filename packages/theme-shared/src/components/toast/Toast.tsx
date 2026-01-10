import React, { useEffect } from 'react';
import {
  useToast as useChakraToast,
  Box,
  Flex,
  Text,
  CloseButton,
  Icon,
} from '@chakra-ui/react';
import { useLocalization } from '@abpjs/core';
import { useToasterContext } from '../../contexts/toaster.context';
import { Toaster } from '../../models';

/**
 * Icon components for different severity levels.
 */
function SuccessIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="green.500" boxSize={5}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </Icon>
  );
}

function InfoIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="blue.500" boxSize={5}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </Icon>
  );
}

function WarningIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="yellow.500" boxSize={5}>
      <path
        fill="currentColor"
        d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
      />
    </Icon>
  );
}

function ErrorIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="red.500" boxSize={5}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      />
    </Icon>
  );
}

/**
 * Get the icon component for a severity level.
 */
function getIcon(severity: Toaster.Severity): React.ReactElement {
  switch (severity) {
    case 'success':
      return <SuccessIcon />;
    case 'info':
      return <InfoIcon />;
    case 'warn':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
  }
}

/**
 * Get Chakra color scheme for severity.
 */
function getSeverityColorScheme(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green';
    case 'info':
      return 'blue';
    case 'warn':
      return 'yellow';
    case 'error':
      return 'red';
  }
}

/**
 * Get background color for severity.
 */
function getSeverityBg(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green.50';
    case 'info':
      return 'blue.50';
    case 'warn':
      return 'yellow.50';
    case 'error':
      return 'red.50';
  }
}

/**
 * Get border color for severity.
 */
function getSeverityBorderColor(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green.200';
    case 'info':
      return 'blue.200';
    case 'warn':
      return 'yellow.200';
    case 'error':
      return 'red.200';
  }
}

export interface ToastContainerProps {
  /** Position of toasts */
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

/**
 * ToastContainer - Syncs toaster state with Chakra's toast system.
 *
 * This is the React equivalent of Angular's ToastComponent.
 * Place this component once in your app to display toasts.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeSharedProvider>
 *       <MainContent />
 *       <ToastContainer />
 *     </ThemeSharedProvider>
 *   );
 * }
 * ```
 */
export function ToastContainer({ position = 'bottom-right' }: ToastContainerProps): React.ReactElement | null {
  const { toasts, service } = useToasterContext();
  const { instant } = useLocalization();
  const chakraToast = useChakraToast();

  // Sync our toast state with Chakra's toast system
  useEffect(() => {
    toasts.forEach((toast) => {
      // Check if this toast is already displayed
      if (chakraToast.isActive(toast.id)) {
        return;
      }

      const localizedMessage = instant(
        toast.message,
        ...(toast.messageLocalizationParams || [])
      );
      const localizedTitle = toast.title
        ? instant(toast.title, ...(toast.titleLocalizationParams || []))
        : undefined;

      chakraToast({
        id: toast.id,
        position,
        duration: toast.sticky ? null : (toast.life || 5000),
        isClosable: toast.closable !== false,
        render: ({ onClose }) => (
          <Box
            bg={getSeverityBg(toast.severity)}
            borderWidth="1px"
            borderColor={getSeverityBorderColor(toast.severity)}
            borderRadius="lg"
            p={4}
            boxShadow="lg"
            maxW="sm"
          >
            <Flex align="flex-start" gap={3}>
              <Box flexShrink={0} pt="2px">
                {getIcon(toast.severity)}
              </Box>
              <Box flex={1}>
                {localizedTitle && (
                  <Text fontWeight="bold" fontSize="sm" mb={1}>
                    {localizedTitle}
                  </Text>
                )}
                <Text fontSize="sm" color="gray.700">
                  {localizedMessage}
                </Text>
              </Box>
              {toast.closable !== false && (
                <CloseButton
                  size="sm"
                  onClick={() => {
                    onClose();
                    service.remove(toast.id);
                  }}
                />
              )}
            </Flex>
          </Box>
        ),
        onCloseComplete: () => {
          service.remove(toast.id);
        },
      });
    });
  }, [toasts, chakraToast, instant, position, service]);

  // This component doesn't render anything - Chakra handles the portal
  return null;
}

export { getSeverityColorScheme, getSeverityBg, getSeverityBorderColor };
export default ToastContainer;
