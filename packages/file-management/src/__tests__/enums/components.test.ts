/**
 * Tests for eFileManagementComponents enum
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { eFileManagementComponents } from '../../enums/components';

describe('eFileManagementComponents', () => {
  describe('enum values', () => {
    it('should have FolderContent component key', () => {
      expect(eFileManagementComponents.FolderContent).toBe('FileManagement.FolderContentComponent');
    });

    it('should be a const object', () => {
      expect(typeof eFileManagementComponents).toBe('object');
    });
  });

  describe('component key format', () => {
    it('should follow the ModuleName.ComponentName pattern', () => {
      const folderContent = eFileManagementComponents.FolderContent;
      expect(folderContent).toMatch(/^FileManagement\.\w+Component$/);
    });

    it('should start with FileManagement prefix', () => {
      expect(eFileManagementComponents.FolderContent.startsWith('FileManagement.')).toBe(true);
    });

    it('should end with Component suffix', () => {
      expect(eFileManagementComponents.FolderContent.endsWith('Component')).toBe(true);
    });
  });

  describe('usage in object keys', () => {
    it('should be usable as object key', () => {
      const componentMap: Record<string, string> = {
        [eFileManagementComponents.FolderContent]: 'FolderContentComponent',
      };
      expect(componentMap[eFileManagementComponents.FolderContent]).toBe('FolderContentComponent');
    });

    it('should work with Partial type', () => {
      const partial: Partial<Record<typeof eFileManagementComponents.FolderContent, unknown>> = {};
      partial[eFileManagementComponents.FolderContent] = { test: true };
      expect(partial[eFileManagementComponents.FolderContent]).toEqual({ test: true });
    });
  });
});
