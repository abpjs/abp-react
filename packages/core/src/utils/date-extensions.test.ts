import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './date-extensions';

describe('Date.toLocalISOString', () => {
  // Store the original timezone offset function
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;

  afterEach(() => {
    // Restore original function after each test
    Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
  });

  it('should be defined on Date prototype', () => {
    expect(typeof Date.prototype.toLocalISOString).toBe('function');
  });

  it('should return a string in ISO format', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');
    const result = date.toLocalISOString();

    // Should match ISO format pattern
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/);
  });

  it('should include timezone offset in positive format', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    // Mock timezone offset to +02:00 (returns -120 for offset ahead of UTC)
    Date.prototype.getTimezoneOffset = () => -120;

    const result = date.toLocalISOString();
    expect(result).toContain('+02:00');
  });

  it('should include timezone offset in negative format', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    // Mock timezone offset to -05:00 (returns 300 for offset behind UTC)
    Date.prototype.getTimezoneOffset = () => 300;

    const result = date.toLocalISOString();
    expect(result).toContain('-05:00');
  });

  it('should handle UTC timezone (offset 0)', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    Date.prototype.getTimezoneOffset = () => 0;

    const result = date.toLocalISOString();
    expect(result).toContain('+00:00');
  });

  it('should pad single-digit values correctly', () => {
    // Create a date with single-digit month, day, hour, minute, second
    const date = new Date(2024, 0, 5, 3, 7, 9, 12); // Jan 5, 2024, 03:07:09.012

    Date.prototype.getTimezoneOffset = () => 0;

    const result = date.toLocalISOString();

    // Check padded values
    expect(result).toContain('2024-01-05');
    expect(result).toContain('T03:07:09');
    expect(result).toContain('.012');
  });

  it('should preserve milliseconds', () => {
    const date = new Date('2024-06-15T10:30:45.999Z');

    Date.prototype.getTimezoneOffset = () => 0;

    const result = date.toLocalISOString();
    expect(result).toContain('.999');
  });

  it('should handle dates at year boundaries', () => {
    const newYearEve = new Date(2024, 11, 31, 23, 59, 59, 999);

    Date.prototype.getTimezoneOffset = () => 0;

    const result = newYearEve.toLocalISOString();
    expect(result).toContain('2024-12-31T23:59:59.999');
  });

  it('should handle half-hour timezone offsets', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    // Mock timezone offset to +05:30 (India)
    Date.prototype.getTimezoneOffset = () => -330;

    const result = date.toLocalISOString();
    expect(result).toContain('+05:30');
  });

  it('should handle 45-minute timezone offsets', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    // Mock timezone offset to +05:45 (Nepal)
    Date.prototype.getTimezoneOffset = () => -345;

    const result = date.toLocalISOString();
    expect(result).toContain('+05:45');
  });

  it('should be different from toISOString for non-UTC timezones', () => {
    const date = new Date('2024-06-15T10:30:45.123Z');

    // Mock timezone offset to +02:00
    Date.prototype.getTimezoneOffset = () => -120;

    const localISO = date.toLocalISOString();
    const standardISO = date.toISOString();

    // They should be different because toISOString always returns UTC
    // while toLocalISOString returns local time with offset
    expect(localISO).not.toBe(standardISO);
    expect(standardISO).toContain('Z');
    expect(localISO).not.toContain('Z');
  });
});
