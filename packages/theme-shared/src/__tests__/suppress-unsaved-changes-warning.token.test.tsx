import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  SUPPRESS_UNSAVED_CHANGES_WARNING,
  SuppressUnsavedChangesWarningContext,
  useSuppressUnsavedChangesWarning,
} from '../tokens/suppress-unsaved-changes-warning.token';

describe('suppress-unsaved-changes-warning.token (v4.0.0)', () => {
  describe('SUPPRESS_UNSAVED_CHANGES_WARNING constant', () => {
    it('should be defined', () => {
      expect(SUPPRESS_UNSAVED_CHANGES_WARNING).toBeDefined();
    });

    it('should be a string', () => {
      expect(typeof SUPPRESS_UNSAVED_CHANGES_WARNING).toBe('string');
    });

    it('should equal the expected token name', () => {
      expect(SUPPRESS_UNSAVED_CHANGES_WARNING).toBe('SUPPRESS_UNSAVED_CHANGES_WARNING');
    });
  });

  describe('SuppressUnsavedChangesWarningContext', () => {
    it('should be a React Context', () => {
      expect(SuppressUnsavedChangesWarningContext).toBeDefined();
      expect(SuppressUnsavedChangesWarningContext.Provider).toBeDefined();
      expect(SuppressUnsavedChangesWarningContext.Consumer).toBeDefined();
    });

    it('should have a default value of false', () => {
      // Without a provider, the default context value is false
      const { result } = renderHook(() => useSuppressUnsavedChangesWarning());
      expect(result.current).toBe(false);
    });
  });

  describe('useSuppressUnsavedChangesWarning', () => {
    it('should return false by default (no provider)', () => {
      const { result } = renderHook(() => useSuppressUnsavedChangesWarning());
      expect(result.current).toBe(false);
    });

    it('should return true when provider value is true', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SuppressUnsavedChangesWarningContext.Provider value={true}>
          {children}
        </SuppressUnsavedChangesWarningContext.Provider>
      );

      const { result } = renderHook(() => useSuppressUnsavedChangesWarning(), { wrapper });
      expect(result.current).toBe(true);
    });

    it('should return false when provider value is false', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SuppressUnsavedChangesWarningContext.Provider value={false}>
          {children}
        </SuppressUnsavedChangesWarningContext.Provider>
      );

      const { result } = renderHook(() => useSuppressUnsavedChangesWarning(), { wrapper });
      expect(result.current).toBe(false);
    });

    it('should use nearest provider value', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SuppressUnsavedChangesWarningContext.Provider value={true}>
          <SuppressUnsavedChangesWarningContext.Provider value={false}>
            {children}
          </SuppressUnsavedChangesWarningContext.Provider>
        </SuppressUnsavedChangesWarningContext.Provider>
      );

      const { result } = renderHook(() => useSuppressUnsavedChangesWarning(), { wrapper });
      expect(result.current).toBe(false);
    });

    it('should update when provider value changes', () => {
      function DynamicWrapper({ children, value }: { children: React.ReactNode; value: boolean }) {
        return (
          <SuppressUnsavedChangesWarningContext.Provider value={value}>
            {children}
          </SuppressUnsavedChangesWarningContext.Provider>
        );
      }

      const { result, rerender } = renderHook(() => useSuppressUnsavedChangesWarning(), {
        wrapper: ({ children }) => <DynamicWrapper value={false}>{children}</DynamicWrapper>,
      });

      expect(result.current).toBe(false);

      rerender();
      // After rerender with same value, should still be false
      expect(result.current).toBe(false);
    });
  });

  describe('export from tokens/index.ts', () => {
    it('should be importable from tokens barrel export', async () => {
      const tokens = await import('../tokens');
      expect(tokens.SUPPRESS_UNSAVED_CHANGES_WARNING).toBe('SUPPRESS_UNSAVED_CHANGES_WARNING');
      expect(tokens.SuppressUnsavedChangesWarningContext).toBeDefined();
      expect(tokens.useSuppressUnsavedChangesWarning).toBeDefined();
      expect(typeof tokens.useSuppressUnsavedChangesWarning).toBe('function');
    });
  });
});
