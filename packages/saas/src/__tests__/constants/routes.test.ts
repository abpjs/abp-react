import { describe, it, expect } from 'vitest';
import { SAAS_ROUTES } from '../../constants/routes';

describe('SAAS_ROUTES', () => {
  it('should be defined', () => {
    expect(SAAS_ROUTES).toBeDefined();
    expect(SAAS_ROUTES.routes).toBeDefined();
    expect(Array.isArray(SAAS_ROUTES.routes)).toBe(true);
  });

  it('should have a root Saas route', () => {
    const saasRoute = SAAS_ROUTES.routes.find((r) => r.name === 'Saas');
    expect(saasRoute).toBeDefined();
    expect(saasRoute?.path).toBe('saas');
    expect(saasRoute?.layout).toBe('application');
  });

  it('should have Tenants child route', () => {
    const saasRoute = SAAS_ROUTES.routes.find((r) => r.name === 'Saas');
    expect(saasRoute?.children).toBeDefined();

    const tenantsRoute = saasRoute?.children?.find((r) => r.name === 'Tenants');
    expect(tenantsRoute).toBeDefined();
    expect(tenantsRoute?.path).toBe('tenants');
    expect(tenantsRoute?.requiredPolicy).toBe('Saas.Tenants');
  });

  it('should have Editions child route', () => {
    const saasRoute = SAAS_ROUTES.routes.find((r) => r.name === 'Saas');
    expect(saasRoute?.children).toBeDefined();

    const editionsRoute = saasRoute?.children?.find((r) => r.name === 'Editions');
    expect(editionsRoute).toBeDefined();
    expect(editionsRoute?.path).toBe('editions');
    expect(editionsRoute?.requiredPolicy).toBe('Saas.Editions');
  });

  it('should have correct ordering', () => {
    const saasRoute = SAAS_ROUTES.routes.find((r) => r.name === 'Saas');
    expect(saasRoute?.order).toBeDefined();
    expect(typeof saasRoute?.order).toBe('number');
  });

  it('should have two child routes', () => {
    const saasRoute = SAAS_ROUTES.routes.find((r) => r.name === 'Saas');
    expect(saasRoute?.children?.length).toBe(2);
  });
});
