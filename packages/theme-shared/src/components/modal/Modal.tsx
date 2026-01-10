import React, { type ReactNode } from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Flex,
  Text,
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
  /** Modal size */
  size?: ModalSize;
  /** Center the modal vertically */
  centered?: boolean;
  /** Custom CSS class for the modal container */
  modalClass?: string;
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
}

/**
 * Modal component - Generic modal/dialog container.
 *
 * This is the React equivalent of Angular's ModalComponent.
 * It uses Chakra UI Modal for accessibility and styling.
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
  size = 'md',
  centered = true,
  modalClass,
  header,
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  scrollBehavior = 'inside',
}: ModalProps): React.ReactElement {
  const handleClose = () => {
    onVisibleChange?.(false);
  };

  return (
    <ChakraModal
      isOpen={visible}
      onClose={handleClose}
      size={size}
      isCentered={centered}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEscape}
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay />
      <ModalContent className={modalClass}>
        {/* Header */}
        {(header || showCloseButton) && (
          <>
            <ModalHeader>
              <Flex justify="space-between" align="center">
                {header && (
                  <Text fontWeight="bold" fontSize="lg">
                    {header}
                  </Text>
                )}
              </Flex>
            </ModalHeader>
            {showCloseButton && <ModalCloseButton />}
            <Divider />
          </>
        )}

        {/* Body */}
        {children && <ModalBody py={4}>{children}</ModalBody>}

        {/* Footer */}
        {footer && (
          <>
            <Divider />
            <ModalFooter>
              <Flex gap={3} justify="flex-end" w="100%">
                {footer}
              </Flex>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </ChakraModal>
  );
}

/**
 * Re-export Chakra modal parts for convenience.
 * Users can use these for more custom modal layouts.
 */
export {
  ModalOverlay,
  ModalContent,
  ModalHeader as ChakraModalHeader,
  ModalFooter as ChakraModalFooter,
  ModalBody as ChakraModalBody,
  ModalCloseButton,
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
    <Text as="div" color="gray.600" className={className}>
      {children}
    </Text>
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
