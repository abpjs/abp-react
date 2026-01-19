import React, { useRef } from 'react';
import {
  Dialog,
  Portal,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useLocalization } from '@abpjs/core';
import { useConfirmationState } from '../../contexts/confirmation.context';
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
  const iconProps = { size: 24 };

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
 * In Chakra v3, we use Dialog with role="alertdialog" instead of AlertDialog.
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

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      handleDismiss();
    }
  };

  return (
    <Dialog.Root
      open={true}
      onOpenChange={handleOpenChange}
      role="alertdialog"
      placement="center"
      initialFocusEl={() => cancelRef.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className={className} maxWidth="md">
            <Dialog.Header>
              <Flex align="center" gap={3}>
                <SeverityIcon severity={severity} />
                {localizedTitle && (
                  <Dialog.Title>
                    <Text fontWeight="bold" fontSize="lg">
                      {localizedTitle}
                    </Text>
                  </Dialog.Title>
                )}
              </Flex>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="gray.600">{localizedMessage}</Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Flex gap={3}>
                {!options.hideCancelBtn && (
                  <Button
                    ref={cancelRef}
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    {cancelCopy}
                  </Button>
                )}
                {!options.hideYesBtn && (
                  <Button
                    colorPalette={getSeverityColorPalette(severity)}
                    onClick={handleConfirm}
                  >
                    {yesCopy}
                  </Button>
                )}
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default ConfirmationDialog;
