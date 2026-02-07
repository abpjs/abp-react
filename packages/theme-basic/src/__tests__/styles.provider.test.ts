/**
 * Tests for styles.provider v3.2.0
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

    it('should contain abp-loading styles (v3.2.0: reduced opacity)', () => {
      expect(THEME_BASIC_STYLES).toContain('.abp-loading');
      expect(THEME_BASIC_STYLES).toContain('background: rgba(0, 0, 0, 0.05)');
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
      expect(THEME_BASIC_STYLES).toContain('/* Loading overlay (v3.2.0: reduced opacity from 0.1 to 0.05) */');
      expect(THEME_BASIC_STYLES).toContain('/* Modal backdrop */');
    });

    it('should have proper closing braces for all style blocks', () => {
      const openBraces = (THEME_BASIC_STYLES.match(/\{/g) || []).length;
      const closeBraces = (THEME_BASIC_STYLES.match(/\}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });
  });

  describe('v3.2.0 changes', () => {
    it('should have reduced opacity for .abp-loading (0.05 instead of 0.1)', () => {
      // v3.2.0 changed the opacity from 0.1 to 0.05 for better UX
      expect(THEME_BASIC_STYLES).toContain('background: rgba(0, 0, 0, 0.05)');
      // Ensure the old value is NOT present
      expect(THEME_BASIC_STYLES).not.toContain('background: rgba(0, 0, 0, 0.1)');
    });

    it('should document the v3.2.0 change in the CSS comment', () => {
      // The comment should document the version change
      expect(THEME_BASIC_STYLES).toMatch(/Loading overlay.*v3\.2\.0.*reduced opacity/);
    });

    it('should have .abp-loading as a complete rule with proper background value', () => {
      // Verify the complete rule structure
      const abpLoadingMatch = THEME_BASIC_STYLES.match(/\.abp-loading\s*\{[^}]*\}/);
      expect(abpLoadingMatch).not.toBeNull();
      expect(abpLoadingMatch![0]).toContain('background: rgba(0, 0, 0, 0.05)');
    });

    it('should maintain the .abp-loading class selector format', () => {
      // Ensure the selector is properly formatted
      expect(THEME_BASIC_STYLES).toMatch(/\.abp-loading\s*\{/);
    });

    it('should have lighter loading overlay than modal backdrop', () => {
      // .abp-loading should be lighter (0.05) than .modal-backdrop (0.6)
      // Extract opacity values
      const loadingMatch = THEME_BASIC_STYLES.match(/\.abp-loading[^}]*rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/);
      const backdropMatch = THEME_BASIC_STYLES.match(/\.modal-backdrop[^}]*rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/);

      expect(loadingMatch).not.toBeNull();
      expect(backdropMatch).not.toBeNull();

      const loadingOpacity = parseFloat(loadingMatch![1]);
      const backdropOpacity = parseFloat(backdropMatch![1]);

      expect(loadingOpacity).toBeLessThan(backdropOpacity);
      expect(loadingOpacity).toBe(0.05);
      expect(backdropOpacity).toBe(0.6);
    });
  });
});
