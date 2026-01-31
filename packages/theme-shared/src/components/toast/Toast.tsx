import React, { useEffect, useRef, useMemo } from 'react';
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
import { useLocalization, type Config } from '@abpjs/core';
import { useToasterContext } from '../../contexts/toaster.context';
import { Toaster } from '../../models';
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Circle,
} from 'lucide-react';

/**
 * Helper to resolve LocalizationParam to string.
 */
function resolveLocalizationParam(param: Config.LocalizationParam | undefined): string | undefined {
  if (param === undefined) return undefined;
  if (typeof param === 'string') return param;
  return param.defaultValue || param.key;
}

/**
 * Get the icon component for a severity level.
 * @since 2.0.0 - Added 'neutral' and 'warning' support
 */
function SeverityIcon({ severity }: { severity: Toaster.Severity }): React.ReactElement {
  const iconProps = { size: 20 };

  switch (severity) {
    case 'success':
      return <CheckCircle {...iconProps} color="var(--chakra-colors-green-500)" />;
    case 'info':
      return <Info {...iconProps} color="var(--chakra-colors-blue-500)" />;
    case 'warning':
      return <AlertTriangle {...iconProps} color="var(--chakra-colors-yellow-500)" />;
    case 'error':
      return <XCircle {...iconProps} color="var(--chakra-colors-red-500)" />;
    case 'neutral':
    default:
      return <Circle {...iconProps} color="var(--chakra-colors-gray-500)" />;
  }
}

/**
 * Get Chakra color palette for severity.
 * @since 2.0.0 - Added 'neutral' and 'warning' support
 */
function getSeverityColorPalette(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green';
    case 'info':
      return 'blue';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    case 'neutral':
    default:
      return 'gray';
  }
}

/**
 * Get background color for severity.
 * @since 2.0.0 - Added 'neutral' and 'warning' support
 */
function getSeverityBg(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green.50';
    case 'info':
      return 'blue.50';
    case 'warning':
      return 'yellow.50';
    case 'error':
      return 'red.50';
    case 'neutral':
    default:
      return 'gray.50';
  }
}

/**
 * Get border color for severity.
 * @since 2.0.0 - Added 'neutral' and 'warning' support
 */
function getSeverityBorderColor(severity: Toaster.Severity): string {
  switch (severity) {
    case 'success':
      return 'green.200';
    case 'info':
      return 'blue.200';
    case 'warning':
      return 'yellow.200';
    case 'error':
      return 'red.200';
    case 'neutral':
    default:
      return 'gray.200';
  }
}

/**
 * Map severity to Chakra toast type.
 * @since 2.0.0 - Added 'neutral' support
 */
function mapSeverityToType(severity: Toaster.Severity): 'success' | 'info' | 'warning' | 'error' {
  switch (severity) {
    case 'success':
      return 'success';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'neutral':
    default:
      return 'info';
  }
}

export interface ToastContainerProps {
  /** Position of toasts */
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  /**
   * Container key for filtering toasts to this container
   * @since 2.0.0
   */
  containerKey?: string;
}

/**
 * Map position prop to Chakra placement, accounting for RTL.
 * Uses logical values (start/end) which automatically handle RTL.
 */
function getPlacement(position: ToastContainerProps['position']): 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' {
  switch (position) {
    case 'top':
      return 'top';
    case 'top-left':
      return 'top-start'; // Logical: start = left in LTR, right in RTL
    case 'top-right':
      return 'top-end'; // Logical: end = right in LTR, left in RTL
    case 'bottom':
      return 'bottom';
    case 'bottom-left':
      return 'bottom-start';
    case 'bottom-right':
    default:
      return 'bottom-end';
  }
}

// Cache for toaster instances by placement
const toasterCache = new Map<string, ReturnType<typeof createToaster>>();

/**
 * Get or create a toaster instance for the given placement.
 */
function getToaster(placement: ReturnType<typeof getPlacement>) {
  if (!toasterCache.has(placement)) {
    toasterCache.set(placement, createToaster({
      placement,
      pauseOnPageIdle: true,
    }));
  }
  return toasterCache.get(placement)!;
}

/**
 * ToastContainer - Syncs toaster state with Chakra v3's toast system.
 *
 * This is the React equivalent of Angular's ToastComponent.
 * Place this component once in your app to display toasts.
 *
 * The toast position uses logical values (start/end) which automatically
 * handle RTL languages - toasts will appear on the correct side based on
 * the current text direction.
 *
 * @since 2.0.0 - Added containerKey prop for filtering toasts
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
export function ToastContainer({ position = 'bottom-right', containerKey }: ToastContainerProps): React.ReactElement {

  const { toasts, service } = useToasterContext();
  const { t } = useLocalization();
  const displayedToastsRef = useRef<Set<number>>(new Set());

  // Get the placement based on position prop
  const placement = useMemo(() => getPlacement(position), [position]);

  // Get or create toaster for this placement
  const toaster = useMemo(() => getToaster(placement), [placement]);

  // Filter toasts by container key if provided
  const filteredToasts = useMemo(() => {
    if (!containerKey) return toasts;
    return toasts.filter((toast) => toast.options?.containerKey === containerKey);
  }, [toasts, containerKey]);

  // Sync our toast state with Chakra's toast system
  useEffect(() => {
    // Process new toasts that haven't been displayed yet
    const newToasts = filteredToasts.filter((toast) => !displayedToastsRef.current.has(toast.id));

    newToasts.forEach((toast) => {
      // Mark as displayed immediately to prevent duplicate processing
      displayedToastsRef.current.add(toast.id);

      const messageStr = resolveLocalizationParam(toast.message) || '';
      const localizedMessage = t(
        messageStr,
        ...(toast.options?.messageLocalizationParams || [])
      );
      const titleStr = resolveLocalizationParam(toast.title);
      const localizedTitle = titleStr
        ? t(titleStr, ...(toast.options?.titleLocalizationParams || []))
        : undefined;

      const severity = (toast.severity as Toaster.Severity) || 'info';

      // Use requestAnimationFrame to ensure each toast is created in a separate frame
      // This helps Chakra's toaster properly handle multiple toasts
      requestAnimationFrame(() => {
        toaster.create({
          id: String(toast.id),
          title: localizedTitle,
          description: localizedMessage,
          type: mapSeverityToType(severity),
          duration: toast.options?.sticky ? undefined : (toast.options?.life || 5000),
          meta: {
            closable: toast.options?.closable !== false,
            severity: severity,
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
  }, [filteredToasts, t, service, toaster]);

  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
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
                    <Toast.Title fontWeight="bold" fontSize="sm" color='fg'>
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
