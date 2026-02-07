/**
 * Tests for styles.provider v3.0.0
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  THEME_BASIC_STYLES,
  injectThemeBasicStyles,
  configureStyles,
  BASIC_THEME_STYLES_PROVIDERS,
  initializeThemeBasicStyles,
} from '../providers/styles.provider';

describe('styles.provider', () => {
  beforeEach(() => {
    // Clear any injected styles
    const existingStyle = document.getElementById('abpjs-theme-basic-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  afterEach(() => {
    // Clean up any injected styles
    const existingStyle = document.getElementById('abpjs-theme-basic-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  describe('THEME_BASIC_STYLES', () => {
    it('should be a non-empty string', () => {
      expect(typeof THEME_BASIC_STYLES).toBe('string');
      expect(THEME_BASIC_STYLES.length).toBeGreaterThan(0);
    });

    it('should contain content-header-title styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.content-header-title');
      expect(THEME_BASIC_STYLES).toContain('font-size: 24px');
    });

    it('should contain entry-row styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.entry-row');
      expect(THEME_BASIC_STYLES).toContain('margin-bottom: 15px');
    });

    it('should contain input-validation-error styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.input-validation-error');
      expect(THEME_BASIC_STYLES).toContain('border-color: #dc3545');
    });

    it('should contain field-validation-error styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.field-validation-error');
      expect(THEME_BASIC_STYLES).toContain('font-size: 0.8em');
    });

    it('should contain ui-table styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.ui-table');
      expect(THEME_BASIC_STYLES).toContain('.pagination-wrapper');
    });

    it('should contain bordered datatable styles (v3.0.0)', () => {
      expect(THEME_BASIC_STYLES).toContain('.bordered .datatable-body-row');
      expect(THEME_BASIC_STYLES).toContain('border-top: 1px solid #eee');
    });

    it('should contain abp-loading styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.abp-loading');
      expect(THEME_BASIC_STYLES).toContain('background: rgba(0, 0, 0, 0.1)');
    });

    it('should contain modal-backdrop styles', () => {
      expect(THEME_BASIC_STYLES).toContain('.modal-backdrop');
      expect(THEME_BASIC_STYLES).toContain('background-color: rgba(0, 0, 0, 0.6)');
    });
  });

  describe('injectThemeBasicStyles', () => {
    it('should inject a style element into document head', () => {
      injectThemeBasicStyles();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement).not.toBeNull();
      expect(styleElement?.tagName.toLowerCase()).toBe('style');
    });

    it('should set correct id on style element', () => {
      injectThemeBasicStyles();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement?.id).toBe('abpjs-theme-basic-styles');
    });

    it('should inject THEME_BASIC_STYLES content', () => {
      injectThemeBasicStyles();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement?.textContent).toBe(THEME_BASIC_STYLES);
    });

    it('should not inject duplicate styles when called multiple times', () => {
      injectThemeBasicStyles();
      injectThemeBasicStyles();
      injectThemeBasicStyles();

      const styleElements = document.querySelectorAll('#abpjs-theme-basic-styles');
      expect(styleElements.length).toBe(1);
    });

    it('should be idempotent', () => {
      injectThemeBasicStyles();
      const firstContent = document.getElementById('abpjs-theme-basic-styles')?.textContent;

      injectThemeBasicStyles();
      const secondContent = document.getElementById('abpjs-theme-basic-styles')?.textContent;

      expect(firstContent).toBe(secondContent);
    });
  });

  describe('configureStyles', () => {
    it('should return a configuration function', () => {
      const configFn = configureStyles();
      expect(typeof configFn).toBe('function');
    });

    it('should inject styles when configuration function is called', () => {
      const configFn = configureStyles();
      configFn();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement).not.toBeNull();
    });

    it('should not inject styles until configuration function is called', () => {
      configureStyles(); // Get function but don't call it

      // Style should not be injected yet
      let styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement).toBeNull();

      // Now call the function
      const configFn = configureStyles();
      configFn();

      styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement).not.toBeNull();
    });
  });

  describe('BASIC_THEME_STYLES_PROVIDERS', () => {
    it('should export configureStyles function', () => {
      expect(BASIC_THEME_STYLES_PROVIDERS.configureStyles).toBe(configureStyles);
    });

    it('should be a valid provider object', () => {
      expect(typeof BASIC_THEME_STYLES_PROVIDERS).toBe('object');
      expect(typeof BASIC_THEME_STYLES_PROVIDERS.configureStyles).toBe('function');
    });
  });

  describe('initializeThemeBasicStyles', () => {
    it('should inject styles into document head', () => {
      initializeThemeBasicStyles();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement).not.toBeNull();
    });

    it('should be idempotent (can be called multiple times)', () => {
      initializeThemeBasicStyles();
      initializeThemeBasicStyles();
      initializeThemeBasicStyles();

      const styleElements = document.querySelectorAll('#abpjs-theme-basic-styles');
      expect(styleElements.length).toBe(1);
    });

    it('should inject correct styles content', () => {
      initializeThemeBasicStyles();

      const styleElement = document.getElementById('abpjs-theme-basic-styles');
      expect(styleElement?.textContent).toBe(THEME_BASIC_STYLES);
    });
  });

  describe('style content validation', () => {
    it('should contain valid CSS (no syntax errors in critical selectors)', () => {
      // Basic validation that CSS selectors are properly formatted
      expect(THEME_BASIC_STYLES).toMatch(/\.[a-zA-Z-]+\s*\{/);
    });

    it('should contain CSS comments for sections', () => {
      expect(THEME_BASIC_STYLES).toContain('/* Content header styles */');
      expect(THEME_BASIC_STYLES).toContain('/* Input validation styles */');
      expect(THEME_BASIC_STYLES).toContain('/* Table styles */');
      expect(THEME_BASIC_STYLES).toContain('/* Bordered datatable styles (added in v3.0.0) */');
      expect(THEME_BASIC_STYLES).toContain('/* Loading overlay */');
      expect(THEME_BASIC_STYLES).toContain('/* Modal backdrop */');
    });

    it('should have proper closing braces for all style blocks', () => {
      const openBraces = (THEME_BASIC_STYLES.match(/\{/g) || []).length;
      const closeBraces = (THEME_BASIC_STYLES.match(/\}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });
  });
});
