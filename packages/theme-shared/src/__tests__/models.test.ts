import { describe, it, expect } from 'vitest';
import { Toaster } from '../models/toaster';
import { Confirmation } from '../models/confirmation';
import type {
  RootParams,
  HttpErrorConfig,
  ErrorScreenErrorCodes,
} from '../models/common';

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

    // v1.1.0 - New cancelText/yesText properties
    it('should accept new cancelText and yesText properties (v1.1.0)', () => {
      const options: Confirmation.Options = {
        cancelText: 'No, cancel',
        yesText: 'Yes, proceed',
      };

      expect(options.cancelText).toBe('No, cancel');
      expect(options.yesText).toBe('Yes, proceed');
    });

    it('should accept LocalizationWithDefault for cancelText and yesText (v1.1.0)', () => {
      const options: Confirmation.Options = {
        cancelText: { key: 'Custom::Cancel', defaultValue: 'Cancel' },
        yesText: { key: 'Custom::Yes', defaultValue: 'Yes' },
      };

      expect(options.cancelText).toEqual({ key: 'Custom::Cancel', defaultValue: 'Cancel' });
      expect(options.yesText).toEqual({ key: 'Custom::Yes', defaultValue: 'Yes' });
    });

    it('should accept deprecated cancelCopy and yesCopy with LocalizationWithDefault (v1.1.0)', () => {
      const options: Confirmation.Options = {
        cancelCopy: { key: 'Legacy::Cancel', defaultValue: 'Back' },
        yesCopy: { key: 'Legacy::Yes', defaultValue: 'OK' },
      };

      expect(options.cancelCopy).toEqual({ key: 'Legacy::Cancel', defaultValue: 'Back' });
      expect(options.yesCopy).toEqual({ key: 'Legacy::Yes', defaultValue: 'OK' });
    });

    it('should support mixed new and deprecated properties', () => {
      const options: Confirmation.Options = {
        yesText: 'Confirm',
        cancelCopy: 'Go Back', // deprecated but still supported
      };

      expect(options.yesText).toBe('Confirm');
      expect(options.cancelCopy).toBe('Go Back');
    });
  });
});

describe('Common types (v1.1.0)', () => {
  describe('ErrorScreenErrorCodes', () => {
    it('should accept valid error codes', () => {
      const codes: ErrorScreenErrorCodes[] = [401, 403, 404, 500];
      expect(codes).toHaveLength(4);
      expect(codes).toContain(401);
      expect(codes).toContain(403);
      expect(codes).toContain(404);
      expect(codes).toContain(500);
    });
  });

  describe('HttpErrorConfig', () => {
    it('should accept empty config', () => {
      const config: HttpErrorConfig = {};
      expect(config).toEqual({});
    });

    it('should accept errorScreen with component only', () => {
      const MockComponent = () => null;
      const config: HttpErrorConfig = {
        errorScreen: {
          component: MockComponent,
        },
      };

      expect(config.errorScreen?.component).toBe(MockComponent);
    });

    it('should accept errorScreen with forWhichErrors (single error)', () => {
      const MockComponent = () => null;
      const config: HttpErrorConfig = {
        errorScreen: {
          component: MockComponent,
          forWhichErrors: [404],
        },
      };

      expect(config.errorScreen?.forWhichErrors).toEqual([404]);
    });

    it('should accept errorScreen with forWhichErrors (multiple errors)', () => {
      const MockComponent = () => null;
      const config: HttpErrorConfig = {
        errorScreen: {
          component: MockComponent,
          forWhichErrors: [401, 403, 404, 500],
        },
      };

      expect(config.errorScreen?.forWhichErrors).toHaveLength(4);
    });

    it('should accept errorScreen with hideCloseIcon', () => {
      const MockComponent = () => null;
      const config: HttpErrorConfig = {
        errorScreen: {
          component: MockComponent,
          hideCloseIcon: true,
        },
      };

      expect(config.errorScreen?.hideCloseIcon).toBe(true);
    });

    it('should accept full errorScreen configuration', () => {
      const MockComponent = () => null;
      const config: HttpErrorConfig = {
        errorScreen: {
          component: MockComponent,
          forWhichErrors: [403, 404],
          hideCloseIcon: false,
        },
      };

      expect(config.errorScreen?.component).toBe(MockComponent);
      expect(config.errorScreen?.forWhichErrors).toEqual([403, 404]);
      expect(config.errorScreen?.hideCloseIcon).toBe(false);
    });
  });

  describe('RootParams', () => {
    it('should accept empty params', () => {
      const params: RootParams = {};
      expect(params).toEqual({});
    });

    it('should accept httpErrorConfig', () => {
      const MockComponent = () => null;
      const params: RootParams = {
        httpErrorConfig: {
          errorScreen: {
            component: MockComponent,
            forWhichErrors: [500],
          },
        },
      };

      expect(params.httpErrorConfig?.errorScreen?.component).toBe(MockComponent);
    });
  });
});
