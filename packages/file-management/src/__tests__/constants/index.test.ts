/**
 * Tests for constants
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { FILE_MANAGEMENT_ROUTE_PATH, FILE_MANAGEMENT_API_BASE } from '../../constants';

describe('constants', () => {
  describe('FILE_MANAGEMENT_ROUTE_PATH', () => {
    it('should be /file-management', () => {
      expect(FILE_MANAGEMENT_ROUTE_PATH).toBe('/file-management');
    });

    it('should start with forward slash', () => {
      expect(FILE_MANAGEMENT_ROUTE_PATH.startsWith('/')).toBe(true);
    });

    it('should not have trailing slash', () => {
      expect(FILE_MANAGEMENT_ROUTE_PATH.endsWith('/')).toBe(false);
    });

    it('should be a valid route path', () => {
      expect(FILE_MANAGEMENT_ROUTE_PATH).toMatch(/^\/[a-z-]+$/);
    });
  });

  describe('FILE_MANAGEMENT_API_BASE', () => {
    it('should be /api/file-management', () => {
      expect(FILE_MANAGEMENT_API_BASE).toBe('/api/file-management');
    });

    it('should start with /api/', () => {
      expect(FILE_MANAGEMENT_API_BASE.startsWith('/api/')).toBe(true);
    });

    it('should not have trailing slash', () => {
      expect(FILE_MANAGEMENT_API_BASE.endsWith('/')).toBe(false);
    });

    it('should be a valid API base path', () => {
      expect(FILE_MANAGEMENT_API_BASE).toMatch(/^\/api\/[a-z-]+$/);
    });
  });

  describe('path construction', () => {
    it('should build directory descriptor endpoint', () => {
      const endpoint = `${FILE_MANAGEMENT_API_BASE}/directory-descriptor`;
      expect(endpoint).toBe('/api/file-management/directory-descriptor');
    });

    it('should build file descriptor endpoint', () => {
      const endpoint = `${FILE_MANAGEMENT_API_BASE}/file-descriptor`;
      expect(endpoint).toBe('/api/file-management/file-descriptor');
    });

    it('should build endpoint with ID', () => {
      const id = 'abc-123';
      const endpoint = `${FILE_MANAGEMENT_API_BASE}/file-descriptor/${id}`;
      expect(endpoint).toBe('/api/file-management/file-descriptor/abc-123');
    });
  });
});
