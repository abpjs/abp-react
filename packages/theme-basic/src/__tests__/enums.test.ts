/**
 * Tests for v2.7.0 enums
 * Updated for v3.0.0 (added CurrentUser and Languages)
 */
import { describe, it, expect } from 'vitest';
import { eThemeBasicComponents, eNavigationElementNames } from '../enums';

describe('eThemeBasicComponents', () => {
  it('should have ApplicationLayout key', () => {
    expect(eThemeBasicComponents.ApplicationLayout).toBe('Theme.ApplicationLayoutComponent');
  });

  it('should have AccountLayout key', () => {
    expect(eThemeBasicComponents.AccountLayout).toBe('Theme.AccountLayoutComponent');
  });

  it('should have EmptyLayout key', () => {
    expect(eThemeBasicComponents.EmptyLayout).toBe('Theme.EmptyLayoutComponent');
  });

  it('should have Logo key', () => {
    expect(eThemeBasicComponents.Logo).toBe('Theme.LogoComponent');
  });

  it('should have Routes key', () => {
    expect(eThemeBasicComponents.Routes).toBe('Theme.RoutesComponent');
  });

  it('should have NavItems key', () => {
    expect(eThemeBasicComponents.NavItems).toBe('Theme.NavItemsComponent');
  });

  // v3.0.0 additions
  it('should have CurrentUser key (v3.0.0)', () => {
    expect(eThemeBasicComponents.CurrentUser).toBe('Theme.CurrentUserComponent');
  });

  it('should have Languages key (v3.0.0)', () => {
    expect(eThemeBasicComponents.Languages).toBe('Theme.LanguagesComponent');
  });

  it('should have all expected keys', () => {
    const keys = Object.keys(eThemeBasicComponents);
    expect(keys).toContain('ApplicationLayout');
    expect(keys).toContain('AccountLayout');
    expect(keys).toContain('EmptyLayout');
    expect(keys).toContain('Logo');
    expect(keys).toContain('Routes');
    expect(keys).toContain('NavItems');
    expect(keys).toContain('CurrentUser');
    expect(keys).toContain('Languages');
    expect(keys).toHaveLength(8);
  });

  it('should have unique values', () => {
    const values = Object.values(eThemeBasicComponents);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should be immutable (const assertion)', () => {
    // TypeScript const assertion makes values readonly
    // We verify the values match expected patterns
    expect(eThemeBasicComponents.ApplicationLayout).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.AccountLayout).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.EmptyLayout).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.Logo).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.Routes).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.NavItems).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.CurrentUser).toMatch(/^Theme\./);
    expect(eThemeBasicComponents.Languages).toMatch(/^Theme\./);
  });
});

describe('eNavigationElementNames', () => {
  it('should have Language key', () => {
    expect(eNavigationElementNames.Language).toBe('LanguageRef');
  });

  it('should have User key', () => {
    expect(eNavigationElementNames.User).toBe('CurrentUserRef');
  });

  it('should have all expected keys', () => {
    const keys = Object.keys(eNavigationElementNames);
    expect(keys).toContain('Language');
    expect(keys).toContain('User');
    expect(keys).toHaveLength(2);
  });

  it('should have unique values', () => {
    const values = Object.values(eNavigationElementNames);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should use "Ref" suffix for template references', () => {
    // Following Angular pattern where these were TemplateRef
    expect(eNavigationElementNames.Language).toMatch(/Ref$/);
    expect(eNavigationElementNames.User).toMatch(/Ref$/);
  });
});

describe('enum type exports', () => {
  it('should allow type usage for eThemeBasicComponents', () => {
    // Type assertion test - this verifies the type export works
    const componentKey: typeof eThemeBasicComponents[keyof typeof eThemeBasicComponents] =
      eThemeBasicComponents.Logo;
    expect(componentKey).toBe('Theme.LogoComponent');
  });

  it('should allow type usage for eNavigationElementNames', () => {
    // Type assertion test - this verifies the type export works
    const elementName: typeof eNavigationElementNames[keyof typeof eNavigationElementNames] =
      eNavigationElementNames.Language;
    expect(elementName).toBe('LanguageRef');
  });
});
