import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectThemeSharedStyles, THEME_SHARED_STYLES } from '../utils/styles';

describe('injectThemeSharedStyles', () => {
  beforeEach(() => {
    // Clean up any existing styles
    const existingStyle = document.getElementById('abp-theme-shared-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  afterEach(() => {
    // Clean up after each test
    const existingStyle = document.getElementById('abp-theme-shared-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  it('should inject styles into document head', () => {
    injectThemeSharedStyles();

    const styleElement = document.getElementById('abp-theme-shared-styles');
    expect(styleElement).not.toBeNull();
    expect(styleElement?.tagName).toBe('STYLE');
  });

  it('should inject correct style content', () => {
    injectThemeSharedStyles();

    const styleElement = document.getElementById('abp-theme-shared-styles');
    expect(styleElement?.textContent).toBe(THEME_SHARED_STYLES);
  });

  it('should not inject duplicate styles', () => {
    injectThemeSharedStyles();
    injectThemeSharedStyles();

    const styleElements = document.querySelectorAll('#abp-theme-shared-styles');
    expect(styleElements.length).toBe(1);
  });

  it('should return cleanup function', () => {
    const cleanup = injectThemeSharedStyles();

    expect(typeof cleanup).toBe('function');

    // Verify style exists
    expect(document.getElementById('abp-theme-shared-styles')).not.toBeNull();

    // Call cleanup
    cleanup?.();

    // Verify style is removed
    expect(document.getElementById('abp-theme-shared-styles')).toBeNull();
  });

  it('should return undefined if already injected', () => {
    const cleanup1 = injectThemeSharedStyles();
    const cleanup2 = injectThemeSharedStyles();

    expect(cleanup1).toBeDefined();
    expect(cleanup2).toBeUndefined();
  });
});

describe('THEME_SHARED_STYLES', () => {
  it('should contain validation styling', () => {
    expect(THEME_SHARED_STYLES).toContain('.is-invalid');
    expect(THEME_SHARED_STYLES).toContain('.invalid-feedback');
  });

  it('should contain animation keyframes', () => {
    expect(THEME_SHARED_STYLES).toContain('@keyframes fadeInTop');
    expect(THEME_SHARED_STYLES).toContain('@keyframes fadeOutTop');
  });

  it('should contain pointer utility class', () => {
    expect(THEME_SHARED_STYLES).toContain('.pointer');
    expect(THEME_SHARED_STYLES).toContain('cursor: pointer');
  });

  it('should use Chakra UI CSS variables', () => {
    expect(THEME_SHARED_STYLES).toContain('var(--chakra-colors-red-500)');
    expect(THEME_SHARED_STYLES).toContain('var(--chakra-space-1)');
  });
});
