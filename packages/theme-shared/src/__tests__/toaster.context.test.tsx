import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  ToasterProvider,
  useToaster,
  useToasts,
  useToasterContext,
} from '../contexts/toaster.context';
import { Toaster } from '../models';

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
      expect(typeof result.current.addAll).toBe('function');
      expect(typeof result.current.clear).toBe('function');
      expect(typeof result.current.remove).toBe('function');
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
      expect(result.current.toasts[0].severity).toBe('warn');
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

      act(() => {
        result.current.toaster.info('Message 1', 'Title 1', { id: 'toast-1', sticky: true });
        result.current.toaster.info('Message 2', 'Title 2', { id: 'toast-2', sticky: true });
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.toaster.remove('toast-1');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe('toast-2');
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

    it('should add multiple toasts with addAll', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.toaster.addAll([
          { message: 'Message 1', severity: 'info', sticky: true },
          { message: 'Message 2', severity: 'success', sticky: true },
          { message: 'Message 3', severity: 'error', sticky: true },
        ]);
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].severity).toBe('info');
      expect(result.current.toasts[1].severity).toBe('success');
      expect(result.current.toasts[2].severity).toBe('error');
    });

    it('should resolve promise with dismiss status when toast is removed', async () => {
      const { result } = renderHook(
        () => ({
          toaster: useToaster(),
          toasts: useToasts(),
        }),
        { wrapper }
      );

      let toastPromise: Promise<Toaster.Status> | undefined;

      act(() => {
        toastPromise = result.current.toaster.info('Test message', 'Test', {
          id: 'test-toast',
          sticky: true,
        });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.toaster.remove('test-toast');
      });

      expect(result.current.toasts).toHaveLength(0);

      // The promise should resolve with dismiss status
      const status = await toastPromise;
      expect(status).toBe(Toaster.Status.dismiss);
    });

    it('should include localization params in toast', async () => {
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

      expect(result.current.toasts[0].messageLocalizationParams).toEqual(['param1', 'param2']);
      expect(result.current.toasts[0].titleLocalizationParams).toEqual(['titleParam']);
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
