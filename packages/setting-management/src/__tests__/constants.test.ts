/**
 * Tests for constants
 * @abpjs/setting-management v0.9.0
 */
import { describe, it, expect } from 'vitest';
import { SETTING_MANAGEMENT_ROUTES } from '../constants/routes';

describe('SETTING_MANAGEMENT_ROUTES', () => {
  it('should export routes object with routes array', () => {
    expect(SETTING_MANAGEMENT_ROUTES).toBeDefined();
    expect(SETTING_MANAGEMENT_ROUTES.routes).toBeInstanceOf(Array);
  });

  it('should have a settings route', () => {
    const settingsRoute = SETTING_MANAGEMENT_ROUTES.routes.find(r => r.name === 'Settings');
    expect(settingsRoute).toBeDefined();
  });

  it('should have correct route configuration', () => {
    const settingsRoute = SETTING_MANAGEMENT_ROUTES.routes[0];
    expect(settingsRoute.name).toBe('Settings');
    expect(settingsRoute.path).toBe('/setting-management');
    expect(settingsRoute.layout).toBe('application');
    expect(settingsRoute.order).toBe(100);
  });
});
