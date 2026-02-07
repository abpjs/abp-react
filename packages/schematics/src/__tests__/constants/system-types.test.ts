/**
 * System Types Constants Tests
 */

import { describe, expect, it } from 'vitest';
import { SYSTEM_TYPES } from '../../constants/system-types';

describe('SYSTEM_TYPES', () => {
  it('should be a Map', () => {
    expect(SYSTEM_TYPES).toBeInstanceOf(Map);
  });

  it('should map Bool to boolean', () => {
    expect(SYSTEM_TYPES.get('Bool')).toBe('boolean');
  });

  it('should map Byte to number', () => {
    expect(SYSTEM_TYPES.get('Byte')).toBe('number');
  });

  it('should map Char to string', () => {
    expect(SYSTEM_TYPES.get('Char')).toBe('string');
  });

  it('should map DateTime to string', () => {
    expect(SYSTEM_TYPES.get('DateTime')).toBe('string');
  });

  it('should map DateTimeOffset to string', () => {
    expect(SYSTEM_TYPES.get('DateTimeOffset')).toBe('string');
  });

  it('should map Decimal to number', () => {
    expect(SYSTEM_TYPES.get('Decimal')).toBe('number');
  });

  it('should map Double to number', () => {
    expect(SYSTEM_TYPES.get('Double')).toBe('number');
  });

  it('should map Guid to string', () => {
    expect(SYSTEM_TYPES.get('Guid')).toBe('string');
  });

  it('should map Int16 to number', () => {
    expect(SYSTEM_TYPES.get('Int16')).toBe('number');
  });

  it('should map Int32 to number', () => {
    expect(SYSTEM_TYPES.get('Int32')).toBe('number');
  });

  it('should map Int64 to number', () => {
    expect(SYSTEM_TYPES.get('Int64')).toBe('number');
  });

  it('should map Net.HttpStatusCode to number', () => {
    expect(SYSTEM_TYPES.get('Net.HttpStatusCode')).toBe('number');
  });

  it('should map Object to object', () => {
    expect(SYSTEM_TYPES.get('Object')).toBe('object');
  });

  it('should map Sbyte to number', () => {
    expect(SYSTEM_TYPES.get('Sbyte')).toBe('number');
  });

  it('should map Single to number', () => {
    expect(SYSTEM_TYPES.get('Single')).toBe('number');
  });

  it('should map String to string', () => {
    expect(SYSTEM_TYPES.get('String')).toBe('string');
  });

  it('should map TimeSpan to string', () => {
    expect(SYSTEM_TYPES.get('TimeSpan')).toBe('string');
  });

  it('should map UInt16 to number', () => {
    expect(SYSTEM_TYPES.get('UInt16')).toBe('number');
  });

  it('should map UInt32 to number', () => {
    expect(SYSTEM_TYPES.get('UInt32')).toBe('number');
  });

  it('should map UInt64 to number', () => {
    expect(SYSTEM_TYPES.get('UInt64')).toBe('number');
  });

  it('should map Void to void', () => {
    expect(SYSTEM_TYPES.get('Void')).toBe('void');
  });

  it('should have 21 entries', () => {
    expect(SYSTEM_TYPES.size).toBe(21);
  });
});
