import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  ToasterProvider,
  useToaster,
  useToasts,
  useToasterContext,
} from '../contexts/toaster.context';

describe('ToasterContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToasterProvider>{children}</ToasterProvider>
  );

  describe('useToaster', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useToaster());
      }).toThrow('useToaster must be used within a ToasterProvider');
    });

    it('should return toaster service when used within provider', () => {
      const { result } = renderHook(() => useToaster(), { wrapper });

      expect(result.current).toBeDefined();
      expect(typeof result.current.info).toBe('function');
      expect(typeof result.current.success).toBe('function');
      expect(typeof result.current.warn).toBe('function');
      expect(typeof result.current.error).toBe('function');
      expect(typeof result.current.show).toBe('function');
      expect(typeof result.current.clear).toBe('function');
      expect(typeof result.current.remove).toBe('function');
      expect(typeof result.current.subscribe).toBe('function');
    });

    it('should add an info toast', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.info('Test message', 'Test title');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test message');
      expect(result.current.toasts[0].title).toBe('Test title');
      expect(result.current.toasts[0].severity).toBe('info');
    });

    it('should add a success toast', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.success('Success message', 'Success');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].severity).toBe('success');
    });

    it('should add a warning toast', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.warn('Warning message', 'Warning');
      });

      expect(result.current.toasts).toHaveLength(1);
      // v2.0.0 - warn() method now uses 'warning' severity
      expect(result.current.toasts[0].severity).toBe('warning');
    });

    it('should add an error toast', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.error('Error message', 'Error');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].severity).toBe('error');
    });

    it('should auto-dismiss toast after life duration', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.info('Test message', 'Test', { life: 1000 });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Fast forward time
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not auto-dismiss sticky toast', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.info('Sticky message', 'Test', { sticky: true });
      });

      expect(result.current.toasts).toHaveLength(1);

      // Fast forward time beyond default life
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('should remove a specific toast by ID', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      let toast1Id: number;
      let toast2Id: number;

      act(() => {
        toast1Id = result.current.toaster.info('Message 1', 'Title 1', { sticky: true });
        toast2Id = result.current.toaster.info('Message 2', 'Title 2', { sticky: true });
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.toaster.remove(toast1Id);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe(toast2Id);
    });

    it('should clear all toasts', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.info('Message 1', 'Title 1', { sticky: true });
        result.current.toaster.info('Message 2', 'Title 2', { sticky: true });
        result.current.toaster.info('Message 3', 'Title 3', { sticky: true });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.toaster.clear();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    // v2.0.0 - methods return number instead of Promise<Status>
    it('should return toast ID when creating a toast (v2.0.0)', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      let toastId: number;

      act(() => {
        toastId = result.current.toaster.info('Test message', 'Test', { sticky: true });
      });

      expect(typeof toastId!).toBe('number');
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe(toastId!);
    });

    it('should include localization params in toast options', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.info('Test message', 'Test', {
          messageLocalizationParams: ['param1', 'param2'],
          titleLocalizationParams: ['titleParam'],
          sticky: true,
        });
      });

      // v2.0.0 - localization params are in options property
      expect(result.current.toasts[0].options?.messageLocalizationParams).toEqual(['param1', 'param2']);
      expect(result.current.toasts[0].options?.titleLocalizationParams).toEqual(['titleParam']);
    });

    // v2.0.0 - LocalizationParam is stored as-is, not resolved
    describe('LocalizationParam support (v2.0.0)', () => {
      it('should store LocalizationWithDefault as-is for message', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const locParam = { key: 'Test::Message', defaultValue: 'Default message' };

        act(() => {
          result.current.toaster.info(locParam, 'Test title', { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        // v2.0.0 - LocalizationParam is stored as-is, resolved in component
        expect(result.current.toasts[0].message).toEqual(locParam);
      });

      it('should store LocalizationWithDefault as-is for title', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const titleParam = { key: 'Test::Title', defaultValue: 'Default title' };

        act(() => {
          result.current.toaster.success('Message text', titleParam, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toEqual(titleParam);
      });

      it('should store both message and title as LocalizationParam', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const messageParam = { key: 'Test::Warning', defaultValue: 'Warning message' };
        const titleParam = { key: 'Test::WarningTitle', defaultValue: 'Warning title' };

        act(() => {
          result.current.toaster.warn(messageParam, titleParam, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toEqual(messageParam);
        expect(result.current.toasts[0].title).toEqual(titleParam);
      });

      it('should handle string message and undefined title', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.error('Error message', undefined, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toBe('Error message');
        expect(result.current.toasts[0].title).toBeUndefined();
      });

      it('should work with all severity methods', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.info('Info', undefined, { sticky: true });
          result.current.toaster.success('Success', undefined, { sticky: true });
          result.current.toaster.warn('Warn', undefined, { sticky: true });
          result.current.toaster.error('Error', undefined, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(4);
        expect(result.current.toasts[0].message).toBe('Info');
        expect(result.current.toasts[1].message).toBe('Success');
        expect(result.current.toasts[2].message).toBe('Warn');
        expect(result.current.toasts[3].message).toBe('Error');
      });
    });

    // v2.0.0 - show method
    describe('show method (v2.0.0)', () => {
      it('should create toast with specified severity', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.show('Message', 'Title', 'neutral', { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].severity).toBe('neutral');
      });

      it('should default to info severity if not specified', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.show('Message', 'Title', undefined, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].severity).toBe('info');
      });
    });

    // v2.0.0 - subscribe method
    describe('subscribe method (v2.0.0)', () => {
      it('should notify subscriber immediately with current toasts', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();

        act(() => {
          result.current.toaster.info('Test', undefined, { sticky: true });
        });

        act(() => {
          result.current.toaster.subscribe(subscriber);
        });

        // Should be called immediately with current toasts
        expect(subscriber).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({ message: 'Test' })
        ]));
      });

      it('should return unsubscribe function', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();
        let unsubscribe: () => void;

        act(() => {
          unsubscribe = result.current.toaster.subscribe(subscriber);
        });

        expect(typeof unsubscribe!).toBe('function');

        // Unsubscribe and verify no more calls
        act(() => {
          unsubscribe!();
        });

        subscriber.mockClear();

        act(() => {
          result.current.toaster.info('New toast', undefined, { sticky: true });
        });

        // Subscriber should not be called after unsubscribe
        expect(subscriber).not.toHaveBeenCalled();
      });

      it('should notify subscriber when toasts change', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        const subscriber = vi.fn();

        act(() => {
          result.current.toaster.subscribe(subscriber);
        });

        // Called once on subscribe with empty array
        expect(subscriber).toHaveBeenCalledWith([]);
        subscriber.mockClear();

        // Add a toast
        act(() => {
          result.current.toaster.info('Test', undefined, { sticky: true });
        });

        // Wait for the effect to run and notify subscriber
        await vi.waitFor(() => {
          expect(subscriber).toHaveBeenCalled();
        });

        // Should have been called with array containing the toast
        expect(subscriber).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ message: 'Test' })
          ])
        );
      });
    });

    // v2.0.0 - clear with containerKey
    describe('clear with containerKey (v2.0.0)', () => {
      it('should clear only toasts with matching containerKey', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.info('Toast 1', undefined, { sticky: true, containerKey: 'container-a' });
          result.current.toaster.info('Toast 2', undefined, { sticky: true, containerKey: 'container-b' });
          result.current.toaster.info('Toast 3', undefined, { sticky: true, containerKey: 'container-a' });
        });

        expect(result.current.toasts).toHaveLength(3);

        act(() => {
          result.current.toaster.clear('container-a');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].options?.containerKey).toBe('container-b');
      });

      it('should clear all toasts when containerKey is not provided', async () => {
        const { result } = renderHook(
          () => ({
            toaster: useToaster(),
            toasts: useToasts(),
          }),
          { wrapper }
        );

        act(() => {
          result.current.toaster.info('Toast 1', undefined, { sticky: true, containerKey: 'container-a' });
          result.current.toaster.info('Toast 2', undefined, { sticky: true });
        });

        expect(result.current.toasts).toHaveLength(2);

        act(() => {
          result.current.toaster.clear();
        });

        expect(result.current.toasts).toHaveLength(0);
      });
    });
  });

  describe('useToasts', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useToasts());
      }).toThrow('useToasts must be used within a ToasterProvider');
    });

    it('should return empty array initially', () => {
      const { result } = renderHook(() => useToasts(), { wrapper });

      expect(result.current).toEqual([]);
    });
  });

  describe('useToasterContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useToasterContext());
      }).toThrow('useToasterContext must be used within a ToasterProvider');
    });

    it('should return full context value', () => {
      const { result } = renderHook(() => useToasterContext(), { wrapper });

      expect(result.current.service).toBeDefined();
      expect(result.current.toasts).toEqual([]);
    });
  });
});
