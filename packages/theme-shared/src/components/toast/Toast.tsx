import React, { useEffect, useRef } from 'react';
import {
  Toaster as ChakraToaster,
  Portal,
  Stack,
  Toast,
  createToaster,
  Box,
  Flex,
  CloseButton,
} from '@chakra-ui/react';
import { useLocalization } from '@abpjs/core';
import { useToasterContext } from '../../contexts/toaster.context';
import { Toaster } from '../../models';
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

/**
 * Get the icon component for a severity level.
 */
function SeverityIcon({ severity }: { severity: Toaster.Severity }): React.ReactElement {
  const iconProps = { size: 20 };

  switch (severity) {
    case 'success':
      return <CheckCircle {...iconProps} color="var(--chakra-colors-green-500)" />;
    case 'info':
      return <Info {...iconProps} color="var(--chakra-colors-blue-500)" />;
    case 'warn':
      return <AlertTriangle {...iconProps} color="var(--chakra-colors-yellow-500)" />;
    case 'error':
      return <XCircle {...iconProps} color="var(--chakra-colors-red-500)" />;
  }
}

/**
 * Get Chakra color palette for severity.
 */
function getSeverityColorPalette(severity: Toaster.Severity): string {
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

/**
 * Map severity to Chakra toast type.
 */
function mapSeverityToType(severity: Toaster.Severity): 'success' | 'info' | 'warning' | 'error' {
  switch (severity) {
    case 'success':
      return 'success';
    case 'info':
      return 'info';
    case 'warn':
      return 'warning';
    case 'error':
      return 'error';
  }
}

export interface ToastContainerProps {
  /** Position of toasts */
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}

// Create a global toaster instance for ABP toast management
const abpToaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

/**
 * ToastContainer - Syncs toaster state with Chakra v3's toast system.
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
export function ToastContainer({ position = 'bottom-right' }: ToastContainerProps): React.ReactElement {
  const { toasts, service } = useToasterContext();
  const { t } = useLocalization();
  const displayedToastsRef = useRef<Set<string>>(new Set());

  // Sync our toast state with Chakra's toast system
  useEffect(() => {
    // Process new toasts that haven't been displayed yet
    const newToasts = toasts.filter((toast) => !displayedToastsRef.current.has(toast.id));

    newToasts.forEach((toast) => {
      // Mark as displayed immediately to prevent duplicate processing
      displayedToastsRef.current.add(toast.id);

      const localizedMessage = t(
        toast.message,
        ...(toast.messageLocalizationParams || [])
      );
      const localizedTitle = toast.title
        ? t(toast.title, ...(toast.titleLocalizationParams || []))
        : undefined;

      // Use requestAnimationFrame to ensure each toast is created in a separate frame
      // This helps Chakra's toaster properly handle multiple toasts
      requestAnimationFrame(() => {
        abpToaster.create({
          id: toast.id,
          title: localizedTitle,
          description: localizedMessage,
          type: mapSeverityToType(toast.severity),
          duration: toast.sticky ? undefined : (toast.life || 5000),
          meta: {
            closable: toast.closable !== false,
            severity: toast.severity,
          },
          onStatusChange: (details) => {
            if (details.status === 'unmounted') {
              displayedToastsRef.current.delete(toast.id);
              service.remove(toast.id);
            }
          },
        });
      });
    });
  }, [toasts, t, service]);

  // Update toaster placement when position changes
  useEffect(() => {
    // Note: Chakra v3 toaster placement is set at creation time
    // For dynamic positioning, we would need to recreate the toaster
  }, [position]);

  return (
    <Portal>
      <ChakraToaster toaster={abpToaster} insetInline={{ mdDown: '4' }}>
        {(toast) => {
          const severity = (toast.meta?.severity as Toaster.Severity) || 'info';
          const closable = toast.meta?.closable !== false;

          return (
            <Toast.Root
              bg={getSeverityBg(severity)}
              borderWidth="1px"
              borderColor={getSeverityBorderColor(severity)}
              borderRadius="lg"
              boxShadow="lg"
              width={{ md: 'sm' }}
            >
              <Flex align="flex-start" gap={3} p={4}>
                <Box flexShrink={0} pt="2px">
                  <SeverityIcon severity={severity} />
                </Box>
                <Stack gap={1} flex={1}>
                  {toast.title && (
                    <Toast.Title fontWeight="bold" fontSize="sm">
                      {toast.title}
                    </Toast.Title>
                  )}
                  {toast.description && (
                    <Toast.Description fontSize="sm" color="gray.700">
                      {toast.description}
                    </Toast.Description>
                  )}
                </Stack>
                {closable && (
                  <Toast.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Toast.CloseTrigger>
                )}
              </Flex>
            </Toast.Root>
          );
        }}
      </ChakraToaster>
    </Portal>
  );
}

export { getSeverityColorPalette as getSeverityColorScheme, getSeverityBg, getSeverityBorderColor };
export default ToastContainer;
