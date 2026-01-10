import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  ConfirmationProvider,
  useConfirmation,
  useConfirmationState,
  useConfirmationContext,
} from '../contexts/confirmation.context';
import { Toaster } from '../models';

describe('ConfirmationContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfirmationProvider>{children}</ConfirmationProvider>
  );

  describe('useConfirmation', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useConfirmation());
      }).toThrow('useConfirmation must be used within a ConfirmationProvider');
    });

    it('should return confirmation service when used within provider', () => {
      const { result } = renderHook(() => useConfirmation(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.info).toBe('function');
      expect(typeof result.current.success).toBe('function');
      expect(typeof result.current.warn).toBe('function');
      expect(typeof result.current.error).toBe('function');
      expect(typeof result.current.clear).toBe('function');
    });

    it('should show an info confirmation', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.info('Info message', 'Info title');
      });

      expect(result.current.state.confirmation).not.toBeNull();
      expect(result.current.state.confirmation?.message).toBe('Info message');
      expect(result.current.state.confirmation?.title).toBe('Info title');
      expect(result.current.state.confirmation?.severity).toBe('info');
    });

    it('should show a success confirmation', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.success('Success message', 'Success title');
      });

      expect(result.current.state.confirmation?.severity).toBe('success');
    });

    it('should show a warning confirmation', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.warn('Warning message', 'Warning title');
      });

      expect(result.current.state.confirmation?.severity).toBe('warn');
    });

    it('should show an error confirmation', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.error('Error message', 'Error title');
      });

      expect(result.current.state.confirmation?.severity).toBe('error');
    });

    it('should resolve promise with confirm status when confirmed', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Toaster.Status.confirm);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Toaster.Status.confirm);
      });

      expect(result.current.state.confirmation).toBeNull();
    });

    it('should resolve promise with reject status when rejected', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Toaster.Status.reject);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Toaster.Status.reject);
      });
    });

    it('should resolve promise with dismiss status when dismissed', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Toaster.Status.dismiss);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Toaster.Status.dismiss);
      });
    });

    it('should clear confirmation with dismiss status', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.info('Test message', 'Test').then((status) => {
          resolvedStatus = status;
        });
      });

      expect(result.current.state.confirmation).not.toBeNull();

      act(() => {
        result.current.confirmation.clear();
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Toaster.Status.dismiss);
      });

      expect(result.current.state.confirmation).toBeNull();
    });

    it('should clear confirmation with custom status', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.info('Test message', 'Test').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.confirmation.clear(Toaster.Status.reject);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Toaster.Status.reject);
      });
    });

    it('should dismiss previous confirmation when showing a new one', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let firstStatus: Toaster.Status | undefined;

      act(() => {
        result.current.confirmation.info('First message', 'First').then((status) => {
          firstStatus = status;
        });
      });

      act(() => {
        result.current.confirmation.warn('Second message', 'Second');
      });

      await waitFor(() => {
        expect(firstStatus).toBe(Toaster.Status.dismiss);
      });

      expect(result.current.state.confirmation?.message).toBe('Second message');
    });

    it('should include custom options', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.warn('Delete this item?', 'Confirm Delete', {
          yesCopy: 'Delete',
          cancelCopy: 'Keep',
          hideCancelBtn: false,
          hideYesBtn: false,
        });
      });

      expect(result.current.state.confirmation?.options.yesCopy).toBe('Delete');
      expect(result.current.state.confirmation?.options.cancelCopy).toBe('Keep');
    });

    it('should support hideCancelBtn option', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.info('Information', 'Info', {
          hideCancelBtn: true,
        });
      });

      expect(result.current.state.confirmation?.options.hideCancelBtn).toBe(true);
    });

    it('should support hideYesBtn option', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.confirmation.info('Information', 'Info', {
          hideYesBtn: true,
        });
      });

      expect(result.current.state.confirmation?.options.hideYesBtn).toBe(true);
    });
  });

  describe('useConfirmationState', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useConfirmationState());
      }).toThrow('useConfirmationState must be used within a ConfirmationProvider');
    });

    it('should return null confirmation initially', () => {
      const { result } = renderHook(() => useConfirmationState(), { wrapper });

      expect(result.current.confirmation).toBeNull();
      expect(typeof result.current.respond).toBe('function');
    });
  });

  describe('useConfirmationContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useConfirmationContext());
      }).toThrow('useConfirmationContext must be used within a ConfirmationProvider');
    });

    it('should return full context value', () => {
      const { result } = renderHook(() => useConfirmationContext(), { wrapper });

      expect(result.current.service).toBeDefined();
      expect(result.current.confirmation).toBeNull();
      expect(typeof result.current.respond).toBe('function');
    });
  });
});
