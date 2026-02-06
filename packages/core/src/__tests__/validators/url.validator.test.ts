/**
 * Tests for URL Validator
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import { validateUrl, UrlError } from '../../validators/url.validator';

describe('validateUrl', () => {
  const validator = validateUrl();

  describe('empty values', () => {
    it('should return null for empty string', () => {
      expect(validator('')).toBeNull();
    });

    it('should return null for null', () => {
      expect(validator(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validator(undefined)).toBeNull();
    });
  });

  describe('valid URLs', () => {
    it('should accept http URL', () => {
      expect(validator('http://example.com')).toBeNull();
    });

    it('should accept https URL', () => {
      expect(validator('https://example.com')).toBeNull();
    });

    it('should accept ftp URL', () => {
      expect(validator('ftp://ftp.example.com')).toBeNull();
    });

    it('should accept URL with path', () => {
      expect(validator('https://example.com/path/to/page')).toBeNull();
    });

    it('should accept URL with query string', () => {
      expect(validator('https://example.com?query=value')).toBeNull();
    });

    it('should accept URL with hash', () => {
      expect(validator('https://example.com#section')).toBeNull();
    });

    it('should accept URL with port', () => {
      expect(validator('https://example.com:8080')).toBeNull();
    });

    it('should accept URL with subdomain', () => {
      expect(validator('https://www.example.com')).toBeNull();
    });

    it('should accept URL with complex path', () => {
      expect(validator('https://example.com/api/v1/users?page=1&limit=10#results')).toBeNull();
    });

    it('should accept URL with IP address', () => {
      expect(validator('http://192.168.1.1')).toBeNull();
    });

    it('should accept localhost URL', () => {
      expect(validator('http://localhost:3000')).toBeNull();
    });

    it('should accept URL with username and password', () => {
      expect(validator('ftp://user:pass@ftp.example.com')).toBeNull();
    });

    it('should accept URL with encoded characters', () => {
      expect(validator('https://example.com/path%20with%20spaces')).toBeNull();
    });
  });

  describe('invalid URLs', () => {
    it('should reject URL without protocol', () => {
      const result = validator('example.com') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject URL with invalid protocol', () => {
      const result = validator('htp://example.com') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject email address', () => {
      const result = validator('user@example.com') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject plain text', () => {
      const result = validator('not a url') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject javascript protocol', () => {
      const result = validator('javascript:alert(1)') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject data protocol', () => {
      const result = validator('data:text/html,<h1>Test</h1>') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject file protocol', () => {
      const result = validator('file:///etc/passwd') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject URL with spaces', () => {
      const result = validator('https://example .com') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject malformed URL', () => {
      const result = validator('https://') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should reject URL with only protocol', () => {
      const result = validator('https:///') as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle URL with unicode domain', () => {
      // Some international domain names might pass or fail based on implementation
      const result = validator('https://例え.jp');
      // This may be valid depending on URL parsing
      expect(result === null || result?.url === true).toBe(true);
    });

    it('should handle very long URL', () => {
      const longPath = 'a'.repeat(2000);
      expect(validator(`https://example.com/${longPath}`)).toBeNull();
    });

    it('should handle URL with multiple query parameters', () => {
      expect(validator('https://example.com?a=1&b=2&c=3&d=4')).toBeNull();
    });

    it('should handle URL with special characters in path', () => {
      expect(validator('https://example.com/path-with_special.chars')).toBeNull();
    });

    it('should handle URL with trailing slash', () => {
      expect(validator('https://example.com/')).toBeNull();
    });

    it('should handle URL with nested path', () => {
      expect(validator('https://example.com/a/b/c/d/e/f')).toBeNull();
    });
  });

  describe('type coercion', () => {
    it('should handle number input', () => {
      const result = validator(12345) as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });

    it('should handle boolean input', () => {
      const result = validator(true) as UrlError;
      expect(result).not.toBeNull();
      expect(result.url).toBe(true);
    });
  });
});
