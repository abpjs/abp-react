import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SettingManagementStateService,
  getSettingManagementStateService,
} from '../services/setting-management-state.service';
import type { SettingTab } from '../models';

describe('SettingManagementStateService', () => {
  let service: SettingManagementStateService;

  beforeEach(() => {
    service = new SettingManagementStateService();
  });

  describe('initial state', () => {
    it('should have undefined selectedTab initially', () => {
      expect(service.getSelectedTab()).toBeUndefined();
    });

    it('should return initial state with undefined selectedTab', () => {
      const state = service.getState();
      expect(state).toEqual({ selectedTab: undefined });
    });
  });

  describe('getSelectedTab', () => {
    it('should return undefined when no tab is selected', () => {
      expect(service.getSelectedTab()).toBeUndefined();
    });

    it('should return the selected tab after setting it', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(service.getSelectedTab()).toEqual(tab);
    });
  });

  describe('setSelectedTab', () => {
    it('should set the selected tab', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(service.getSelectedTab()).toEqual(tab);
    });

    it('should allow setting undefined to clear selection', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(service.getSelectedTab()).toEqual(tab);

      service.setSelectedTab(undefined);
      expect(service.getSelectedTab()).toBeUndefined();
    });

    it('should notify subscribers when tab is set', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should allow overwriting the selected tab', () => {
      const tab1: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };
      const tab2: SettingTab = {
        name: 'Security',
        order: 2,
        component: () => null,
      };

      service.setSelectedTab(tab1);
      expect(service.getSelectedTab()?.name).toBe('Account');

      service.setSelectedTab(tab2);
      expect(service.getSelectedTab()?.name).toBe('Security');
    });
  });

  describe('getState', () => {
    it('should return a copy of the state', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      const state1 = service.getState();
      const state2 = service.getState();

      // Should return equal but not same reference
      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });

    it('should reflect changes after setSelectedTab', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      expect(service.getState().selectedTab).toBeUndefined();
      service.setSelectedTab(tab);
      expect(service.getState().selectedTab).toEqual(tab);
    });
  });

  describe('reset', () => {
    it('should reset selectedTab to undefined', () => {
      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(service.getSelectedTab()).toEqual(tab);

      service.reset();
      expect(service.getSelectedTab()).toBeUndefined();
    });

    it('should notify subscribers when reset', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      service.reset();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should allow setting values again after reset', () => {
      const tab1: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };
      const tab2: SettingTab = {
        name: 'Security',
        order: 2,
        component: () => null,
      };

      service.setSelectedTab(tab1);
      service.reset();
      service.setSelectedTab(tab2);

      expect(service.getSelectedTab()?.name).toBe('Security');
    });
  });

  describe('subscribe', () => {
    it('should add subscriber and call on changes', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling callback after unsubscribe', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      service.setSelectedTab(undefined);
      expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should support multiple subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      service.subscribe(callback1);
      service.subscribe(callback2);
      service.subscribe(callback3);

      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe the specific callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = service.subscribe(callback1);
      service.subscribe(callback2);

      const tab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };

      service.setSelectedTab(tab);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      unsubscribe1();
      service.setSelectedTab(undefined);

      expect(callback1).toHaveBeenCalledTimes(1); // Not called again
      expect(callback2).toHaveBeenCalledTimes(2); // Called again
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      // Initial state
      expect(service.getSelectedTab()).toBeUndefined();
      expect(service.getState()).toEqual({ selectedTab: undefined });

      // Select a tab
      const accountTab: SettingTab = {
        name: 'Account',
        order: 1,
        component: () => null,
      };
      service.setSelectedTab(accountTab);
      expect(service.getSelectedTab()).toEqual(accountTab);
      expect(callback).toHaveBeenCalledTimes(1);

      // Change to another tab
      const securityTab: SettingTab = {
        name: 'Security',
        order: 2,
        component: () => null,
      };
      service.setSelectedTab(securityTab);
      expect(service.getSelectedTab()).toEqual(securityTab);
      expect(callback).toHaveBeenCalledTimes(2);

      // Reset
      service.reset();
      expect(service.getSelectedTab()).toBeUndefined();
      expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should handle tab with all properties', () => {
      const fullTab: SettingTab = {
        name: 'My Settings',
        order: 5,
        url: '/settings/my',
        component: () => null,
        requiredPolicy: 'MyApp.Settings',
      };

      service.setSelectedTab(fullTab);
      const selected = service.getSelectedTab();

      expect(selected?.name).toBe('My Settings');
      expect(selected?.order).toBe(5);
      expect(selected?.url).toBe('/settings/my');
      expect(selected?.requiredPolicy).toBe('MyApp.Settings');
    });
  });
});

describe('getSettingManagementStateService', () => {
  it('should return a SettingManagementStateService instance', () => {
    const service = getSettingManagementStateService();
    expect(service).toBeInstanceOf(SettingManagementStateService);
  });

  it('should return the same instance on multiple calls (singleton)', () => {
    const service1 = getSettingManagementStateService();
    const service2 = getSettingManagementStateService();
    expect(service1).toBe(service2);
  });
});
