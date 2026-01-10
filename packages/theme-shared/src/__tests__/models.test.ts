import { describe, it, expect } from 'vitest';
import { Toaster } from '../models/toaster';
import { Confirmation } from '../models/confirmation';

describe('Toaster namespace', () => {
  describe('Status enum', () => {
    it('should have confirm status', () => {
      expect(Toaster.Status.confirm).toBe('confirm');
    });

    it('should have reject status', () => {
      expect(Toaster.Status.reject).toBe('reject');
    });

    it('should have dismiss status', () => {
      expect(Toaster.Status.dismiss).toBe('dismiss');
    });
  });

  describe('Types', () => {
    it('should allow valid severity types', () => {
      const severities: Toaster.Severity[] = ['success', 'info', 'warn', 'error'];
      expect(severities).toHaveLength(4);
    });

    it('should accept valid Options', () => {
      const options: Toaster.Options = {
        id: 'test-id',
        closable: true,
        life: 5000,
        sticky: false,
        data: { custom: 'data' },
        messageLocalizationParams: ['param1'],
        titleLocalizationParams: ['param2'],
      };

      expect(options.id).toBe('test-id');
      expect(options.closable).toBe(true);
      expect(options.life).toBe(5000);
      expect(options.sticky).toBe(false);
      expect(options.data).toEqual({ custom: 'data' });
    });

    it('should accept minimal Options', () => {
      const options: Toaster.Options = {};
      expect(options).toEqual({});
    });

    it('should accept valid Message', () => {
      const message: Toaster.Message = {
        message: 'Test message',
        title: 'Test title',
        severity: 'success',
        id: 'msg-1',
        closable: true,
      };

      expect(message.message).toBe('Test message');
      expect(message.severity).toBe('success');
    });

    it('should accept Message without optional fields', () => {
      const message: Toaster.Message = {
        message: 'Test message',
        severity: 'info',
      };

      expect(message.message).toBe('Test message');
      expect(message.title).toBeUndefined();
    });
  });
});

describe('Confirmation namespace', () => {
  describe('Options', () => {
    it('should extend Toaster.Options', () => {
      const options: Confirmation.Options = {
        // Toaster.Options properties
        id: 'confirm-1',
        closable: true,
        life: 10000,
        sticky: true,
        data: {},
        messageLocalizationParams: [],
        titleLocalizationParams: [],
        // Confirmation-specific properties
        hideCancelBtn: false,
        hideYesBtn: false,
        cancelCopy: 'No, keep it',
        yesCopy: 'Yes, delete',
      };

      expect(options.hideCancelBtn).toBe(false);
      expect(options.hideYesBtn).toBe(false);
      expect(options.cancelCopy).toBe('No, keep it');
      expect(options.yesCopy).toBe('Yes, delete');
    });

    it('should accept minimal Confirmation.Options', () => {
      const options: Confirmation.Options = {};
      expect(options).toEqual({});
    });

    it('should accept only confirmation-specific options', () => {
      const options: Confirmation.Options = {
        hideCancelBtn: true,
        yesCopy: 'Delete',
      };

      expect(options.hideCancelBtn).toBe(true);
      expect(options.yesCopy).toBe('Delete');
      expect(options.cancelCopy).toBeUndefined();
    });
  });
});
