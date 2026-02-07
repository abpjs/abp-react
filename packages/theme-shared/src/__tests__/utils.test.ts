import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { injectThemeSharedStyles, THEME_SHARED_STYLES } from '../utils/styles';
import { DEFAULT_STYLES, BOOTSTRAP } from '../constants/styles';

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

describe('DEFAULT_STYLES (constants/styles.ts)', () => {
  it('should be defined', () => {
    expect(DEFAULT_STYLES).toBeDefined();
  });

  it('should be a string', () => {
    expect(typeof DEFAULT_STYLES).toBe('string');
  });

  it('should contain validation styling', () => {
    expect(DEFAULT_STYLES).toContain('.is-invalid');
    expect(DEFAULT_STYLES).toContain('.invalid-feedback');
  });

  it('should contain animation keyframes', () => {
    expect(DEFAULT_STYLES).toContain('@keyframes fadeInTop');
    expect(DEFAULT_STYLES).toContain('@keyframes fadeOutTop');
  });

  it('should contain pointer utility class', () => {
    expect(DEFAULT_STYLES).toContain('.pointer');
    expect(DEFAULT_STYLES).toContain('cursor: pointer');
  });

  it('should contain data-tables-filter styling', () => {
    expect(DEFAULT_STYLES).toContain('.data-tables-filter');
    expect(DEFAULT_STYLES).toContain('text-align: right');
  });

  // v2.9.0 - RTL support
  describe('RTL support (v2.9.0)', () => {
    it('should contain RTL directive selector', () => {
      expect(DEFAULT_STYLES).toContain('[dir=rtl]');
    });

    it('should have RTL-specific data-tables-filter styling', () => {
      expect(DEFAULT_STYLES).toContain('[dir=rtl] .data-tables-filter');
      expect(DEFAULT_STYLES).toContain('text-align: left');
    });

    it('should have both LTR and RTL text alignments for data-tables-filter', () => {
      // LTR default: text-align: right
      expect(DEFAULT_STYLES).toMatch(/\.data-tables-filter\s*\{[^}]*text-align:\s*right/);
      // RTL override: text-align: left
      expect(DEFAULT_STYLES).toMatch(/\[dir=rtl\]\s*\.data-tables-filter\s*\{[^}]*text-align:\s*left/);
    });
  });

  it('should contain sorting icon styles', () => {
    expect(DEFAULT_STYLES).toContain('[class^="sorting"]');
    expect(DEFAULT_STYLES).toContain('.sorting_desc');
    expect(DEFAULT_STYLES).toContain('.sorting_asc');
  });

  it('should contain collapse height transitions', () => {
    expect(DEFAULT_STYLES).toContain('.abp-collapsed-height');
    expect(DEFAULT_STYLES).toContain('.abp-mh-25');
    expect(DEFAULT_STYLES).toContain('.abp-mh-50');
    expect(DEFAULT_STYLES).toContain('.abp-mh-75');
    expect(DEFAULT_STYLES).toContain('.abp-mh-100');
  });

  it('should contain loader bar styles', () => {
    expect(DEFAULT_STYLES).toContain('.abp-loader-bar');
    expect(DEFAULT_STYLES).toContain('.abp-progress');
  });

  it('should contain ellipsis utility classes', () => {
    expect(DEFAULT_STYLES).toContain('.abp-ellipsis-inline');
    expect(DEFAULT_STYLES).toContain('.abp-ellipsis');
    expect(DEFAULT_STYLES).toContain('text-overflow: ellipsis');
  });

  // v3.2.0 - datatable-scroll styles
  describe('datatable-scroll styles (v3.2.0)', () => {
    it('should contain datatable-scroll class', () => {
      expect(DEFAULT_STYLES).toContain('.datatable-scroll');
    });

    it('should have margin-bottom style for datatable-scroll', () => {
      expect(DEFAULT_STYLES).toContain('margin-bottom: 5px !important');
    });

    it('should have width unset style for datatable-scroll', () => {
      expect(DEFAULT_STYLES).toContain('width: unset !important');
    });

    it('should have complete datatable-scroll rule', () => {
      // Verify the full rule is present
      expect(DEFAULT_STYLES).toMatch(/\.datatable-scroll\s*\{[^}]*margin-bottom:\s*5px\s*!important/);
      expect(DEFAULT_STYLES).toMatch(/\.datatable-scroll\s*\{[^}]*width:\s*unset\s*!important/);
    });

    it('should place datatable-scroll before ui-table-scrollable-body', () => {
      // Verify ordering: datatable-scroll should come before ui-table-scrollable-body
      const datatableScrollIndex = DEFAULT_STYLES.indexOf('.datatable-scroll');
      const uiTableIndex = DEFAULT_STYLES.indexOf('.ui-table-scrollable-body');

      expect(datatableScrollIndex).toBeGreaterThan(-1);
      expect(uiTableIndex).toBeGreaterThan(-1);
      expect(datatableScrollIndex).toBeLessThan(uiTableIndex);
    });
  });
});

describe('BOOTSTRAP constant (v2.9.0)', () => {
  it('should be defined', () => {
    expect(BOOTSTRAP).toBeDefined();
  });

  it('should be a string', () => {
    expect(typeof BOOTSTRAP).toBe('string');
  });

  it('should contain {{dir}} placeholder', () => {
    expect(BOOTSTRAP).toContain('{{dir}}');
  });

  it('should be a CSS filename pattern', () => {
    expect(BOOTSTRAP).toMatch(/\.css$/);
  });

  it('should contain bootstrap in the name', () => {
    expect(BOOTSTRAP.toLowerCase()).toContain('bootstrap');
  });

  it('should have correct format', () => {
    expect(BOOTSTRAP).toBe('bootstrap-{{dir}}.min.css');
  });

  it('should be usable for string replacement', () => {
    const ltr = BOOTSTRAP.replace('{{dir}}', 'ltr');
    const rtl = BOOTSTRAP.replace('{{dir}}', 'rtl');

    expect(ltr).toBe('bootstrap-ltr.min.css');
    expect(rtl).toBe('bootstrap-rtl.min.css');
  });
});
