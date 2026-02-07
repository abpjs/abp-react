/**
 * Tests for @abpjs/file-management package exports
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as fileManagementExports from '../index';

describe('@abpjs/file-management exports', () => {
  describe('Enums (v3.2.0)', () => {
    it('should export eFileManagementComponents', () => {
      expect(fileManagementExports.eFileManagementComponents).toBeDefined();
      expect(fileManagementExports.eFileManagementComponents.FolderContent).toBe(
        'FileManagement.FolderContentComponent'
      );
    });
  });

  describe('Config Enums (v3.2.0)', () => {
    it('should export eFileManagementPolicyNames', () => {
      expect(fileManagementExports.eFileManagementPolicyNames).toBeDefined();
      expect(fileManagementExports.eFileManagementPolicyNames.DirectoryDescriptor).toBe(
        'FileManagement.DirectoryDescriptor'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.DirectoryDescriptorCreate).toBe(
        'FileManagement.DirectoryDescriptor.Create'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.DirectoryDescriptorDelete).toBe(
        'FileManagement.DirectoryDescriptor.Delete'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.DirectoryDescriptorUpdate).toBe(
        'FileManagement.DirectoryDescriptor.Update'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.FileDescriptor).toBe(
        'FileManagement.FileDescriptor'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.FileDescriptorCreate).toBe(
        'FileManagement.FileDescriptor.Create'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.FileDescriptorDelete).toBe(
        'FileManagement.FileDescriptor.Delete'
      );
      expect(fileManagementExports.eFileManagementPolicyNames.FileDescriptorUpdate).toBe(
        'FileManagement.FileDescriptor.Update'
      );
    });

    it('should export eFileManagementRouteNames', () => {
      expect(fileManagementExports.eFileManagementRouteNames).toBeDefined();
      expect(fileManagementExports.eFileManagementRouteNames.FileManagement).toBe(
        'FileManagement::Menu:FileManagement'
      );
    });
  });

  describe('Config Providers (v3.2.0)', () => {
    it('should export FILE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(fileManagementExports.FILE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
      expect(fileManagementExports.FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
    });

    it('should export configureRoutes', () => {
      expect(fileManagementExports.configureRoutes).toBeDefined();
      expect(typeof fileManagementExports.configureRoutes).toBe('function');
    });

    it('should export initializeFileManagementRoutes', () => {
      expect(fileManagementExports.initializeFileManagementRoutes).toBeDefined();
      expect(typeof fileManagementExports.initializeFileManagementRoutes).toBe('function');
    });
  });

  describe('Proxy - Files (v3.2.0)', () => {
    it('should export FileIconType enum', () => {
      expect(fileManagementExports.FileIconType).toBeDefined();
      expect(fileManagementExports.FileIconType.FontAwesome).toBe(0);
      expect(fileManagementExports.FileIconType.Url).toBe(1);
    });

    it('should export fileIconTypeOptions', () => {
      expect(fileManagementExports.fileIconTypeOptions).toBeDefined();
      expect(fileManagementExports.fileIconTypeOptions).toHaveLength(2);
      expect(fileManagementExports.fileIconTypeOptions[0].label).toBe('FontAwesome');
      expect(fileManagementExports.fileIconTypeOptions[1].label).toBe('Url');
    });

    it('should export FileDescriptorService', () => {
      expect(fileManagementExports.FileDescriptorService).toBeDefined();
    });
  });

  describe('Proxy - Directories (v3.2.0)', () => {
    it('should export DirectoryDescriptorService', () => {
      expect(fileManagementExports.DirectoryDescriptorService).toBeDefined();
    });
  });

  describe('Constants (v3.2.0)', () => {
    it('should export FILE_MANAGEMENT_ROUTE_PATH', () => {
      expect(fileManagementExports.FILE_MANAGEMENT_ROUTE_PATH).toBe('/file-management');
    });

    it('should export FILE_MANAGEMENT_API_BASE', () => {
      expect(fileManagementExports.FILE_MANAGEMENT_API_BASE).toBe('/api/file-management');
    });
  });
});
