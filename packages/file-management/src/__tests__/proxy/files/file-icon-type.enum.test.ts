/**
 * Tests for FileIconType enum
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { FileIconType, fileIconTypeOptions } from '../../../proxy/files/file-icon-type.enum';

describe('FileIconType', () => {
  describe('enum values', () => {
    it('should have FontAwesome = 0', () => {
      expect(FileIconType.FontAwesome).toBe(0);
    });

    it('should have Url = 1', () => {
      expect(FileIconType.Url).toBe(1);
    });
  });

  describe('enum reverse mapping', () => {
    it('should map 0 to FontAwesome', () => {
      expect(FileIconType[0]).toBe('FontAwesome');
    });

    it('should map 1 to Url', () => {
      expect(FileIconType[1]).toBe('Url');
    });
  });

  describe('type safety', () => {
    it('should be usable in type assertions', () => {
      const iconType: FileIconType = FileIconType.FontAwesome;
      expect(iconType).toBe(0);
    });

    it('should work with switch statements', () => {
      const getIconPrefix = (type: FileIconType): string => {
        switch (type) {
          case FileIconType.FontAwesome:
            return 'fa-';
          case FileIconType.Url:
            return 'url:';
          default:
            return '';
        }
      };

      expect(getIconPrefix(FileIconType.FontAwesome)).toBe('fa-');
      expect(getIconPrefix(FileIconType.Url)).toBe('url:');
    });
  });
});

describe('fileIconTypeOptions', () => {
  it('should have exactly 2 options', () => {
    expect(fileIconTypeOptions).toHaveLength(2);
  });

  it('should have FontAwesome as first option', () => {
    expect(fileIconTypeOptions[0]).toEqual({
      label: 'FontAwesome',
      value: FileIconType.FontAwesome,
    });
  });

  it('should have Url as second option', () => {
    expect(fileIconTypeOptions[1]).toEqual({
      label: 'Url',
      value: FileIconType.Url,
    });
  });

  it('should have correct label-value pairs', () => {
    fileIconTypeOptions.forEach((option) => {
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('value');
      expect(typeof option.label).toBe('string');
      expect(typeof option.value).toBe('number');
    });
  });

  it('should be usable in select components', () => {
    const selectOptions = fileIconTypeOptions.map((opt) => ({
      key: opt.value,
      text: opt.label,
    }));

    expect(selectOptions).toHaveLength(2);
    expect(selectOptions[0].key).toBe(0);
    expect(selectOptions[0].text).toBe('FontAwesome');
  });

  it('should be a readonly array', () => {
    // TypeScript enforces this at compile time with 'as const'
    // At runtime we just verify it's an array
    expect(Array.isArray(fileIconTypeOptions)).toBe(true);
  });
});
