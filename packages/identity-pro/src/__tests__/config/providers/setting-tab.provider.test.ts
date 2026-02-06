/**
 * Tests for Identity Setting Tab Provider
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getSettingTabsService: vi.fn(),
}));

import { getSettingTabsService } from '@abpjs/core';
import {
  configureSettingTabs,
  initializeIdentitySettingTabs,
  IDENTITY_SETTING_TAB_PROVIDERS,
  IDENTITY_SETTING_TAB_CONFIG,
  IdentitySettingTabConfig,
} from '../../../config/providers/setting-tab.provider';
import { eIdentitySettingTabNames } from '../../../config/enums/setting-tab-names';

describe('IDENTITY_SETTING_TAB_CONFIG', () => {
  it('should have correct name', () => {
    expect(IDENTITY_SETTING_TAB_CONFIG.name).toBe(eIdentitySettingTabNames.IdentityManagement);
  });

  it('should have correct requiredPolicy', () => {
    expect(IDENTITY_SETTING_TAB_CONFIG.requiredPolicy).toBe('AbpIdentity.SettingManagement');
  });

  it('should have correct order', () => {
    expect(IDENTITY_SETTING_TAB_CONFIG.order).toBe(1);
  });

  it('should satisfy IdentitySettingTabConfig interface', () => {
    const config: IdentitySettingTabConfig = IDENTITY_SETTING_TAB_CONFIG;
    expect(config.name).toBeDefined();
    expect(config.requiredPolicy).toBeDefined();
    expect(config.order).toBeDefined();
  });
});

describe('configureSettingTabs', () => {
  let mockSettingTabsService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSettingTabsService = {
      add: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const result = configureSettingTabs(mockSettingTabsService as any);
    expect(typeof result).toBe('function');
  });

  it('should not add tabs until the returned function is called', () => {
    configureSettingTabs(mockSettingTabsService as any);
    expect(mockSettingTabsService.add).not.toHaveBeenCalled();
  });

  it('should add tabs when the returned function is called', () => {
    const initFn = configureSettingTabs(mockSettingTabsService as any);
    initFn();
    expect(mockSettingTabsService.add).toHaveBeenCalledTimes(1);
  });

  it('should add identity setting tab with correct configuration', () => {
    const initFn = configureSettingTabs(mockSettingTabsService as any);
    initFn();

    const addedTabs = mockSettingTabsService.add.mock.calls[0][0];
    expect(addedTabs).toHaveLength(1);

    const tab = addedTabs[0];
    expect(tab.name).toBe(IDENTITY_SETTING_TAB_CONFIG.name);
    expect(tab.requiredPolicy).toBe(IDENTITY_SETTING_TAB_CONFIG.requiredPolicy);
    expect(tab.order).toBe(IDENTITY_SETTING_TAB_CONFIG.order);
  });

  it('should use default placeholder component', () => {
    const initFn = configureSettingTabs(mockSettingTabsService as any);
    initFn();

    const addedTabs = mockSettingTabsService.add.mock.calls[0][0];
    const tab = addedTabs[0];
    expect(tab.component).toBeDefined();
    expect(typeof tab.component).toBe('function');
  });

  it('should use custom component when provided', () => {
    const CustomComponent = () => null;
    const initFn = configureSettingTabs(mockSettingTabsService as any, CustomComponent);
    initFn();

    const addedTabs = mockSettingTabsService.add.mock.calls[0][0];
    const tab = addedTabs[0];
    expect(tab.component).toBe(CustomComponent);
  });
});

describe('initializeIdentitySettingTabs', () => {
  let mockSettingTabsService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSettingTabsService = {
      add: vi.fn(),
    };
    vi.mocked(getSettingTabsService).mockReturnValue(mockSettingTabsService as any);
    vi.clearAllMocks();
  });

  it('should get the global setting tabs service', () => {
    initializeIdentitySettingTabs();
    expect(getSettingTabsService).toHaveBeenCalled();
  });

  it('should return a function', () => {
    const result = initializeIdentitySettingTabs();
    expect(typeof result).toBe('function');
  });

  it('should add tabs when the returned function is called', () => {
    const initFn = initializeIdentitySettingTabs();
    initFn();
    expect(mockSettingTabsService.add).toHaveBeenCalledTimes(1);
  });

  it('should accept custom component', () => {
    const CustomComponent = () => null;
    const initFn = initializeIdentitySettingTabs(CustomComponent);
    initFn();

    const addedTabs = mockSettingTabsService.add.mock.calls[0][0];
    const tab = addedTabs[0];
    expect(tab.component).toBe(CustomComponent);
  });
});

describe('IDENTITY_SETTING_TAB_PROVIDERS', () => {
  it('should export configureSettingTabs', () => {
    expect(IDENTITY_SETTING_TAB_PROVIDERS.configureSettingTabs).toBe(configureSettingTabs);
  });

  it('should have configureSettingTabs as a function', () => {
    expect(typeof IDENTITY_SETTING_TAB_PROVIDERS.configureSettingTabs).toBe('function');
  });
});
