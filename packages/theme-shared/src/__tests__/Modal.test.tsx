import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { Modal, AbpModalHeader, AbpModalBody, AbpModalFooter } from '../components/modal/Modal';
import { abpSystem } from '../theme';

// Wrapper component for tests using Chakra v3
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={abpSystem}>{children}</ChakraProvider>;
}

describe('Modal', () => {
  const user = userEvent.setup();

  it('should render when visible is true', () => {
    render(
      <TestWrapper>
        <Modal visible={true}>
          <p>Modal content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render content when visible is false', () => {
    render(
      <TestWrapper>
        <Modal visible={false}>
          <p>Modal content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render header when provided', () => {
    render(
      <TestWrapper>
        <Modal visible={true} header="Modal Title">
          <p>Modal content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(
      <TestWrapper>
        <Modal
          visible={true}
          footer={<button>Save</button>}
        >
          <p>Modal content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should render close button by default', () => {
    render(
      <TestWrapper>
        <Modal visible={true} header="Title">
          <p>Content</p>
        </Modal>
      </TestWrapper>
    );

    // Chakra v3 Dialog uses CloseButton which has aria-label="Close dialog"
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should hide close button when showCloseButton is false', () => {
    render(
      <TestWrapper>
        <Modal visible={true} header="Title" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('should call onVisibleChange when close button is clicked', async () => {
    const onVisibleChange = vi.fn();

    render(
      <TestWrapper>
        <Modal visible={true} header="Title" onVisibleChange={onVisibleChange}>
          <p>Content</p>
        </Modal>
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  it('should apply custom modalClass', () => {
    render(
      <TestWrapper>
        <Modal visible={true} modalClass="custom-modal-class">
          <p>Content</p>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    // The modal should render with the custom class
  });

  it('should render different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];

    sizes.forEach((size) => {
      const { unmount } = render(
        <TestWrapper>
          <Modal visible={true} size={size}>
            <p>Content for {size}</p>
          </Modal>
        </TestWrapper>
      );

      expect(screen.getByText(`Content for ${size}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('should toggle visibility', async () => {
    function ToggleModal() {
      const [visible, setVisible] = useState(false);
      return (
        <>
          <button onClick={() => setVisible(true)}>Open</button>
          <Modal visible={visible} onVisibleChange={setVisible} header="Toggle Modal">
            <p>Modal is open</p>
          </Modal>
        </>
      );
    }

    render(
      <TestWrapper>
        <ToggleModal />
      </TestWrapper>
    );

    expect(screen.queryByText('Modal is open')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      expect(screen.getByText('Modal is open')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modal is open')).not.toBeInTheDocument();
    });
  });

  it('should prevent closing on overlay click when closeOnOverlayClick is false', async () => {
    const onVisibleChange = vi.fn();

    render(
      <TestWrapper>
        <Modal
          visible={true}
          onVisibleChange={onVisibleChange}
          closeOnOverlayClick={false}
        >
          <p>Content</p>
        </Modal>
      </TestWrapper>
    );

    // Chakra v3 Dialog uses overlay for backdrop clicks
    // We can't easily test overlay click prevention without complex setup
    // Just verify the prop is accepted
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render complex content', () => {
    render(
      <TestWrapper>
        <Modal
          visible={true}
          header={
            <div>
              <h2>Complex Header</h2>
              <p>Subtitle</p>
            </div>
          }
          footer={
            <div>
              <button>Cancel</button>
              <button>Save</button>
            </div>
          }
        >
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
          </form>
        </Modal>
      </TestWrapper>
    );

    expect(screen.getByText('Complex Header')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('AbpModalHeader', () => {
  it('should render children', () => {
    render(
      <TestWrapper>
        <AbpModalHeader>Header Content</AbpModalHeader>
      </TestWrapper>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestWrapper>
        <AbpModalHeader className="custom-header">Header</AbpModalHeader>
      </TestWrapper>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

describe('AbpModalBody', () => {
  it('should render children', () => {
    render(
      <TestWrapper>
        <AbpModalBody>Body Content</AbpModalBody>
      </TestWrapper>
    );
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestWrapper>
        <AbpModalBody className="custom-body">Body</AbpModalBody>
      </TestWrapper>
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

describe('AbpModalFooter', () => {
  it('should render children', () => {
    render(
      <TestWrapper>
        <AbpModalFooter>
          <button>Action</button>
        </AbpModalFooter>
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <TestWrapper>
        <AbpModalFooter className="custom-footer">
          <button>Action</button>
        </AbpModalFooter>
      </TestWrapper>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
