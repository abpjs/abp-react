import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import {
  ModalProvider,
  useModal,
  useModalState,
  useModalContext,
  ModalContainer,
} from '../contexts/modal.context';

/**
 * Tests for modal.context.tsx - ModalService functionality
 * @since 2.7.0
 */

describe('ModalContext', () => {
  describe('ModalProvider', () => {
    it('should render children', () => {
      render(
        <ModalProvider>
          <div data-testid="child">Child Content</div>
        </ModalProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render modal container element', () => {
      render(
        <ModalProvider>
          <div>App</div>
        </ModalProvider>
      );

      expect(document.getElementById('modal-container')).toBeInTheDocument();
    });
  });

  describe('useModal', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useModal());
      }).toThrow('useModal must be used within a ModalProvider');

      consoleError.mockRestore();
    });

    it('should return modal service methods', () => {
      const { result } = renderHook(() => useModal(), {
        wrapper: ModalProvider,
      });

      expect(result.current.renderTemplate).toBeDefined();
      expect(result.current.clearModal).toBeDefined();
      expect(result.current.getContainer).toBeDefined();
      expect(result.current.detectChanges).toBeDefined();
    });

    it('should renderTemplate and update modal state', () => {
      const TestComponent = () => {
        const modal = useModal();
        const state = useModalState();

        return (
          <div>
            <button
              data-testid="open"
              onClick={() =>
                modal.renderTemplate(() => <div data-testid="modal-content">Modal</div>)
              }
            >
              Open
            </button>
            <div data-testid="has-modal">{state ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      expect(screen.getByTestId('has-modal')).toHaveTextContent('no');

      act(() => {
        fireEvent.click(screen.getByTestId('open'));
      });

      expect(screen.getByTestId('has-modal')).toHaveTextContent('yes');
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should renderTemplate with context', () => {
      const TestComponent = () => {
        const modal = useModal();

        return (
          <button
            data-testid="open"
            onClick={() =>
              modal.renderTemplate<{ name: string }>(
                (ctx) => <div data-testid="modal-content">Hello {ctx?.name}</div>,
                { name: 'World' }
              )
            }
          >
            Open
          </button>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId('open'));
      });

      expect(screen.getByTestId('modal-content')).toHaveTextContent('Hello World');
    });

    it('should clearModal', () => {
      const TestComponent = () => {
        const modal = useModal();
        const state = useModalState();

        return (
          <div>
            <button
              data-testid="open"
              onClick={() =>
                modal.renderTemplate(() => <div data-testid="modal-content">Modal</div>)
              }
            >
              Open
            </button>
            <button data-testid="close" onClick={() => modal.clearModal()}>
              Close
            </button>
            <div data-testid="has-modal">{state ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      // Open modal
      act(() => {
        fireEvent.click(screen.getByTestId('open'));
      });
      expect(screen.getByTestId('has-modal')).toHaveTextContent('yes');

      // Close modal
      act(() => {
        fireEvent.click(screen.getByTestId('close'));
      });
      expect(screen.getByTestId('has-modal')).toHaveTextContent('no');
      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });

    it('should getContainer return ref', () => {
      const TestComponent = () => {
        const modal = useModal();
        const containerRef = modal.getContainer();

        return (
          <div data-testid="has-ref">{containerRef ? 'yes' : 'no'}</div>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
        </ModalProvider>
      );

      expect(screen.getByTestId('has-ref')).toHaveTextContent('yes');
    });

    it('should detectChanges trigger state update', () => {
      const TestComponent = () => {
        const modal = useModal();
        const [counter, setCounter] = React.useState(0);

        // detectChanges triggers internal state update which can affect parent
        const handleDetect = () => {
          modal.detectChanges();
          // We can verify detectChanges doesn't throw and returns
          setCounter((c) => c + 1);
        };

        return (
          <div>
            <button data-testid="detect" onClick={handleDetect}>
              Detect Changes
            </button>
            <div data-testid="count">{counter}</div>
          </div>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
        </ModalProvider>
      );

      expect(screen.getByTestId('count')).toHaveTextContent('0');

      act(() => {
        fireEvent.click(screen.getByTestId('detect'));
      });

      // detectChanges should work without errors
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('useModalState', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useModalState());
      }).toThrow('useModalState must be used within a ModalProvider');

      consoleError.mockRestore();
    });

    it('should return null initially', () => {
      const { result } = renderHook(() => useModalState(), {
        wrapper: ModalProvider,
      });

      expect(result.current).toBeNull();
    });

    it('should return modal state when modal is open', () => {
      const TestComponent = () => {
        const modal = useModal();
        const state = useModalState();

        React.useEffect(() => {
          modal.renderTemplate(() => <div>Content</div>);
        }, [modal]);

        return <div data-testid="state">{state ? 'has-state' : 'no-state'}</div>;
      };

      render(
        <ModalProvider>
          <TestComponent />
        </ModalProvider>
      );

      expect(screen.getByTestId('state')).toHaveTextContent('has-state');
    });
  });

  describe('useModalContext', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useModalContext());
      }).toThrow('useModalContext must be used within a ModalProvider');

      consoleError.mockRestore();
    });

    it('should return full context with service and state', () => {
      const { result } = renderHook(() => useModalContext(), {
        wrapper: ModalProvider,
      });

      expect(result.current.service).toBeDefined();
      expect(result.current.modalState).toBeNull();
    });
  });

  describe('ModalContainer', () => {
    it('should render nothing when no modal is open', () => {
      const { container } = render(
        <ModalProvider>
          <ModalContainer />
        </ModalProvider>
      );

      // ModalContainer returns null when no modal
      expect(container.querySelector('[data-testid="modal-content"]')).not.toBeInTheDocument();
    });

    it('should render modal content when modal is open', () => {
      const TestComponent = () => {
        const modal = useModal();

        React.useEffect(() => {
          modal.renderTemplate(() => <div data-testid="modal-content">Modal Content</div>);
        }, [modal]);

        return null;
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('modal-content')).toHaveTextContent('Modal Content');
    });

    it('should pass context to render function', () => {
      const TestComponent = () => {
        const modal = useModal();

        React.useEffect(() => {
          modal.renderTemplate<{ value: number }>(
            (ctx) => <div data-testid="modal-content">Value: {ctx?.value}</div>,
            { value: 42 }
          );
        }, [modal]);

        return null;
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      expect(screen.getByTestId('modal-content')).toHaveTextContent('Value: 42');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple renderTemplate calls (replaces previous)', () => {
      const TestComponent = () => {
        const modal = useModal();

        return (
          <div>
            <button
              data-testid="modal1"
              onClick={() => modal.renderTemplate(() => <div data-testid="content1">Modal 1</div>)}
            >
              Modal 1
            </button>
            <button
              data-testid="modal2"
              onClick={() => modal.renderTemplate(() => <div data-testid="content2">Modal 2</div>)}
            >
              Modal 2
            </button>
          </div>
        );
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      // Open first modal
      act(() => {
        fireEvent.click(screen.getByTestId('modal1'));
      });
      expect(screen.getByTestId('content1')).toBeInTheDocument();

      // Open second modal (should replace first)
      act(() => {
        fireEvent.click(screen.getByTestId('modal2'));
      });
      expect(screen.queryByTestId('content1')).not.toBeInTheDocument();
      expect(screen.getByTestId('content2')).toBeInTheDocument();
    });

    it('should handle undefined context', () => {
      const TestComponent = () => {
        const modal = useModal();

        React.useEffect(() => {
          modal.renderTemplate((ctx) => (
            <div data-testid="modal-content">
              Context: {ctx === undefined ? 'undefined' : 'defined'}
            </div>
          ));
        }, [modal]);

        return null;
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      expect(screen.getByTestId('modal-content')).toHaveTextContent('Context: undefined');
    });

    it('should handle render function returning null', () => {
      const TestComponent = () => {
        const modal = useModal();
        const state = useModalState();

        React.useEffect(() => {
          modal.renderTemplate(() => null);
        }, [modal]);

        return <div data-testid="has-state">{state ? 'yes' : 'no'}</div>;
      };

      render(
        <ModalProvider>
          <TestComponent />
          <ModalContainer />
        </ModalProvider>
      );

      // State should still be set even though render returns null
      expect(screen.getByTestId('has-state')).toHaveTextContent('yes');
    });
  });
});
