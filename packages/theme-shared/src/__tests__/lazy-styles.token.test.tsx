import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  LAZY_STYLES,
  DEFAULT_LAZY_STYLES,
  LazyStylesContext,
  useLazyStyles,
} from '../tokens/lazy-styles.token';
import { BOOTSTRAP } from '../constants/styles';

describe('lazy-styles.token (v2.9.0)', () => {
  describe('LAZY_STYLES constant', () => {
    it('should be defined', () => {
      expect(LAZY_STYLES).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(LAZY_STYLES)).toBe(true);
    });

    it('should contain BOOTSTRAP pattern', () => {
      expect(LAZY_STYLES).toContain(BOOTSTRAP);
    });

    it('should equal DEFAULT_LAZY_STYLES', () => {
      expect(LAZY_STYLES).toEqual(DEFAULT_LAZY_STYLES);
    });
  });

  describe('DEFAULT_LAZY_STYLES', () => {
    it('should be defined', () => {
      expect(DEFAULT_LAZY_STYLES).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_LAZY_STYLES)).toBe(true);
    });

    it('should have at least one entry', () => {
      expect(DEFAULT_LAZY_STYLES.length).toBeGreaterThanOrEqual(1);
    });

    it('should contain bootstrap pattern', () => {
      expect(DEFAULT_LAZY_STYLES).toContain('bootstrap-{{dir}}.min.css');
    });
  });

  describe('LazyStylesContext', () => {
    it('should be a React Context', () => {
      expect(LazyStylesContext).toBeDefined();
      expect(LazyStylesContext.Provider).toBeDefined();
      expect(LazyStylesContext.Consumer).toBeDefined();
    });

    it('should have default value of DEFAULT_LAZY_STYLES', () => {
      const { result } = renderHook(() => React.useContext(LazyStylesContext));
      expect(result.current).toEqual(DEFAULT_LAZY_STYLES);
    });

    it('should allow custom value through Provider', () => {
      const customStyles = ['custom-{{dir}}.css', 'theme-{{dir}}.css'];
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LazyStylesContext.Provider value={customStyles}>
          {children}
        </LazyStylesContext.Provider>
      );

      const { result } = renderHook(() => React.useContext(LazyStylesContext), {
        wrapper,
      });

      expect(result.current).toEqual(customStyles);
    });
  });

  describe('useLazyStyles hook', () => {
    it('should return default lazy styles without provider', () => {
      const { result } = renderHook(() => useLazyStyles());
      expect(result.current).toEqual(DEFAULT_LAZY_STYLES);
    });

    it('should return array', () => {
      const { result } = renderHook(() => useLazyStyles());
      expect(Array.isArray(result.current)).toBe(true);
    });

    it('should contain bootstrap pattern', () => {
      const { result } = renderHook(() => useLazyStyles());
      expect(result.current).toContain(BOOTSTRAP);
    });

    it('should return custom styles from provider', () => {
      const customStyles = ['my-style-{{dir}}.css'];
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LazyStylesContext.Provider value={customStyles}>
          {children}
        </LazyStylesContext.Provider>
      );

      const { result } = renderHook(() => useLazyStyles(), { wrapper });

      expect(result.current).toEqual(customStyles);
    });

    it('should handle empty array from provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LazyStylesContext.Provider value={[]}>
          {children}
        </LazyStylesContext.Provider>
      );

      const { result } = renderHook(() => useLazyStyles(), { wrapper });

      expect(result.current).toEqual([]);
    });

    it('should handle multiple styles from provider', () => {
      const customStyles = [
        'bootstrap-{{dir}}.min.css',
        'fontawesome-{{dir}}.css',
        'theme-{{dir}}.css',
      ];
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LazyStylesContext.Provider value={customStyles}>
          {children}
        </LazyStylesContext.Provider>
      );

      const { result } = renderHook(() => useLazyStyles(), { wrapper });

      expect(result.current).toHaveLength(3);
      expect(result.current).toEqual(customStyles);
    });

    it('should inherit from nested providers (innermost wins)', () => {
      const outerStyles = ['outer-{{dir}}.css'];
      const innerStyles = ['inner-{{dir}}.css'];

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LazyStylesContext.Provider value={outerStyles}>
          <LazyStylesContext.Provider value={innerStyles}>
            {children}
          </LazyStylesContext.Provider>
        </LazyStylesContext.Provider>
      );

      const { result } = renderHook(() => useLazyStyles(), { wrapper });

      expect(result.current).toEqual(innerStyles);
    });
  });

  describe('Integration with BOOTSTRAP constant', () => {
    it('should BOOTSTRAP be part of default lazy styles', () => {
      expect(DEFAULT_LAZY_STYLES.includes(BOOTSTRAP)).toBe(true);
    });

    it('should LAZY_STYLES contain same bootstrap as BOOTSTRAP constant', () => {
      expect(LAZY_STYLES[0]).toBe(BOOTSTRAP);
    });

    it('should useLazyStyles return styles containing BOOTSTRAP by default', () => {
      const { result } = renderHook(() => useLazyStyles());
      expect(result.current.includes(BOOTSTRAP)).toBe(true);
    });
  });
});
