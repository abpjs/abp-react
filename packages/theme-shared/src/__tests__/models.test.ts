import { describe, it, expect, vi } from 'vitest';
import { Toaster } from '../models/toaster';
import { Confirmation } from '../models/confirmation';
import { NavItem } from '../models/nav-item';
import type {
  RootParams,
  HttpErrorConfig,
  ErrorScreenErrorCodes,
  LocaleDirection,
} from '../models/common';

describe('Toaster namespace', () => {
  // v3.0.0 - Toaster.Status was removed, use Confirmation.Status instead
  describe('Removed in v3.0.0', () => {
    it('should document that Status enum was removed (use Confirmation.Status instead)', () => {
      // Status was removed in v3.0.0 - this is a documentation test
      // The Toaster namespace now only contains types (no runtime values)
      // Users should use Confirmation.Status instead
      expect(Confirmation.Status.confirm).toBe('confirm');
      expect(Confirmation.Status.reject).toBe('reject');
      expect(Confirmation.Status.dismiss).toBe('dismiss');
    });
  });

  describe('Types', () => {
    // v2.0.0 - Changed 'warn' to 'warning', added 'neutral'
    it('should allow valid severity types', () => {
      const severities: Toaster.Severity[] = ['neutral', 'success', 'info', 'warning', 'error'];
      expect(severities).toHaveLength(5);
    });

    it('should accept valid ToastOptions', () => {
      const options: Toaster.ToastOptions = {
        id: 'test-id',
        closable: true,
        life: 5000,
        sticky: false,
        messageLocalizationParams: ['param1'],
        titleLocalizationParams: ['param2'],
      };

      expect(options.id).toBe('test-id');
      expect(options.closable).toBe(true);
      expect(options.life).toBe(5000);
      expect(options.sticky).toBe(false);
    });

    it('should accept minimal ToastOptions with required id', () => {
      const options: Toaster.ToastOptions = { id: 'test' };
      expect(options.id).toBe('test');
    });

    it('should accept valid Toast', () => {
      const toast: Toaster.Toast = {
        message: 'Test message',
        title: 'Test title',
        severity: 'success',
        options: { id: 'toast-1', closable: true },
      };

      expect(toast.message).toBe('Test message');
      expect(toast.severity).toBe('success');
    });

    it('should accept Toast without optional fields', () => {
      const toast: Toaster.Toast = {
        message: 'Test message',
      };

      expect(toast.message).toBe('Test message');
      expect(toast.title).toBeUndefined();
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
  // v2.9.0 - Added dismissible, deprecated closable
  // v3.0.0 - Removed closable
  describe('Options (v3.0.0)', () => {
    it('should accept minimal Confirmation.Options', () => {
      const options: Confirmation.Options = {};
      expect(options).toEqual({});
    });

    it('should accept confirmation-specific options', () => {
      const options: Confirmation.Options = {
        id: 'confirm-1',
        dismissible: true,
        hideCancelBtn: false,
        hideYesBtn: false,
        messageLocalizationParams: ['param1'],
        titleLocalizationParams: ['param2'],
      };

      expect(options.id).toBe('confirm-1');
      expect(options.dismissible).toBe(true);
      expect(options.hideCancelBtn).toBe(false);
      expect(options.hideYesBtn).toBe(false);
    });

    // v3.0.0 - dismissible is the only property for dismissal control
    it('should accept dismissible property', () => {
      const options: Confirmation.Options = {
        dismissible: true,
      };

      expect(options.dismissible).toBe(true);
    });

    it('should accept dismissible as false', () => {
      const options: Confirmation.Options = {
        dismissible: false,
      };

      expect(options.dismissible).toBe(false);
    });

    // v3.0.0 - closable was removed
    it('should not have closable property (removed in v3.0.0)', () => {
      const options: Confirmation.Options = {
        dismissible: true,
      };

      // @ts-expect-error - closable was removed in v3.0.0
      expect(options.closable).toBeUndefined();
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

  // v2.9.0 - LocaleDirection type
  describe('LocaleDirection (v2.9.0)', () => {
    it('should accept ltr direction', () => {
      const direction: LocaleDirection = 'ltr';
      expect(direction).toBe('ltr');
    });

    it('should accept rtl direction', () => {
      const direction: LocaleDirection = 'rtl';
      expect(direction).toBe('rtl');
    });

    it('should be usable in conditions', () => {
      const direction: LocaleDirection = 'rtl';
      const isRtl = direction === 'rtl';
      expect(isRtl).toBe(true);
    });

    it('should be usable in switch statements', () => {
      const getTextAlign = (dir: LocaleDirection): string => {
        switch (dir) {
          case 'ltr':
            return 'left';
          case 'rtl':
            return 'right';
          default:
            return 'left';
        }
      };

      expect(getTextAlign('ltr')).toBe('left');
      expect(getTextAlign('rtl')).toBe('right');
    });

    it('should be usable in object properties', () => {
      const config: { direction: LocaleDirection } = {
        direction: 'ltr',
      };
      expect(config.direction).toBe('ltr');
    });

    it('should work with array of directions', () => {
      const directions: LocaleDirection[] = ['ltr', 'rtl'];
      expect(directions).toHaveLength(2);
      expect(directions).toContain('ltr');
      expect(directions).toContain('rtl');
    });
  });
});

describe('NavItem class (v3.1.0)', () => {
  describe('constructor', () => {
    it('should create NavItem with all properties', () => {
      const MockComponent = () => null;
      const mockAction = vi.fn();
      const mockVisible = vi.fn(() => true);

      const item = new NavItem({
        id: 'test-item',
        component: MockComponent,
        html: '<span>Test</span>',
        action: mockAction,
        order: 10,
        requiredPolicy: 'Admin.Access',
        visible: mockVisible,
      });

      expect(item.id).toBe('test-item');
      expect(item.component).toBe(MockComponent);
      expect(item.html).toBe('<span>Test</span>');
      expect(item.action).toBe(mockAction);
      expect(item.order).toBe(10);
      expect(item.requiredPolicy).toBe('Admin.Access');
      expect(item.visible).toBe(mockVisible);
    });

    it('should create NavItem with partial properties', () => {
      const item = new NavItem({
        id: 'partial',
        order: 5,
      });

      expect(item.id).toBe('partial');
      expect(item.order).toBe(5);
      expect(item.component).toBeUndefined();
      expect(item.html).toBeUndefined();
      expect(item.action).toBeUndefined();
      expect(item.requiredPolicy).toBeUndefined();
      expect(item.visible).toBeUndefined();
    });

    it('should default id to empty string when not provided', () => {
      const item = new NavItem({});

      expect(item.id).toBe('');
    });

    it('should create NavItem with only id', () => {
      const item = new NavItem({ id: 'only-id' });

      expect(item.id).toBe('only-id');
      expect(item.component).toBeUndefined();
      expect(item.html).toBeUndefined();
      expect(item.action).toBeUndefined();
      expect(item.order).toBeUndefined();
      expect(item.requiredPolicy).toBeUndefined();
      expect(item.visible).toBeUndefined();
    });

    it('should accept numeric id', () => {
      const item = new NavItem({ id: 123 });

      expect(item.id).toBe(123);
    });

    it('should accept zero as id', () => {
      const item = new NavItem({ id: 0 });

      expect(item.id).toBe(0);
    });
  });

  describe('visible property (v3.1.0)', () => {
    it('should accept visible callback that returns true', () => {
      const visibleFn = () => true;
      const item = new NavItem({
        id: 'visible-item',
        visible: visibleFn,
      });

      expect(item.visible).toBe(visibleFn);
      expect(item.visible?.()).toBe(true);
    });

    it('should accept visible callback that returns false', () => {
      const visibleFn = () => false;
      const item = new NavItem({
        id: 'hidden-item',
        visible: visibleFn,
      });

      expect(item.visible?.()).toBe(false);
    });

    it('should handle dynamic visibility based on external state', () => {
      let isAdmin = false;
      const visibleFn = () => isAdmin;
      const item = new NavItem({
        id: 'dynamic-item',
        visible: visibleFn,
      });

      expect(item.visible?.()).toBe(false);

      isAdmin = true;
      expect(item.visible?.()).toBe(true);
    });

    it('should allow undefined visible callback', () => {
      const item = new NavItem({
        id: 'no-visible',
      });

      expect(item.visible).toBeUndefined();
    });
  });

  describe('NavItemProps interface (v3.1.0)', () => {
    it('should accept NavItemProps with visible property', () => {
      const props: import('../models/nav-item').NavItemProps = {
        id: 'props-item',
        visible: () => true,
      };

      expect(props.id).toBe('props-item');
      expect(props.visible?.()).toBe(true);
    });

    it('should accept NavItemProps without visible property', () => {
      const props: import('../models/nav-item').NavItemProps = {
        id: 'props-no-visible',
        order: 5,
      };

      expect(props.id).toBe('props-no-visible');
      expect(props.visible).toBeUndefined();
    });
  });

  describe('id property (required)', () => {
    it('should accept string id', () => {
      const item = new NavItem({
        id: 'profile',
      });

      expect(item.id).toBe('profile');
    });

    it('should accept numeric id', () => {
      const item = new NavItem({
        id: 123,
      });

      expect(item.id).toBe(123);
    });

    it('should accept empty string id', () => {
      const item = new NavItem({
        id: '',
      });

      expect(item.id).toBe('');
    });

    it('should accept zero as id', () => {
      const item = new NavItem({
        id: 0,
      });

      expect(item.id).toBe(0);
    });
  });

  describe('component property (optional)', () => {
    it('should accept a React component', () => {
      const MockComponent = () => null;
      const item = new NavItem({
        id: 'test',
        component: MockComponent,
      });

      expect(item.component).toBe(MockComponent);
    });

    it('should accept component with props', () => {
      const MockComponent = ({ name }: { name: string }) => null;
      const item = new NavItem({
        id: 'test',
        component: MockComponent,
      });

      expect(item.component).toBe(MockComponent);
    });

    it('should be undefined when not provided', () => {
      const item = new NavItem({ id: 'test' });

      expect(item.component).toBeUndefined();
    });
  });

  describe('html property (optional)', () => {
    it('should accept html string', () => {
      const item = new NavItem({
        id: 'test',
        html: '<span>Hello</span>',
      });

      expect(item.html).toBe('<span>Hello</span>');
    });

    it('should accept empty html string', () => {
      const item = new NavItem({
        id: 'test',
        html: '',
      });

      expect(item.html).toBe('');
    });

    it('should be undefined when not provided', () => {
      const item = new NavItem({ id: 'test' });

      expect(item.html).toBeUndefined();
    });
  });

  describe('action property (optional)', () => {
    it('should accept a function', () => {
      const mockAction = vi.fn();
      const item = new NavItem({
        id: 'test',
        action: mockAction,
      });

      expect(item.action).toBe(mockAction);
    });

    it('should be callable', () => {
      const mockAction = vi.fn();
      const item = new NavItem({
        id: 'test',
        action: mockAction,
      });

      item.action?.();

      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should be undefined when not provided', () => {
      const item = new NavItem({ id: 'test' });

      expect(item.action).toBeUndefined();
    });
  });

  describe('order property (optional)', () => {
    it('should accept positive number', () => {
      const item = new NavItem({
        id: 'test',
        order: 100,
      });

      expect(item.order).toBe(100);
    });

    it('should accept negative number', () => {
      const item = new NavItem({
        id: 'test',
        order: -10,
      });

      expect(item.order).toBe(-10);
    });

    it('should accept zero', () => {
      const item = new NavItem({
        id: 'test',
        order: 0,
      });

      expect(item.order).toBe(0);
    });

    it('should accept decimal number', () => {
      const item = new NavItem({
        id: 'test',
        order: 1.5,
      });

      expect(item.order).toBe(1.5);
    });

    it('should be undefined when not provided', () => {
      const item = new NavItem({ id: 'test' });

      expect(item.order).toBeUndefined();
    });
  });

  describe('requiredPolicy property (v3.0.0 - renamed from permission)', () => {
    it('should accept policy string', () => {
      const item = new NavItem({
        id: 'test',
        requiredPolicy: 'AbpIdentity.Users',
      });

      expect(item.requiredPolicy).toBe('AbpIdentity.Users');
    });

    it('should accept empty policy string', () => {
      const item = new NavItem({
        id: 'test',
        requiredPolicy: '',
      });

      expect(item.requiredPolicy).toBe('');
    });

    it('should accept complex policy string', () => {
      const item = new NavItem({
        id: 'test',
        requiredPolicy: 'AbpIdentity.Users.Create || AbpIdentity.Users.Update',
      });

      expect(item.requiredPolicy).toBe('AbpIdentity.Users.Create || AbpIdentity.Users.Update');
    });

    it('should be undefined when not provided', () => {
      const item = new NavItem({ id: 'test' });

      expect(item.requiredPolicy).toBeUndefined();
    });
  });

  describe('full NavItem object (v3.1.0)', () => {
    it('should accept all properties including visible', () => {
      const MockComponent = () => null;
      const mockAction = vi.fn();
      const mockVisible = vi.fn(() => true);
      const item = new NavItem({
        id: 'full-item',
        component: MockComponent,
        html: '<span>Full Item</span>',
        action: mockAction,
        order: 50,
        requiredPolicy: 'Admin.Access',
        visible: mockVisible,
      });

      expect(item.id).toBe('full-item');
      expect(item.component).toBe(MockComponent);
      expect(item.html).toBe('<span>Full Item</span>');
      expect(item.action).toBe(mockAction);
      expect(item.order).toBe(50);
      expect(item.requiredPolicy).toBe('Admin.Access');
      expect(item.visible).toBe(mockVisible);
    });

    it('should accept minimal NavItem with only id', () => {
      const item = new NavItem({ id: 'minimal' });

      expect(item.id).toBe('minimal');
      expect(item.component).toBeUndefined();
      expect(item.html).toBeUndefined();
      expect(item.action).toBeUndefined();
      expect(item.order).toBeUndefined();
      expect(item.requiredPolicy).toBeUndefined();
      expect(item.visible).toBeUndefined();
    });
  });

  describe('v3.0.0 migration - permission to requiredPolicy', () => {
    it('should use requiredPolicy instead of permission', () => {
      const item = new NavItem({
        id: 'test',
        requiredPolicy: 'SomePolicy',
      });

      // @ts-expect-error - permission was renamed to requiredPolicy in v3.0.0
      expect(item.permission).toBeUndefined();
      expect(item.requiredPolicy).toBe('SomePolicy');
    });

    it('should document migration from v2.9.0 permission to v3.0.0 requiredPolicy', () => {
      // v2.9.0 had: permission?: string
      // v3.0.0 has: requiredPolicy?: string
      const item = new NavItem({
        id: 'migrated',
        requiredPolicy: 'AbpIdentity.Roles',
      });

      expect(item.requiredPolicy).toBe('AbpIdentity.Roles');
    });
  });

  describe('instanceof checks (v3.1.0)', () => {
    it('should be an instance of NavItem class', () => {
      const item = new NavItem({ id: 'test' });

      expect(item).toBeInstanceOf(NavItem);
    });

    it('should differentiate NavItem instances from plain objects', () => {
      const instance = new NavItem({ id: 'instance' });
      const plainObject = { id: 'plain' };

      expect(instance instanceof NavItem).toBe(true);
      expect(plainObject instanceof NavItem).toBe(false);
    });
  });
});
