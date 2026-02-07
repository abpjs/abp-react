import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  ConfirmationProvider,
  useConfirmation,
  useConfirmationState,
  useConfirmationContext,
} from '../contexts/confirmation.context';
import { Confirmation } from '../models';

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
      expect(typeof result.current.show).toBe('function');
      expect(typeof result.current.clear).toBe('function');
      expect(typeof result.current.listenToEscape).toBe('function');
      expect(typeof result.current.subscribe).toBe('function');
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

      // v2.0.0 - warn() method now uses 'warning' severity
      expect(result.current.state.confirmation?.severity).toBe('warning');
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

    // v2.1.0 - Uses Confirmation.Status instead of Toaster.Status
    it('should resolve promise with confirm status when confirmed (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Confirmation.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Confirmation.Status.confirm);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Confirmation.Status.confirm);
      });

      expect(result.current.state.confirmation).toBeNull();
    });

    it('should resolve promise with reject status when rejected (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Confirmation.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Confirmation.Status.reject);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Confirmation.Status.reject);
      });
    });

    it('should resolve promise with dismiss status when dismissed (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Confirmation.Status | undefined;

      act(() => {
        result.current.confirmation.warn('Are you sure?', 'Confirm').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.state.respond(Confirmation.Status.dismiss);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Confirmation.Status.dismiss);
      });
    });

    it('should clear confirmation with dismiss status (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Confirmation.Status | undefined;

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
        expect(resolvedStatus).toBe(Confirmation.Status.dismiss);
      });

      expect(result.current.state.confirmation).toBeNull();
    });

    it('should clear confirmation with custom status (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let resolvedStatus: Confirmation.Status | undefined;

      act(() => {
        result.current.confirmation.info('Test message', 'Test').then((status) => {
          resolvedStatus = status;
        });
      });

      act(() => {
        result.current.confirmation.clear(Confirmation.Status.reject);
      });

      await waitFor(() => {
        expect(resolvedStatus).toBe(Confirmation.Status.reject);
      });
    });

    it('should dismiss previous confirmation when showing a new one (v2.1.0)', async () => {
      const { result } = renderHook(
        () => ({
          confirmation: useConfirmation(),
          state: useConfirmationState(),
        }),
        { wrapper }
      );

      let firstStatus: Confirmation.Status | undefined;

      act(() => {
        result.current.confirmation.info('First message', 'First').then((status) => {
          firstStatus = status;
        });
      });

      act(() => {
        result.current.confirmation.warn('Second message', 'Second');
      });

      await waitFor(() => {
        expect(firstStatus).toBe(Confirmation.Status.dismiss);
      });

      expect(result.current.state.confirmation?.message).toBe('Second message');
    });

    // v2.0.0 - Confirmation.Options no longer has yesCopy/cancelCopy
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
          yesText: 'Delete',
          cancelText: 'Keep',
          hideCancelBtn: false,
          hideYesBtn: false,
        });
      });

      expect(result.current.state.confirmation?.options?.yesText).toBe('Delete');
      expect(result.current.state.confirmation?.options?.cancelText).toBe('Keep');
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

      expect(result.current.state.confirmation?.options?.hideCancelBtn).toBe(true);
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

      expect(result.current.state.confirmation?.options?.hideYesBtn).toBe(true);
    });

    // v2.0.0 - show method
    describe('show method (v2.0.0)', () => {
      it('should create confirmation with specified severity', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.show('Message', 'Title', 'neutral');
        });

        expect(result.current.state.confirmation?.severity).toBe('neutral');
      });

      it('should default to neutral severity if not specified', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.show('Message', 'Title');
        });

        expect(result.current.state.confirmation?.severity).toBe('neutral');
      });
    });

    // v2.0.0 - subscribe method
    describe('subscribe method (v2.0.0)', () => {
      it('should notify subscriber immediately with current confirmation', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();

        act(() => {
          result.current.confirmation.info('Test', 'Title');
        });

        act(() => {
          result.current.confirmation.subscribe(subscriber);
        });

        expect(subscriber).toHaveBeenCalledWith(expect.objectContaining({
          message: 'Test',
          title: 'Title',
        }));
      });

      it('should return unsubscribe function', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();
        let unsubscribe: () => void;

        act(() => {
          unsubscribe = result.current.confirmation.subscribe(subscriber);
        });

        expect(typeof unsubscribe!).toBe('function');
      });

      it('should stop receiving updates after unsubscribe', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();
        let unsubscribe: () => void;

        act(() => {
          unsubscribe = result.current.confirmation.subscribe(subscriber);
        });

        // Called once on subscribe with null
        expect(subscriber).toHaveBeenCalledTimes(1);
        subscriber.mockClear();

        // Unsubscribe
        act(() => {
          unsubscribe!();
        });

        // Show a confirmation - subscriber should NOT be called
        act(() => {
          result.current.confirmation.info('New message', 'New title');
        });

        // Subscriber should not be called after unsubscribe
        expect(subscriber).not.toHaveBeenCalled();
      });

      it('should notify subscriber on confirmation changes', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();

        act(() => {
          result.current.confirmation.subscribe(subscriber);
        });

        // Called once on subscribe with null
        expect(subscriber).toHaveBeenCalledWith(null);
        subscriber.mockClear();

        // Show a confirmation
        act(() => {
          result.current.confirmation.info('Test', 'Title');
        });

        // Wait for the effect to run
        await waitFor(() => {
          expect(subscriber).toHaveBeenCalled();
        });
      });
    });

    // v2.0.0 - listenToEscape method
    describe('listenToEscape method (v2.0.0)', () => {
      it('should enable escape key listening', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.listenToEscape();
        });

        // Method should not throw
        expect(true).toBe(true);
      });

      it('should dismiss confirmation when escape is pressed after listenToEscape (v2.1.0)', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        let resolvedStatus: Confirmation.Status | undefined;

        act(() => {
          result.current.confirmation.listenToEscape();
        });

        act(() => {
          result.current.confirmation.info('Test message', 'Test').then((status) => {
            resolvedStatus = status;
          });
        });

        expect(result.current.state.confirmation).not.toBeNull();

        // Simulate escape key press
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'Escape' });
          document.dispatchEvent(event);
        });

        await waitFor(() => {
          expect(resolvedStatus).toBe(Confirmation.Status.dismiss);
        });

        expect(result.current.state.confirmation).toBeNull();
      });

      // v3.0.0 - closable renamed to dismissible
      it('should not dismiss when dismissible is false (v3.0.0)', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.listenToEscape();
        });

        act(() => {
          result.current.confirmation.info('Test message', 'Test', { dismissible: false });
        });

        expect(result.current.state.confirmation).not.toBeNull();

        // Simulate escape key press
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'Escape' });
          document.dispatchEvent(event);
        });

        // Should still be open
        expect(result.current.state.confirmation).not.toBeNull();
      });

      it('should not dismiss when escape listener is not enabled', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        // Do NOT call listenToEscape()

        act(() => {
          result.current.confirmation.info('Test message', 'Test');
        });

        expect(result.current.state.confirmation).not.toBeNull();

        // Simulate escape key press
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'Escape' });
          document.dispatchEvent(event);
        });

        // Should still be open since listenToEscape was not called
        expect(result.current.state.confirmation).not.toBeNull();
      });
    });

    // v2.0.0 - LocalizationParam support
    describe('LocalizationParam support (v2.0.0)', () => {
      it('should store LocalizationWithDefault as-is for message', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const locParam = { key: 'Test::Message', defaultValue: 'Default message' };

        act(() => {
          result.current.confirmation.info(locParam, 'Test title');
        });

        expect(result.current.state.confirmation?.message).toEqual(locParam);
      });

      it('should store LocalizationWithDefault as-is for title', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const titleParam = { key: 'Test::Title', defaultValue: 'Default title' };

        act(() => {
          result.current.confirmation.success('Message text', titleParam);
        });

        expect(result.current.state.confirmation?.title).toEqual(titleParam);
      });
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

  // v4.0.0 - LocalizationParam type for message/title, cancelText/yesText
  describe('v4.0.0 changes', () => {
    describe('LocalizationParam for cancelText and yesText', () => {
      it('should store string cancelText and yesText in options', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.warn('Delete?', 'Confirm', {
            cancelText: 'No, keep it',
            yesText: 'Yes, delete',
          });
        });

        expect(result.current.state.confirmation?.options?.cancelText).toBe('No, keep it');
        expect(result.current.state.confirmation?.options?.yesText).toBe('Yes, delete');
      });

      it('should store LocalizationWithDefault cancelText and yesText in options', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const cancelParam = { key: 'AbpUi::Cancel', defaultValue: 'Cancel' };
        const yesParam = { key: 'AbpUi::PleaseConfirm', defaultValue: 'Confirm' };

        act(() => {
          result.current.confirmation.warn('Delete?', 'Confirm', {
            cancelText: cancelParam,
            yesText: yesParam,
          });
        });

        expect(result.current.state.confirmation?.options?.cancelText).toEqual(cancelParam);
        expect(result.current.state.confirmation?.options?.yesText).toEqual(yesParam);
      });
    });

    describe('LocalizationParam for message and title', () => {
      it('should accept LocalizationWithDefault for all severity methods', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const msg = { key: 'Test::ConfirmDelete', defaultValue: 'Are you sure?' };
        const title = { key: 'Test::Warning', defaultValue: 'Warning' };

        // Test with info
        act(() => {
          result.current.confirmation.info(msg, title);
        });
        expect(result.current.state.confirmation?.message).toEqual(msg);
        expect(result.current.state.confirmation?.title).toEqual(title);

        // Clear and test with success
        act(() => {
          result.current.state.respond(Confirmation.Status.dismiss);
        });
        act(() => {
          result.current.confirmation.success(msg, title);
        });
        expect(result.current.state.confirmation?.message).toEqual(msg);

        // Clear and test with warn
        act(() => {
          result.current.state.respond(Confirmation.Status.dismiss);
        });
        act(() => {
          result.current.confirmation.warn(msg, title);
        });
        expect(result.current.state.confirmation?.message).toEqual(msg);

        // Clear and test with error
        act(() => {
          result.current.state.respond(Confirmation.Status.dismiss);
        });
        act(() => {
          result.current.confirmation.error(msg, title);
        });
        expect(result.current.state.confirmation?.message).toEqual(msg);
      });

      it('should accept mixed string and LocalizationWithDefault', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const titleObj = { key: 'Test::Title', defaultValue: 'Default Title' };

        act(() => {
          result.current.confirmation.show('Plain text message', titleObj, 'info');
        });

        expect(result.current.state.confirmation?.message).toBe('Plain text message');
        expect(result.current.state.confirmation?.title).toEqual(titleObj);
      });

      it('should accept undefined title with LocalizationParam message', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const msg = { key: 'Test::NoTitle', defaultValue: 'No title needed' };

        act(() => {
          result.current.confirmation.info(msg);
        });

        expect(result.current.state.confirmation?.message).toEqual(msg);
        expect(result.current.state.confirmation?.title).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should handle empty string message and title', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.confirmation.info('', '');
        });

        expect(result.current.state.confirmation?.message).toBe('');
        expect(result.current.state.confirmation?.title).toBe('');
      });

      it('should handle options with all v4.0.0 fields together', async () => {
        const { result } = renderHook(
          () => ({
            confirmation: useConfirmation(),
            state: useConfirmationState(),
          }),
          { wrapper }
        );

        const msg = { key: 'Test::Complex', defaultValue: 'Complex' };
        const title = { key: 'Test::ComplexTitle', defaultValue: 'Complex Title' };

        act(() => {
          result.current.confirmation.warn(msg, title, {
            id: 'v4-test',
            dismissible: true,
            cancelText: { key: 'AbpUi::Cancel', defaultValue: 'Cancel' },
            yesText: { key: 'AbpUi::Confirm', defaultValue: 'Confirm' },
            hideCancelBtn: false,
            hideYesBtn: false,
            messageLocalizationParams: ['param1'],
            titleLocalizationParams: ['param2'],
          });
        });

        const conf = result.current.state.confirmation;
        expect(conf?.message).toEqual(msg);
        expect(conf?.title).toEqual(title);
        expect(conf?.severity).toBe('warning');
        expect(conf?.options?.cancelText).toEqual({ key: 'AbpUi::Cancel', defaultValue: 'Cancel' });
        expect(conf?.options?.yesText).toEqual({ key: 'AbpUi::Confirm', defaultValue: 'Confirm' });
        expect(conf?.options?.messageLocalizationParams).toEqual(['param1']);
      });
    });
  });
});
