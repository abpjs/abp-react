import { describe, it, expect } from 'vitest';
import { Toaster } from '../models/toaster';
import { Confirmation } from '../models/confirmation';
import type {
  RootParams,
  HttpErrorConfig,
  ErrorScreenErrorCodes,
} from '../models/common';

describe('Toaster namespace', () => {
  // v2.1.0 - Toaster.Status is deprecated, use Confirmation.Status instead
  // v2.4.0 - Deprecation notice updated: will be removed in v3.0 (was v2.2)
  describe('Status enum (deprecated in v2.1.0, removal in v3.0)', () => {
    it('should have confirm status', () => {
      expect(Toaster.Status.confirm).toBe('confirm');
    });

    it('should have reject status', () => {
      expect(Toaster.Status.reject).toBe('reject');
    });

    it('should have dismiss status', () => {
      expect(Toaster.Status.dismiss).toBe('dismiss');
    });

    it('should be equal to Confirmation.Status values (backward compatibility)', () => {
      // Toaster.Status and Confirmation.Status have the same values
      expect(Toaster.Status.confirm).toBe(Confirmation.Status.confirm);
      expect(Toaster.Status.reject).toBe(Confirmation.Status.reject);
      expect(Toaster.Status.dismiss).toBe(Confirmation.Status.dismiss);
    });
  });

  describe('Types', () => {
    // v2.0.0 - Changed 'warn' to 'warning', added 'neutral'
    it('should allow valid severity types', () => {
      const severities: Toaster.Severity[] = ['neutral', 'success', 'info', 'warning', 'error'];
      expect(severities).toHaveLength(5);
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
  // v2.1.0 - New Confirmation.Status enum
  describe('Status enum (v2.1.0)', () => {
    it('should have confirm status', () => {
      expect(Confirmation.Status.confirm).toBe('confirm');
    });

    it('should have reject status', () => {
      expect(Confirmation.Status.reject).toBe('reject');
    });

    it('should have dismiss status', () => {
      expect(Confirmation.Status.dismiss).toBe('dismiss');
    });

    it('should allow comparison with string values', () => {
      const status: Confirmation.Status = Confirmation.Status.confirm;
      expect(status === 'confirm').toBe(true);
    });

    it('should be usable in switch statements', () => {
      const getStatusLabel = (status: Confirmation.Status): string => {
        switch (status) {
          case Confirmation.Status.confirm:
            return 'Confirmed';
          case Confirmation.Status.reject:
            return 'Rejected';
          case Confirmation.Status.dismiss:
            return 'Dismissed';
          default:
            return 'Unknown';
        }
      };

      expect(getStatusLabel(Confirmation.Status.confirm)).toBe('Confirmed');
      expect(getStatusLabel(Confirmation.Status.reject)).toBe('Rejected');
      expect(getStatusLabel(Confirmation.Status.dismiss)).toBe('Dismissed');
    });
  });

  // v2.0.0 - Options no longer extends Toaster.Options
  describe('Options (v2.0.0)', () => {
    it('should accept minimal Confirmation.Options', () => {
      const options: Confirmation.Options = {};
      expect(options).toEqual({});
    });

    it('should accept confirmation-specific options', () => {
      const options: Confirmation.Options = {
        id: 'confirm-1',
        closable: true,
        hideCancelBtn: false,
        hideYesBtn: false,
        messageLocalizationParams: ['param1'],
        titleLocalizationParams: ['param2'],
      };

      expect(options.id).toBe('confirm-1');
      expect(options.closable).toBe(true);
      expect(options.hideCancelBtn).toBe(false);
      expect(options.hideYesBtn).toBe(false);
    });

    it('should accept cancelText and yesText properties', () => {
      const options: Confirmation.Options = {
        cancelText: 'No, cancel',
        yesText: 'Yes, proceed',
      };

      expect(options.cancelText).toBe('No, cancel');
      expect(options.yesText).toBe('Yes, proceed');
    });

    it('should accept LocalizationWithDefault for cancelText and yesText', () => {
      const options: Confirmation.Options = {
        cancelText: { key: 'Custom::Cancel', defaultValue: 'Cancel' },
        yesText: { key: 'Custom::Yes', defaultValue: 'Yes' },
      };

      expect(options.cancelText).toEqual({ key: 'Custom::Cancel', defaultValue: 'Cancel' });
      expect(options.yesText).toEqual({ key: 'Custom::Yes', defaultValue: 'Yes' });
    });

    it('should support hide button options', () => {
      const options: Confirmation.Options = {
        hideCancelBtn: true,
        hideYesBtn: true,
      };

      expect(options.hideCancelBtn).toBe(true);
      expect(options.hideYesBtn).toBe(true);
    });
  });

  // v2.0.0 - DialogData interface
  describe('DialogData (v2.0.0)', () => {
    it('should accept minimal dialog data', () => {
      const data: Confirmation.DialogData = {
        message: 'Test message',
      };

      expect(data.message).toBe('Test message');
      expect(data.title).toBeUndefined();
      expect(data.severity).toBeUndefined();
    });

    it('should accept full dialog data', () => {
      const data: Confirmation.DialogData = {
        message: 'Are you sure?',
        title: 'Confirm Action',
        severity: 'warning',
        options: {
          yesText: 'Yes',
          cancelText: 'No',
        },
      };

      expect(data.message).toBe('Are you sure?');
      expect(data.title).toBe('Confirm Action');
      expect(data.severity).toBe('warning');
      expect(data.options?.yesText).toBe('Yes');
    });

    it('should accept LocalizationWithDefault for message and title', () => {
      const data: Confirmation.DialogData = {
        message: { key: 'Test::Message', defaultValue: 'Default message' },
        title: { key: 'Test::Title', defaultValue: 'Default title' },
      };

      expect(data.message).toEqual({ key: 'Test::Message', defaultValue: 'Default message' });
      expect(data.title).toEqual({ key: 'Test::Title', defaultValue: 'Default title' });
    });
  });

  // v2.0.0 - Severity type
  describe('Severity (v2.0.0)', () => {
    it('should accept all valid severity values', () => {
      const severities: Confirmation.Severity[] = ['neutral', 'success', 'info', 'warning', 'error'];
      expect(severities).toHaveLength(5);
    });

    it('should allow severity in DialogData', () => {
      const data: Confirmation.DialogData = {
        message: 'Test',
        severity: 'error',
      };

      expect(data.severity).toBe('error');
    });
  });
});

describe('Common types (v1.1.0, v2.7.0)', () => {
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

    // v2.7.0 - skipHandledErrorCodes
    describe('skipHandledErrorCodes (v2.7.0)', () => {
      it('should accept skipHandledErrorCodes with ErrorScreenErrorCodes', () => {
        const config: HttpErrorConfig = {
          skipHandledErrorCodes: [401, 403, 404, 500],
        };

        expect(config.skipHandledErrorCodes).toEqual([401, 403, 404, 500]);
      });

      it('should accept skipHandledErrorCodes with any number', () => {
        const config: HttpErrorConfig = {
          skipHandledErrorCodes: [418, 429, 503],
        };

        expect(config.skipHandledErrorCodes).toEqual([418, 429, 503]);
      });

      it('should accept empty skipHandledErrorCodes', () => {
        const config: HttpErrorConfig = {
          skipHandledErrorCodes: [],
        };

        expect(config.skipHandledErrorCodes).toEqual([]);
      });

      it('should accept config with both skipHandledErrorCodes and errorScreen', () => {
        const MockComponent = () => null;
        const config: HttpErrorConfig = {
          skipHandledErrorCodes: [404],
          errorScreen: {
            component: MockComponent,
            forWhichErrors: [500],
          },
        };

        expect(config.skipHandledErrorCodes).toEqual([404]);
        expect(config.errorScreen?.forWhichErrors).toEqual([500]);
      });

      it('should accept mixed error codes in skipHandledErrorCodes', () => {
        const config: HttpErrorConfig = {
          skipHandledErrorCodes: [401, 418, 500, 503],
        };

        expect(config.skipHandledErrorCodes).toHaveLength(4);
        expect(config.skipHandledErrorCodes).toContain(401); // ErrorScreenErrorCodes
        expect(config.skipHandledErrorCodes).toContain(418); // non-standard code
        expect(config.skipHandledErrorCodes).toContain(500); // ErrorScreenErrorCodes
        expect(config.skipHandledErrorCodes).toContain(503); // non-standard code
      });
    });

    // v2.7.0 - Simplified forWhichErrors type
    describe('forWhichErrors simplified array (v2.7.0)', () => {
      it('should accept any length array of ErrorScreenErrorCodes', () => {
        const MockComponent = () => null;

        // Single error
        const config1: HttpErrorConfig = {
          errorScreen: { component: MockComponent, forWhichErrors: [404] },
        };
        expect(config1.errorScreen?.forWhichErrors).toHaveLength(1);

        // Two errors
        const config2: HttpErrorConfig = {
          errorScreen: { component: MockComponent, forWhichErrors: [401, 403] },
        };
        expect(config2.errorScreen?.forWhichErrors).toHaveLength(2);

        // Three errors
        const config3: HttpErrorConfig = {
          errorScreen: { component: MockComponent, forWhichErrors: [401, 403, 404] },
        };
        expect(config3.errorScreen?.forWhichErrors).toHaveLength(3);

        // Four errors
        const config4: HttpErrorConfig = {
          errorScreen: { component: MockComponent, forWhichErrors: [401, 403, 404, 500] },
        };
        expect(config4.errorScreen?.forWhichErrors).toHaveLength(4);
      });

      it('should accept empty forWhichErrors array', () => {
        const MockComponent = () => null;
        const config: HttpErrorConfig = {
          errorScreen: {
            component: MockComponent,
            forWhichErrors: [],
          },
        };

        expect(config.errorScreen?.forWhichErrors).toEqual([]);
      });
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

    it('should accept httpErrorConfig with skipHandledErrorCodes (v2.7.0)', () => {
      const MockComponent = () => null;
      const params: RootParams = {
        httpErrorConfig: {
          skipHandledErrorCodes: [404],
          errorScreen: {
            component: MockComponent,
            forWhichErrors: [500],
          },
        },
      };

      expect(params.httpErrorConfig?.skipHandledErrorCodes).toEqual([404]);
    });
  });
});
