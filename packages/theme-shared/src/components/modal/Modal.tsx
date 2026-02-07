import React, { type ReactNode } from 'react';
import {
  Dialog,
  Portal,
  Box,
  Flex,
  Text,
  Separator,
  CloseButton,
} from '@chakra-ui/react';

/**
 * Modal size options.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when visibility changes */
  onVisibleChange?: (visible: boolean) => void;
  /** Whether the modal is in a busy/loading state (v0.9.0) */
  busy?: boolean;
  /** Modal size */
  size?: ModalSize;
  /** Center the modal vertically */
  centered?: boolean;
  /** Custom CSS class for the modal container */
  modalClass?: string;
  /** Fixed height for the modal (v0.9.0) */
  height?: number | string;
  /** Minimum height for the modal (v0.9.0) */
  minHeight?: number | string;
  /** Header content */
  header?: ReactNode;
  /** Body content (children) */
  children?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Custom close button content */
  closeButton?: ReactNode;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Whether to scroll the modal body if content overflows */
  scrollBehavior?: 'inside' | 'outside';
  /** Callback when modal is initialized/opened (v0.9.0) */
  onInit?: () => void;
  // New Chakra v3 optional features (disabled by default to match ABP behavior)
  /**
   * Motion preset for modal animation.
   * @default 'scale'
   */
  motionPreset?: 'scale' | 'slide-in-bottom' | 'slide-in-right' | 'none';
  /**
   * Whether to trap focus within the modal.
   * @default true
   */
  trapFocus?: boolean;
  /**
   * Whether to prevent scrolling on the body when modal is open.
   * @default true
   */
  preventScroll?: boolean;
  /**
   * Whether to suppress the unsaved changes warning when closing the modal.
   * When true, the modal will close without prompting for unsaved changes.
   * @default false
   * @since 4.0.0
   */
  suppressUnsavedChangesWarning?: boolean;
}

/**
 * Map size to Chakra v3 dialog width tokens.
 */
function getSizeWidth(size: ModalSize): string {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'md':
      return 'md';
    case 'lg':
      return 'lg';
    case 'xl':
      return 'xl';
    case 'full':
      return 'full';
    default:
      return 'md';
  }
}

/**
 * Modal component - Generic modal/dialog container.
 *
 * This is the React equivalent of Angular's ModalComponent.
 * It uses Chakra UI Dialog (v3) for accessibility and styling,
 * while maintaining the ABP-compatible API.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [visible, setVisible] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setVisible(true)}>Open Modal</button>
 *       <Modal
 *         visible={visible}
 *         onVisibleChange={setVisible}
 *         size="md"
 *         header="Modal Title"
 *         footer={
 *           <button onClick={() => setVisible(false)}>Close</button>
 *         }
 *       >
 *         <p>Modal content goes here</p>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */
export function Modal({
  visible,
  onVisibleChange,
  busy = false,
  size = 'md',
  centered = true,
  modalClass,
  height,
  minHeight,
  header,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  scrollBehavior = 'inside',
  motionPreset = 'scale',
  trapFocus = true,
  preventScroll = true,
  onInit,
}: ModalProps): React.ReactElement {
  // Track previous visibility to detect open transition
  const prevVisibleRef = React.useRef(false);
  const onInitRef = React.useRef(onInit);

  // Keep onInit ref updated
  React.useEffect(() => {
    onInitRef.current = onInit;
  }, [onInit]);

  // Call onInit only when modal transitions from closed to open
  React.useEffect(() => {
    if (visible && !prevVisibleRef.current && onInitRef.current) {
      onInitRef.current();
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  const handleOpenChange = (details: { open: boolean }) => {
    // Don't allow closing if busy
    if (busy && !details.open) {
      return;
    }
    onVisibleChange?.(details.open);
  };

  return (
    <Dialog.Root
      open={visible}
      onOpenChange={handleOpenChange}
      placement={centered ? 'center' : 'top'}
      closeOnInteractOutside={closeOnOverlayClick && !busy}
      closeOnEscape={closeOnEscape && !busy}
      scrollBehavior={scrollBehavior}
      motionPreset={motionPreset}
      trapFocus={trapFocus}
      preventScroll={preventScroll}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            className={modalClass}
            width={getSizeWidth(size)}
            maxWidth={size === 'full' ? '100vw' : undefined}
            maxHeight={size === 'full' ? '100vh' : undefined}
            height={height}
            minHeight={minHeight}
          >
            {/* Header */}
            {(header || showCloseButton) && (
              <>
                <Dialog.Header>
                  <Flex justify="space-between" align="center" width="100%">
                    {header && (
                      <Dialog.Title>
                        <Text fontWeight="bold" fontSize="lg">
                          {header}
                        </Text>
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    )}
                  </Flex>
                </Dialog.Header>
                <Separator />
              </>
            )}

            {/* Body */}
            {children && (
              <Dialog.Body py={4}>
                {children}
              </Dialog.Body>
            )}

            {/* Footer */}
            {footer && (
              <>
                <Separator />
                <Dialog.Footer>
                  <Flex gap={3} justify="flex-end" w="100%">
                    {footer}
                  </Flex>
                </Dialog.Footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/**
 * Re-export Chakra v3 dialog parts for convenience.
 * Users can use these for more custom modal layouts.
 */
export {
  Dialog as ChakraDialog,
};

/**
 * ModalHeader - Convenience component for modal headers.
 */
export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AbpModalHeader({ children, className }: ModalHeaderProps): React.ReactElement {
  return (
    <Text fontWeight="bold" fontSize="lg" className={className}>
      {children}
    </Text>
  );
}

/**
 * ModalBody - Convenience component for modal body content.
 */
export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function AbpModalBody({ children, className }: ModalBodyProps): React.ReactElement {
  return (
    <Box color="gray.600" className={className}>
      {children}
    </Box>
  );
}

/**
 * ModalFooter - Convenience component for modal footers.
 */
export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function AbpModalFooter({ children, className }: ModalFooterProps): React.ReactElement {
  return (
    <Flex gap={3} justify="flex-end" className={className}>
      {children}
    </Flex>
  );
}

// Backward compatibility aliases
export { AbpModalHeader as ModalHeader };
export { AbpModalBody as ModalBody };
export { AbpModalFooter as ModalFooter };

export default Modal;
