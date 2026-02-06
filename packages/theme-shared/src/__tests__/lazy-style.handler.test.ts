import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  createLazyStyleHref,
  useLazyStyleHandler,
  getLoadedBootstrapDirection,
  initLazyStyleHandler,
} from '../handlers/lazy-style.handler';
import { BOOTSTRAP } from '../constants/styles';

describe('lazy-style.handler (v2.9.0)', () => {
  describe('createLazyStyleHref', () => {
    it('should replace {{dir}} with ltr', () => {
      const result = createLazyStyleHref('bootstrap-{{dir}}.min.css', 'ltr');
      expect(result).toBe('bootstrap-ltr.min.css');
    });

    it('should replace {{dir}} with rtl', () => {
      const result = createLazyStyleHref('bootstrap-{{dir}}.min.css', 'rtl');
      expect(result).toBe('bootstrap-rtl.min.css');
    });

    it('should work with BOOTSTRAP constant', () => {
      const ltrResult = createLazyStyleHref(BOOTSTRAP, 'ltr');
      const rtlResult = createLazyStyleHref(BOOTSTRAP, 'rtl');

      expect(ltrResult).toBe('bootstrap-ltr.min.css');
      expect(rtlResult).toBe('bootstrap-rtl.min.css');
    });

    it('should replace only first occurrence of {{dir}}', () => {
      const result = createLazyStyleHref('{{dir}}-style-{{dir}}.css', 'rtl');
      expect(result).toBe('rtl-style-{{dir}}.css');
    });

    it('should return unchanged string if no {{dir}} placeholder', () => {
      const result = createLazyStyleHref('regular-style.css', 'rtl');
      expect(result).toBe('regular-style.css');
    });

    it('should handle empty string', () => {
      const result = createLazyStyleHref('', 'ltr');
      expect(result).toBe('');
    });

    it('should handle custom direction strings', () => {
      const result = createLazyStyleHref('style-{{dir}}.css', 'custom');
      expect(result).toBe('style-custom.css');
    });
  });

  describe('useLazyStyleHandler', () => {
    let originalBodyDir: string;

    beforeEach(() => {
      originalBodyDir = document.body.dir;
      document.body.dir = '';
      // Clean up any link elements
      document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
    });

    afterEach(() => {
      document.body.dir = originalBodyDir;
      document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
    });

    it('should initialize with default direction ltr', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      expect(result.current.direction).toBe('ltr');
    });

    it('should initialize with custom initial direction', () => {
      const { result } = renderHook(() =>
        useLazyStyleHandler({ initialDirection: 'rtl' })
      );

      expect(result.current.direction).toBe('rtl');
    });

    it('should set body dir attribute', () => {
      renderHook(() => useLazyStyleHandler({ initialDirection: 'rtl' }));

      expect(document.body.dir).toBe('rtl');
    });

    it('should update direction when setDirection is called', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      expect(result.current.direction).toBe('ltr');

      act(() => {
        result.current.setDirection('rtl');
      });

      expect(result.current.direction).toBe('rtl');
    });

    it('should update body dir when direction changes', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      expect(document.body.dir).toBe('ltr');

      act(() => {
        result.current.setDirection('rtl');
      });

      expect(document.body.dir).toBe('rtl');
    });

    it('should use default styles (BOOTSTRAP) when no styles provided', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      // Internal behavior - should use BOOTSTRAP
      expect(result.current.direction).toBe('ltr');
    });

    it('should accept custom styles array', () => {
      const customStyles = ['custom-{{dir}}.css', 'theme-{{dir}}.css'];
      const { result } = renderHook(() =>
        useLazyStyleHandler({ styles: customStyles })
      );

      expect(result.current.direction).toBe('ltr');
    });

    it('should toggle between ltr and rtl', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      expect(result.current.direction).toBe('ltr');

      act(() => {
        result.current.setDirection('rtl');
      });
      expect(result.current.direction).toBe('rtl');

      act(() => {
        result.current.setDirection('ltr');
      });
      expect(result.current.direction).toBe('ltr');
    });

    it('should handle multiple direction changes', () => {
      const { result } = renderHook(() => useLazyStyleHandler());

      act(() => {
        result.current.setDirection('rtl');
      });
      expect(result.current.direction).toBe('rtl');

      act(() => {
        result.current.setDirection('rtl');
      });
      expect(result.current.direction).toBe('rtl');

      act(() => {
        result.current.setDirection('ltr');
      });
      expect(result.current.direction).toBe('ltr');
    });
  });

  describe('getLoadedBootstrapDirection', () => {
    beforeEach(() => {
      // Clean up any link elements
      document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
    });

    afterEach(() => {
      document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
    });

    it('should return undefined when no bootstrap stylesheet is loaded', () => {
      const result = getLoadedBootstrapDirection();
      expect(result).toBeUndefined();
    });

    it('should detect ltr bootstrap', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/bootstrap-ltr.min.css';
      document.head.appendChild(link);

      const result = getLoadedBootstrapDirection();
      expect(result).toBe('ltr');
    });

    it('should detect rtl bootstrap', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/bootstrap-rtl.min.css';
      document.head.appendChild(link);

      const result = getLoadedBootstrapDirection();
      expect(result).toBe('rtl');
    });

    it('should work with custom styles array', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/custom-rtl.css';
      document.head.appendChild(link);

      const result = getLoadedBootstrapDirection(['custom-{{dir}}.css']);
      expect(result).toBe('rtl');
    });

    it('should return first match when multiple stylesheets exist', () => {
      const ltrLink = document.createElement('link');
      ltrLink.rel = 'stylesheet';
      ltrLink.href = '/assets/bootstrap-ltr.min.css';
      document.head.appendChild(ltrLink);

      const rtlLink = document.createElement('link');
      rtlLink.rel = 'stylesheet';
      rtlLink.href = '/assets/bootstrap-rtl.min.css';
      document.head.appendChild(rtlLink);

      const result = getLoadedBootstrapDirection();
      // Should return the first match
      expect(result).toBe('ltr');
    });

    it('should ignore non-matching stylesheets', () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/other-styles.css';
      document.head.appendChild(link);

      const result = getLoadedBootstrapDirection();
      expect(result).toBeUndefined();
    });

    it('should handle empty styles array', () => {
      const result = getLoadedBootstrapDirection([]);
      expect(result).toBeUndefined();
    });
  });

  describe('initLazyStyleHandler', () => {
    let originalBodyDir: string;

    beforeEach(() => {
      originalBodyDir = document.body.dir;
      document.body.dir = '';
    });

    afterEach(() => {
      document.body.dir = originalBodyDir;
    });

    it('should return a function', () => {
      const init = initLazyStyleHandler();
      expect(typeof init).toBe('function');
    });

    it('should set body dir to ltr by default', () => {
      const init = initLazyStyleHandler();
      const result = init();

      expect(document.body.dir).toBe('ltr');
      expect(result.direction).toBe('ltr');
    });

    it('should set body dir to custom initial direction', () => {
      const init = initLazyStyleHandler({ initialDirection: 'rtl' });
      const result = init();

      expect(document.body.dir).toBe('rtl');
      expect(result.direction).toBe('rtl');
    });

    it('should return object with direction', () => {
      const init = initLazyStyleHandler();
      const result = init();

      expect(result).toHaveProperty('direction');
      expect(typeof result.direction).toBe('string');
    });

    it('should be callable multiple times', () => {
      const init = initLazyStyleHandler({ initialDirection: 'ltr' });

      const result1 = init();
      expect(result1.direction).toBe('ltr');

      const init2 = initLazyStyleHandler({ initialDirection: 'rtl' });
      const result2 = init2();
      expect(result2.direction).toBe('rtl');
    });

    it('should accept styles option', () => {
      const init = initLazyStyleHandler({
        styles: ['custom-{{dir}}.css'],
        initialDirection: 'rtl',
      });
      const result = init();

      expect(result.direction).toBe('rtl');
    });
  });

  describe('BOOTSTRAP constant integration', () => {
    it('should use correct BOOTSTRAP pattern', () => {
      expect(BOOTSTRAP).toBe('bootstrap-{{dir}}.min.css');
    });

    it('should work with createLazyStyleHref', () => {
      expect(createLazyStyleHref(BOOTSTRAP, 'ltr')).toBe('bootstrap-ltr.min.css');
      expect(createLazyStyleHref(BOOTSTRAP, 'rtl')).toBe('bootstrap-rtl.min.css');
    });
  });
});
