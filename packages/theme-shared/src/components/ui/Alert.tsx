import React, { type ReactNode } from 'react';
import { Alert as ChakraAlert } from '@chakra-ui/react';

/**
 * Alert status types
 */
export type AlertStatus = 'info' | 'warning' | 'success' | 'error';

/**
 * Alert component props
 */
export interface AlertProps {
  /** The status/type of alert */
  status?: AlertStatus;
  /** Alert content */
  children: ReactNode;
  /** Optional title (displayed prominently) */
  title?: ReactNode;
  /** Optional description (displayed below title) */
  description?: ReactNode;
  /** Whether to show the status indicator icon */
  showIcon?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Margin bottom */
  mb?: number | string;
  /** Border radius */
  borderRadius?: string;
}

/**
 * Alert - Wrapper component for displaying alerts/notifications.
 *
 * This component wraps Chakra UI's Alert and provides a simplified API
 * that shields consumers from Chakra's compound component pattern.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <Alert status="error">Something went wrong!</Alert>
 *
 * // With title
 * <Alert status="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 *
 * // Without icon
 * <Alert status="info" showIcon={false}>
 *   Information message
 * </Alert>
 * ```
 */
export function Alert({
  status = 'info',
  children,
  title,
  description,
  showIcon = true,
  className,
  mb,
  borderRadius = 'md',
}: AlertProps): React.ReactElement {
  return (
    <ChakraAlert.Root
      status={status}
      className={className}
      mb={mb}
      borderRadius={borderRadius}
    >
      {showIcon && <ChakraAlert.Indicator />}
      {title ? (
        <>
          <ChakraAlert.Title>{title}</ChakraAlert.Title>
          {(description || children) && (
            <ChakraAlert.Description>
              {description || children}
            </ChakraAlert.Description>
          )}
        </>
      ) : (
        <ChakraAlert.Title>{children}</ChakraAlert.Title>
      )}
    </ChakraAlert.Root>
  );
}

export default Alert;
