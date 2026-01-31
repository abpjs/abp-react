import React, { useRef } from 'react';
import {
  Dialog,
  Portal,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useLocalization, type Config } from '@abpjs/core';
import { useConfirmationState } from '../../contexts/confirmation.context';
import { Confirmation, Toaster } from '../../models';
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
 * Helper to extract key from LocalizationParam for the t() function.
 * Handles both string and LocalizationWithDefault types.
 */
function getLocalizationKey(param: Config.LocalizationParam | undefined): string | undefined {
  if (param === undefined) return undefined;
  if (typeof param === 'string') return param;
  return param.key;
}

/**
 * Get the icon component for a severity level.
 * @since 2.0.0 - Added 'neutral' and 'warning' support, uses Confirmation.Severity
 */
function SeverityIcon({ severity }: { severity: Confirmation.Severity }): React.ReactElement {
  const iconProps = { size: 24 };

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
 * @since 2.0.0 - Added 'neutral' and 'warning' support, uses Confirmation.Severity
 */
function getSeverityColorPalette(severity: Confirmation.Severity): string {
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
 * @since 2.0.0 - Updated to use Confirmation.DialogData structure
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

  const { message, title, severity = 'neutral', options } = confirmation;

  // Localize message and title
  const messageStr = resolveLocalizationParam(message) || '';
  const localizedMessage = t(
    messageStr,
    ...(options?.messageLocalizationParams || [])
  );
  const titleStr = resolveLocalizationParam(title);
  const localizedTitle = titleStr
    ? t(titleStr, ...(options?.titleLocalizationParams || []))
    : undefined;

  // Localize button text
  const yesKey = getLocalizationKey(options?.yesText);
  const cancelKey = getLocalizationKey(options?.cancelText);
  const yesCopy = yesKey ? t(yesKey) : t('AbpUi::Yes');
  const cancelCopy = cancelKey ? t(cancelKey) : t('AbpUi::Cancel');

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
    if (!details.open && options?.closable !== false) {
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
                {!options?.hideCancelBtn && (
                  <Button
                    ref={cancelRef}
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    {cancelCopy}
                  </Button>
                )}
                {!options?.hideYesBtn && (
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
