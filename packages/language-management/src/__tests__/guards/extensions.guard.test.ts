/**
 * Tests for Language Management Extensions Guard
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  languageManagementExtensionsGuard,
  useLanguageManagementExtensionsGuard,
  LanguageManagementExtensionsGuard,
} from '../../guards/extensions.guard';

describe('languageManagementExtensionsGuard', () => {
  it('should be a function', () => {
    expect(typeof languageManagementExtensionsGuard).toBe('function');
  });

  it('should return a Promise', () => {
    const result = languageManagementExtensionsGuard();
    expect(result).toBeInstanceOf(Promise);
  });

  it('should resolve to true', async () => {
    const result = await languageManagementExtensionsGuard();
    expect(result).toBe(true);
  });

  it('should be usable as a route guard', async () => {
    const canActivate = await languageManagementExtensionsGuard();
    expect(canActivate).toBeTruthy();
  });
});

describe('useLanguageManagementExtensionsGuard', () => {
  it('should be a function', () => {
    expect(typeof useLanguageManagementExtensionsGuard).toBe('function');
  });

  it('should return an object with isLoaded and loading properties', () => {
    const result = useLanguageManagementExtensionsGuard();
    expect(result).toHaveProperty('isLoaded');
    expect(result).toHaveProperty('loading');
  });

  it('should return isLoaded as true', () => {
    const { isLoaded } = useLanguageManagementExtensionsGuard();
    expect(isLoaded).toBe(true);
  });

  it('should return loading as false', () => {
    const { loading } = useLanguageManagementExtensionsGuard();
    expect(loading).toBe(false);
  });

  it('should return consistent values on multiple calls', () => {
    const result1 = useLanguageManagementExtensionsGuard();
    const result2 = useLanguageManagementExtensionsGuard();
    expect(result1.isLoaded).toBe(result2.isLoaded);
    expect(result1.loading).toBe(result2.loading);
  });
});

describe('LanguageManagementExtensionsGuard class', () => {
  it('should be a class/constructor', () => {
    expect(typeof LanguageManagementExtensionsGuard).toBe('function');
  });

  it('should be instantiable', () => {
    const guard = new LanguageManagementExtensionsGuard();
    expect(guard).toBeInstanceOf(LanguageManagementExtensionsGuard);
  });

  it('should have canActivate method', () => {
    const guard = new LanguageManagementExtensionsGuard();
    expect(typeof guard.canActivate).toBe('function');
  });

  it('canActivate should return a Promise', () => {
    const guard = new LanguageManagementExtensionsGuard();
    const result = guard.canActivate();
    expect(result).toBeInstanceOf(Promise);
  });

  it('canActivate should resolve to true', async () => {
    const guard = new LanguageManagementExtensionsGuard();
    const result = await guard.canActivate();
    expect(result).toBe(true);
  });

  it('canActivate should delegate to languageManagementExtensionsGuard', async () => {
    const guard = new LanguageManagementExtensionsGuard();
    const classResult = await guard.canActivate();
    const functionResult = await languageManagementExtensionsGuard();
    expect(classResult).toBe(functionResult);
  });
});

describe('guard integration patterns', () => {
  it('should work as React route loader pattern', async () => {
    // Simulating a React Router loader
    const loader = async () => {
      const canAccess = await languageManagementExtensionsGuard();
      if (!canAccess) {
        throw new Error('Access denied');
      }
      return { extensions: 'loaded' };
    };

    const result = await loader();
    expect(result).toEqual({ extensions: 'loaded' });
  });

  it('should work in conditional rendering pattern', () => {
    const { isLoaded, loading } = useLanguageManagementExtensionsGuard();

    // Simulate conditional rendering logic
    if (loading) {
      expect(true).toBe(false); // Should not reach here
    }

    if (isLoaded) {
      expect(true).toBe(true); // Should reach here
    }
  });
});
