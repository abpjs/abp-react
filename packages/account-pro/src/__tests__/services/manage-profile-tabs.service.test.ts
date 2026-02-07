import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import {
  ManageProfileTabsService,
  getManageProfileTabsService,
  ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS,
  ACCOUNT_MANAGE_PROFILE_TAB_ORDERS,
  ACCOUNT_MANAGE_PROFILE_TAB_NAMES,
  type ManageProfileTab,
  type AddManageProfileTabInput,
} from '../../services/manage-profile-tabs.service';
import { eAccountManageProfileTabNames } from '../../config/enums/manage-profile-tab-names';

// Mock components for testing
const MockProfilePictureComponent: React.FC = () => null;
const MockChangePasswordComponent: React.FC = () => null;
const MockPersonalSettingsComponent: React.FC = () => null;
const MockTwoFactorComponent: React.FC = () => null;
const MockCustomComponent: React.FC = () => null;

describe('ManageProfileTabsService (v3.2.0)', () => {
  let service: ManageProfileTabsService;

  beforeEach(() => {
    service = new ManageProfileTabsService();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeInstanceOf(ManageProfileTabsService);
    });

    it('should start with no tabs', () => {
      expect(service.getTabs()).toHaveLength(0);
    });
  });

  describe('addTab', () => {
    it('should add a tab with all properties', () => {
      const input: AddManageProfileTabInput = {
        key: 'test-tab',
        name: eAccountManageProfileTabNames.ProfilePicture,
        order: 10,
        component: MockProfilePictureComponent,
        visible: true,
      };

      service.addTab(input);

      const tab = service.getTab('test-tab');
      expect(tab).toBeDefined();
      expect(tab?.key).toBe('test-tab');
      expect(tab?.name).toBe(eAccountManageProfileTabNames.ProfilePicture);
      expect(tab?.order).toBe(10);
      expect(tab?.component).toBe(MockProfilePictureComponent);
      expect(tab?.visible).toBe(true);
    });

    it('should add a tab with default visible=true when not specified', () => {
      const input: AddManageProfileTabInput = {
        key: 'test-tab',
        name: 'Custom Tab',
        order: 20,
        component: MockCustomComponent,
      };

      service.addTab(input);

      const tab = service.getTab('test-tab');
      expect(tab?.visible).toBe(true);
    });

    it('should add a tab with visible=false', () => {
      const input: AddManageProfileTabInput = {
        key: 'hidden-tab',
        name: 'Hidden Tab',
        order: 30,
        component: MockCustomComponent,
        visible: false,
      };

      service.addTab(input);

      const tab = service.getTab('hidden-tab');
      expect(tab?.visible).toBe(false);
    });

    it('should replace an existing tab with the same key', () => {
      service.addTab({
        key: 'tab1',
        name: 'First Name',
        order: 10,
        component: MockProfilePictureComponent,
      });

      service.addTab({
        key: 'tab1',
        name: 'Updated Name',
        order: 50,
        component: MockChangePasswordComponent,
      });

      const tabs = service.getTabs();
      expect(tabs).toHaveLength(1);
      expect(tabs[0].name).toBe('Updated Name');
      expect(tabs[0].order).toBe(50);
    });

    it('should allow custom string names', () => {
      service.addTab({
        key: 'custom-tab',
        name: 'My Custom Tab Name',
        order: 100,
        component: MockCustomComponent,
      });

      const tab = service.getTab('custom-tab');
      expect(tab?.name).toBe('My Custom Tab Name');
    });
  });

  describe('removeTab', () => {
    beforeEach(() => {
      service.addTab({
        key: 'tab1',
        name: 'Tab 1',
        order: 10,
        component: MockProfilePictureComponent,
      });
      service.addTab({
        key: 'tab2',
        name: 'Tab 2',
        order: 20,
        component: MockChangePasswordComponent,
      });
    });

    it('should remove an existing tab and return true', () => {
      const result = service.removeTab('tab1');

      expect(result).toBe(true);
      expect(service.getTabs()).toHaveLength(1);
      expect(service.getTab('tab1')).toBeUndefined();
    });

    it('should return false when removing non-existent tab', () => {
      const result = service.removeTab('non-existent');

      expect(result).toBe(false);
      expect(service.getTabs()).toHaveLength(2);
    });

    it('should not affect other tabs when removing one', () => {
      service.removeTab('tab1');

      const tab2 = service.getTab('tab2');
      expect(tab2).toBeDefined();
      expect(tab2?.name).toBe('Tab 2');
    });
  });

  describe('getTab', () => {
    beforeEach(() => {
      service.addTab({
        key: 'existing-tab',
        name: 'Existing Tab',
        order: 10,
        component: MockProfilePictureComponent,
      });
    });

    it('should return the tab for an existing key', () => {
      const tab = service.getTab('existing-tab');

      expect(tab).toBeDefined();
      expect(tab?.key).toBe('existing-tab');
    });

    it('should return undefined for non-existent key', () => {
      const tab = service.getTab('non-existent');

      expect(tab).toBeUndefined();
    });
  });

  describe('getTabs', () => {
    it('should return empty array when no tabs', () => {
      expect(service.getTabs()).toEqual([]);
    });

    it('should return all tabs sorted by order', () => {
      service.addTab({
        key: 'tab3',
        name: 'Tab 3',
        order: 30,
        component: MockPersonalSettingsComponent,
      });
      service.addTab({
        key: 'tab1',
        name: 'Tab 1',
        order: 10,
        component: MockProfilePictureComponent,
      });
      service.addTab({
        key: 'tab2',
        name: 'Tab 2',
        order: 20,
        component: MockChangePasswordComponent,
      });

      const tabs = service.getTabs();

      expect(tabs).toHaveLength(3);
      expect(tabs[0].key).toBe('tab1');
      expect(tabs[1].key).toBe('tab2');
      expect(tabs[2].key).toBe('tab3');
    });

    it('should maintain order after adding tabs in different order', () => {
      service.addTab({
        key: 'high-order',
        name: 'High Order',
        order: 100,
        component: MockTwoFactorComponent,
      });
      service.addTab({
        key: 'low-order',
        name: 'Low Order',
        order: 5,
        component: MockProfilePictureComponent,
      });
      service.addTab({
        key: 'mid-order',
        name: 'Mid Order',
        order: 50,
        component: MockChangePasswordComponent,
      });

      const tabs = service.getTabs();

      expect(tabs[0].order).toBe(5);
      expect(tabs[1].order).toBe(50);
      expect(tabs[2].order).toBe(100);
    });
  });

  describe('getVisibleTabs', () => {
    beforeEach(() => {
      service.addTab({
        key: 'visible1',
        name: 'Visible 1',
        order: 10,
        component: MockProfilePictureComponent,
        visible: true,
      });
      service.addTab({
        key: 'hidden1',
        name: 'Hidden 1',
        order: 20,
        component: MockChangePasswordComponent,
        visible: false,
      });
      service.addTab({
        key: 'visible2',
        name: 'Visible 2',
        order: 30,
        component: MockPersonalSettingsComponent,
        visible: true,
      });
    });

    it('should return only visible tabs', () => {
      const visibleTabs = service.getVisibleTabs();

      expect(visibleTabs).toHaveLength(2);
      expect(visibleTabs.every((tab) => tab.visible !== false)).toBe(true);
    });

    it('should maintain sort order', () => {
      const visibleTabs = service.getVisibleTabs();

      expect(visibleTabs[0].key).toBe('visible1');
      expect(visibleTabs[1].key).toBe('visible2');
    });

    it('should exclude hidden tabs', () => {
      const visibleTabs = service.getVisibleTabs();

      expect(visibleTabs.find((tab) => tab.key === 'hidden1')).toBeUndefined();
    });
  });

  describe('setTabVisibility', () => {
    beforeEach(() => {
      service.addTab({
        key: 'test-tab',
        name: 'Test Tab',
        order: 10,
        component: MockProfilePictureComponent,
        visible: true,
      });
    });

    it('should set tab visibility to false and return true', () => {
      const result = service.setTabVisibility('test-tab', false);

      expect(result).toBe(true);
      expect(service.getTab('test-tab')?.visible).toBe(false);
    });

    it('should set tab visibility to true and return true', () => {
      service.setTabVisibility('test-tab', false);
      const result = service.setTabVisibility('test-tab', true);

      expect(result).toBe(true);
      expect(service.getTab('test-tab')?.visible).toBe(true);
    });

    it('should return false for non-existent tab', () => {
      const result = service.setTabVisibility('non-existent', false);

      expect(result).toBe(false);
    });
  });

  describe('setTabOrder', () => {
    beforeEach(() => {
      service.addTab({
        key: 'tab1',
        name: 'Tab 1',
        order: 10,
        component: MockProfilePictureComponent,
      });
      service.addTab({
        key: 'tab2',
        name: 'Tab 2',
        order: 20,
        component: MockChangePasswordComponent,
      });
    });

    it('should update tab order and return true', () => {
      const result = service.setTabOrder('tab1', 100);

      expect(result).toBe(true);
      expect(service.getTab('tab1')?.order).toBe(100);
    });

    it('should affect sort order of getTabs', () => {
      service.setTabOrder('tab1', 100);

      const tabs = service.getTabs();
      expect(tabs[0].key).toBe('tab2');
      expect(tabs[1].key).toBe('tab1');
    });

    it('should return false for non-existent tab', () => {
      const result = service.setTabOrder('non-existent', 50);

      expect(result).toBe(false);
    });
  });

  describe('hasTab', () => {
    beforeEach(() => {
      service.addTab({
        key: 'existing-tab',
        name: 'Existing Tab',
        order: 10,
        component: MockProfilePictureComponent,
      });
    });

    it('should return true for existing tab', () => {
      expect(service.hasTab('existing-tab')).toBe(true);
    });

    it('should return false for non-existent tab', () => {
      expect(service.hasTab('non-existent')).toBe(false);
    });
  });

  describe('clearTabs', () => {
    beforeEach(() => {
      service.addTab({
        key: 'tab1',
        name: 'Tab 1',
        order: 10,
        component: MockProfilePictureComponent,
      });
      service.addTab({
        key: 'tab2',
        name: 'Tab 2',
        order: 20,
        component: MockChangePasswordComponent,
      });
    });

    it('should remove all tabs', () => {
      service.clearTabs();

      expect(service.getTabs()).toHaveLength(0);
    });

    it('should make hasTab return false for all previous tabs', () => {
      service.clearTabs();

      expect(service.hasTab('tab1')).toBe(false);
      expect(service.hasTab('tab2')).toBe(false);
    });
  });
});

describe('getManageProfileTabsService singleton', () => {
  it('should return a ManageProfileTabsService instance', () => {
    const service = getManageProfileTabsService();

    expect(service).toBeInstanceOf(ManageProfileTabsService);
  });

  it('should return the same instance on multiple calls', () => {
    const service1 = getManageProfileTabsService();
    const service2 = getManageProfileTabsService();

    expect(service1).toBe(service2);
  });

  it('should persist tabs across calls', () => {
    const service1 = getManageProfileTabsService();
    service1.addTab({
      key: 'singleton-test-tab',
      name: 'Singleton Test',
      order: 999,
      component: MockCustomComponent,
    });

    const service2 = getManageProfileTabsService();
    expect(service2.hasTab('singleton-test-tab')).toBe(true);

    // Clean up
    service1.removeTab('singleton-test-tab');
  });
});

describe('ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS constants', () => {
  it('should have PROFILE_PICTURE constant', () => {
    expect(ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE).toBe(
      'profile-picture'
    );
  });

  it('should have CHANGE_PASSWORD constant', () => {
    expect(ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD).toBe(
      'change-password'
    );
  });

  it('should have PERSONAL_SETTINGS constant', () => {
    expect(ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS).toBe(
      'personal-settings'
    );
  });

  it('should have TWO_FACTOR constant', () => {
    expect(ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR).toBe('two-factor');
  });

  it('should have exactly 4 constants', () => {
    const keys = Object.keys(ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS);
    expect(keys).toHaveLength(4);
  });
});

describe('ACCOUNT_MANAGE_PROFILE_TAB_ORDERS constants', () => {
  it('should have order for profile-picture', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE
      ]
    ).toBe(10);
  });

  it('should have order for change-password', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD
      ]
    ).toBe(20);
  });

  it('should have order for personal-settings', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS
      ]
    ).toBe(30);
  });

  it('should have order for two-factor', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR
      ]
    ).toBe(40);
  });

  it('should have orders in ascending order', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE
      ]
    ).toBeLessThan(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD
      ]
    );
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD
      ]
    ).toBeLessThan(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS
      ]
    );
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS
      ]
    ).toBeLessThan(
      ACCOUNT_MANAGE_PROFILE_TAB_ORDERS[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR
      ]
    );
  });
});

describe('ACCOUNT_MANAGE_PROFILE_TAB_NAMES constants', () => {
  it('should map profile-picture to eAccountManageProfileTabNames.ProfilePicture', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_NAMES[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PROFILE_PICTURE
      ]
    ).toBe(eAccountManageProfileTabNames.ProfilePicture);
  });

  it('should map change-password to eAccountManageProfileTabNames.ChangePassword', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_NAMES[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.CHANGE_PASSWORD
      ]
    ).toBe(eAccountManageProfileTabNames.ChangePassword);
  });

  it('should map personal-settings to eAccountManageProfileTabNames.PersonalSettings', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_NAMES[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.PERSONAL_SETTINGS
      ]
    ).toBe(eAccountManageProfileTabNames.PersonalSettings);
  });

  it('should map two-factor to eAccountManageProfileTabNames.TwoFactor', () => {
    expect(
      ACCOUNT_MANAGE_PROFILE_TAB_NAMES[
        ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS.TWO_FACTOR
      ]
    ).toBe(eAccountManageProfileTabNames.TwoFactor);
  });
});

describe('ManageProfileTab type', () => {
  it('should support all required properties', () => {
    const tab: ManageProfileTab = {
      key: 'test-tab',
      name: eAccountManageProfileTabNames.ProfilePicture,
      order: 10,
      component: MockProfilePictureComponent,
      visible: true,
    };

    expect(tab.key).toBe('test-tab');
    expect(tab.name).toBe(eAccountManageProfileTabNames.ProfilePicture);
    expect(tab.order).toBe(10);
    expect(tab.component).toBe(MockProfilePictureComponent);
    expect(tab.visible).toBe(true);
  });

  it('should make visible optional', () => {
    const tab: ManageProfileTab = {
      key: 'test-tab',
      name: eAccountManageProfileTabNames.ChangePassword,
      order: 20,
      component: MockChangePasswordComponent,
    };

    expect(tab.visible).toBeUndefined();
  });
});

describe('AddManageProfileTabInput type', () => {
  it('should support all required properties', () => {
    const input: AddManageProfileTabInput = {
      key: 'input-tab',
      name: 'Custom Name',
      order: 50,
      component: MockCustomComponent,
    };

    expect(input.key).toBe('input-tab');
    expect(input.name).toBe('Custom Name');
    expect(input.order).toBe(50);
    expect(input.component).toBe(MockCustomComponent);
  });

  it('should allow AccountManageProfileTabName as name', () => {
    const input: AddManageProfileTabInput = {
      key: 'enum-name-tab',
      name: eAccountManageProfileTabNames.TwoFactor,
      order: 40,
      component: MockTwoFactorComponent,
    };

    expect(input.name).toBe(eAccountManageProfileTabNames.TwoFactor);
  });

  it('should allow custom string as name', () => {
    const input: AddManageProfileTabInput = {
      key: 'custom-string-tab',
      name: 'My Custom Tab Label',
      order: 100,
      component: MockCustomComponent,
    };

    expect(input.name).toBe('My Custom Tab Label');
  });
});
