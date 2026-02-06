import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
  configureSettingTabs,
  ACCOUNT_SETTING_TAB_PROVIDERS,
  AccountSettingTabOptions,
  getSettingTabsService,
} from '../../../config/providers/setting-tab.provider';
import { eAccountSettingTabNames } from '../../../config/enums/setting-tab-names';

// Mock component for testing
const MockAccountSettingsComponent: React.FC = () => null;

// Mock the @abpjs/core module
const mockAdd = vi.fn();
const mockSettingTabsService = {
  add: mockAdd,
};

vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');
  return {
    ...actual,
    getSettingTabsService: vi.fn(() => mockSettingTabsService),
  };
});

describe('setting-tab.provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('configureSettingTabs', () => {
    const mockOptions: AccountSettingTabOptions = {
      component: MockAccountSettingsComponent,
    };

    it('should return a function', () => {
      const result = configureSettingTabs(mockSettingTabsService as any, mockOptions);
      expect(typeof result).toBe('function');
    });

    it('should not call settingTabs.add immediately', () => {
      configureSettingTabs(mockSettingTabsService as any, mockOptions);
      expect(mockAdd).not.toHaveBeenCalled();
    });

    it('should call settingTabs.add when the returned function is invoked', () => {
      const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
      addTabs();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add tabs array with correct structure', () => {
      const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
      addTabs();

      expect(mockAdd).toHaveBeenCalledWith(expect.any(Array));
      const tabs = mockAdd.mock.calls[0][0];
      expect(tabs).toHaveLength(1);
    });

    describe('Account setting tab', () => {
      it('should add the account setting tab', () => {
        const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        const accountTab = tabs.find(
          (t: any) => t.name === eAccountSettingTabNames.Account
        );

        expect(accountTab).toBeDefined();
      });

      it('should have correct name', () => {
        const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        const accountTab = tabs[0];
        expect(accountTab.name).toBe(eAccountSettingTabNames.Account);
      });

      it('should have order 100', () => {
        const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        const accountTab = tabs[0];
        expect(accountTab.order).toBe(100);
      });

      it('should have correct requiredPolicy', () => {
        const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        const accountTab = tabs[0];
        expect(accountTab.requiredPolicy).toBe('Volo.Account.SettingManagement');
      });

      it('should include the provided component', () => {
        const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        const accountTab = tabs[0];
        expect(accountTab.component).toBe(MockAccountSettingsComponent);
      });
    });

    describe('custom component support', () => {
      it('should accept any React component', () => {
        const CustomComponent: React.FC = () => null;
        const customOptions: AccountSettingTabOptions = {
          component: CustomComponent,
        };

        const addTabs = configureSettingTabs(mockSettingTabsService as any, customOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        expect(tabs[0].component).toBe(CustomComponent);
      });

      it('should accept class components', () => {
        class ClassComponent extends React.Component {
          render() {
            return null;
          }
        }
        const customOptions: AccountSettingTabOptions = {
          component: ClassComponent,
        };

        const addTabs = configureSettingTabs(mockSettingTabsService as any, customOptions);
        addTabs();

        const tabs = mockAdd.mock.calls[0][0];
        expect(tabs[0].component).toBe(ClassComponent);
      });
    });
  });

  describe('ACCOUNT_SETTING_TAB_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof ACCOUNT_SETTING_TAB_PROVIDERS).toBe('object');
    });

    it('should have configureSettingTabs function', () => {
      expect(ACCOUNT_SETTING_TAB_PROVIDERS.configureSettingTabs).toBeDefined();
      expect(typeof ACCOUNT_SETTING_TAB_PROVIDERS.configureSettingTabs).toBe(
        'function'
      );
    });

    it('should have configureSettingTabs be the same function', () => {
      expect(ACCOUNT_SETTING_TAB_PROVIDERS.configureSettingTabs).toBe(
        configureSettingTabs
      );
    });
  });

  describe('getSettingTabsService re-export', () => {
    it('should export getSettingTabsService', () => {
      expect(getSettingTabsService).toBeDefined();
      expect(typeof getSettingTabsService).toBe('function');
    });

    it('should return a service when called', () => {
      const service = getSettingTabsService();
      expect(service).toBeDefined();
      expect(service.add).toBeDefined();
    });
  });

  describe('AccountSettingTabOptions interface', () => {
    it('should require component property', () => {
      const validOptions: AccountSettingTabOptions = {
        component: MockAccountSettingsComponent,
      };
      expect(validOptions.component).toBe(MockAccountSettingsComponent);
    });
  });

  describe('policy name format', () => {
    it('should use Volo namespace for policy', () => {
      const mockOptions: AccountSettingTabOptions = {
        component: MockAccountSettingsComponent,
      };
      const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
      addTabs();

      const tabs = mockAdd.mock.calls[0][0];
      expect(tabs[0].requiredPolicy).toMatch(/^Volo\./);
    });

    it('should use Account.SettingManagement policy', () => {
      const mockOptions: AccountSettingTabOptions = {
        component: MockAccountSettingsComponent,
      };
      const addTabs = configureSettingTabs(mockSettingTabsService as any, mockOptions);
      addTabs();

      const tabs = mockAdd.mock.calls[0][0];
      expect(tabs[0].requiredPolicy).toBe('Volo.Account.SettingManagement');
    });
  });
});
