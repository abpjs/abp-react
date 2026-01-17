import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useLocalization } from '@abpjs/core';
import { useConfirmationState } from '../../contexts/confirmation.context';
import { Toaster } from '../../models';

/**
 * Icon components for different severity levels.
 */
function SuccessIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="green.500" boxSize={6}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </Icon>
  );
}

function InfoIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="blue.500" boxSize={6}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </Icon>
  );
}

function WarningIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="yellow.500" boxSize={6}>
      <path
        fill="currentColor"
        d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
      />
    </Icon>
  );
}

function ErrorIcon() {
  return (
    <Icon viewBox="0 0 24 24" color="red.500" boxSize={6}>
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

export interface ConfirmationDialogProps {
  /** Custom class name for the dialog content */
  className?: string;
}

/**
 * ConfirmationDialog - Renders the confirmation dialog.
 *
 * This is the React equivalent of Angular's ConfirmationComponent.
 * Place this component once in your app to display confirmations.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeSharedProvider>
 *       <MainContent />
 *       <ConfirmationDialog />
 *     </ThemeSharedProvider>
 *   );
 * }
 * ```
 */
export function ConfirmationDialog({ className }: ConfirmationDialogProps): React.ReactElement | null {
  const { confirmation, respond } = useConfirmationState();
  const { t } = useLocalization();
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!confirmation) {
    return null;
  }

  const { message, title, severity, options } = confirmation;

  // Localize message and title
  const localizedMessage = t(
    message,
    ...(options.messageLocalizationParams || [])
  );
  const localizedTitle = title
    ? t(title, ...(options.titleLocalizationParams || []))
    : undefined;

  // Localize button text
  const yesCopy = options.yesCopy
    ? t(options.yesCopy)
    : t('AbpUi::Yes');
  const cancelCopy = options.cancelCopy
    ? t(options.cancelCopy)
    : t('AbpUi::Cancel');

  const handleConfirm = () => {
    respond(Toaster.Status.confirm);
  };

  const handleCancel = () => {
    respond(Toaster.Status.reject);
  };

  const handleDismiss = () => {
    respond(Toaster.Status.dismiss);
  };

  return (
    <AlertDialog
      isOpen={true}
      leastDestructiveRef={cancelRef}
      onClose={handleDismiss}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent className={className} maxW="md">
          <AlertDialogHeader>
            <Flex align="center" gap={3}>
              {getIcon(severity)}
              {localizedTitle && (
                <Text fontWeight="bold" fontSize="lg">
                  {localizedTitle}
                </Text>
              )}
            </Flex>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text color="gray.600">{localizedMessage}</Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Flex gap={3}>
              {!options.hideCancelBtn && (
                <Button ref={cancelRef} variant="ghost" onClick={handleCancel}>
                  {cancelCopy}
                </Button>
              )}
              {!options.hideYesBtn && (
                <Button
                  colorScheme={getSeverityColorScheme(severity)}
                  onClick={handleConfirm}
                >
                  {yesCopy}
                </Button>
              )}
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ConfirmationDialog;
