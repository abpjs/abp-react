/**
 * Tests for constants
 * @abpjs/language-management v0.7.2
 */
import { describe, it, expect } from 'vitest';
import { LANGUAGE_MANAGEMENT_ROUTES } from '../constants/routes';

describe('LANGUAGE_MANAGEMENT_ROUTES', () => {
  it('should export routes object with routes array', () => {
    expect(LANGUAGE_MANAGEMENT_ROUTES).toBeDefined();
    expect(LANGUAGE_MANAGEMENT_ROUTES.routes).toBeInstanceOf(Array);
  });

  it('should have a language management route', () => {
    const langRoute = LANGUAGE_MANAGEMENT_ROUTES.routes.find((r) => r.name === 'Languages');
    expect(langRoute).toBeDefined();
  });

  it('should have correct route configuration', () => {
    const langRoute = LANGUAGE_MANAGEMENT_ROUTES.routes[0];
    expect(langRoute.name).toBe('Languages');
    expect(langRoute.path).toBe('language-management');
    expect(langRoute.layout).toBe('application');
    expect(langRoute.order).toBe(101);
  });

  it('should have child routes for languages and texts', () => {
    const langRoute = LANGUAGE_MANAGEMENT_ROUTES.routes[0];
    expect(langRoute.children).toBeDefined();
    expect(langRoute.children?.length).toBe(2);

    const languagesChild = langRoute.children?.find((c) => c.name === 'Languages');
    expect(languagesChild).toBeDefined();
    expect(languagesChild?.path).toBe('languages');

    const textsChild = langRoute.children?.find((c) => c.name === 'Language Texts');
    expect(textsChild).toBeDefined();
    expect(textsChild?.path).toBe('texts');
  });
});
