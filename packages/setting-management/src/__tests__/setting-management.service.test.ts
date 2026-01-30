/**
 * Tests for SettingManagementService
 * @abpjs/setting-management v0.9.0
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingManagementService, getSettingManagementService } from '../services/setting-management.service';

describe('SettingManagementService', () => {
  let service: SettingManagementService;

  beforeEach(() => {
    // Create a fresh instance for each test
    service = new SettingManagementService();
  });

  describe('settings getter', () => {
    it('should return empty array initially', () => {
      expect(service.settings).toEqual([]);
    });

    it('should return settings sorted by order', () => {
      service.addSetting({ name: 'Third', order: 30 });
      service.addSetting({ name: 'First', order: 10 });
      service.addSetting({ name: 'Second', order: 20 });

      const settings = service.settings;
      expect(settings[0].name).toBe('First');
      expect(settings[1].name).toBe('Second');
      expect(settings[2].name).toBe('Third');
    });

    it('should return a copy of settings array', () => {
      service.addSetting({ name: 'Test', order: 1 });
      const settings1 = service.settings;
      const settings2 = service.settings;
      expect(settings1).not.toBe(settings2);
    });
  });

  describe('selected getter', () => {
    it('should return null initially', () => {
      expect(service.selected).toBeNull();
    });

    it('should return the selected tab', () => {
      const tab = { name: 'Test', order: 1 };
      service.addSetting(tab);
      service.setSelected(tab);
      expect(service.selected).toEqual(tab);
    });
  });

  describe('addSetting', () => {
    it('should add a setting tab', () => {
      service.addSetting({ name: 'Test', order: 1 });
      expect(service.settings).toHaveLength(1);
      expect(service.settings[0].name).toBe('Test');
    });

    it('should not add duplicate settings with same name', () => {
      service.addSetting({ name: 'Test', order: 1 });
      service.addSetting({ name: 'Test', order: 2 });
      expect(service.settings).toHaveLength(1);
    });

    it('should add settings with different names', () => {
      service.addSetting({ name: 'Test1', order: 1 });
      service.addSetting({ name: 'Test2', order: 2 });
      expect(service.settings).toHaveLength(2);
    });

    it('should preserve optional properties', () => {
      service.addSetting({
        name: 'Test',
        order: 1,
        url: '/test',
        requiredPolicy: 'TestPolicy'
      });
      expect(service.settings[0].url).toBe('/test');
      expect(service.settings[0].requiredPolicy).toBe('TestPolicy');
    });

    it('should notify subscribers when adding new setting', () => {
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSetting({ name: 'Test', order: 1 });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not notify subscribers when adding duplicate', () => {
      service.addSetting({ name: 'Test', order: 1 });
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSetting({ name: 'Test', order: 2 });
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('addSettings', () => {
    it('should add multiple settings at once', () => {
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
        { name: 'Test3', order: 3 },
      ]);
      expect(service.settings).toHaveLength(3);
    });

    it('should skip duplicates when adding multiple', () => {
      service.addSetting({ name: 'Test1', order: 1 });
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      expect(service.settings).toHaveLength(2);
    });

    it('should notify subscribers once when adding multiple settings', () => {
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not notify subscribers when all are duplicates', () => {
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty array', () => {
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSettings([]);
      expect(service.settings).toHaveLength(0);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('removeSetting', () => {
    it('should remove a setting by name', () => {
      service.addSetting({ name: 'Test', order: 1 });
      service.removeSetting('Test');
      expect(service.settings).toHaveLength(0);
    });

    it('should do nothing when removing non-existent setting', () => {
      service.addSetting({ name: 'Test', order: 1 });
      const callback = vi.fn();
      service.subscribe(callback);
      service.removeSetting('NonExistent');
      expect(service.settings).toHaveLength(1);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should clear selection when removing selected tab', () => {
      const tab = { name: 'Test', order: 1 };
      service.addSetting(tab);
      service.setSelected(tab);
      service.removeSetting('Test');
      expect(service.selected).toBeNull();
    });

    it('should not clear selection when removing different tab', () => {
      const tab1 = { name: 'Test1', order: 1 };
      const tab2 = { name: 'Test2', order: 2 };
      service.addSettings([tab1, tab2]);
      service.setSelected(tab1);
      service.removeSetting('Test2');
      expect(service.selected).toEqual(tab1);
    });

    it('should notify subscribers when removing existing setting', () => {
      service.addSetting({ name: 'Test', order: 1 });
      const callback = vi.fn();
      service.subscribe(callback);
      service.removeSetting('Test');
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('setSelected', () => {
    it('should set the selected tab', () => {
      const tab = { name: 'Test', order: 1 };
      service.setSelected(tab);
      expect(service.selected).toEqual(tab);
    });

    it('should allow setting null', () => {
      const tab = { name: 'Test', order: 1 };
      service.setSelected(tab);
      service.setSelected(null);
      expect(service.selected).toBeNull();
    });

    it('should notify subscribers', () => {
      const callback = vi.fn();
      service.subscribe(callback);
      service.setSelected({ name: 'Test', order: 1 });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectByName', () => {
    it('should select tab by name', () => {
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      service.selectByName('Test2');
      expect(service.selected?.name).toBe('Test2');
    });

    it('should not change selection for non-existent name', () => {
      service.addSetting({ name: 'Test', order: 1 });
      service.selectByName('Test');
      const callback = vi.fn();
      service.subscribe(callback);
      service.selectByName('NonExistent');
      expect(service.selected?.name).toBe('Test');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('selectByUrl', () => {
    it('should select tab by URL', () => {
      service.addSettings([
        { name: 'Test1', order: 1, url: '/test1' },
        { name: 'Test2', order: 2, url: '/test2' },
      ]);
      service.selectByUrl('/test2');
      expect(service.selected?.name).toBe('Test2');
    });

    it('should not change selection for non-existent URL', () => {
      service.addSetting({ name: 'Test', order: 1, url: '/test' });
      service.selectByUrl('/test');
      const callback = vi.fn();
      service.subscribe(callback);
      service.selectByUrl('/nonexistent');
      expect(service.selected?.name).toBe('Test');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not match tabs without URL', () => {
      service.addSetting({ name: 'Test', order: 1 });
      service.selectByUrl('/test');
      expect(service.selected).toBeNull();
    });
  });

  describe('clearSettings', () => {
    it('should remove all settings', () => {
      service.addSettings([
        { name: 'Test1', order: 1 },
        { name: 'Test2', order: 2 },
      ]);
      service.clearSettings();
      expect(service.settings).toHaveLength(0);
    });

    it('should clear selection', () => {
      const tab = { name: 'Test', order: 1 };
      service.addSetting(tab);
      service.setSelected(tab);
      service.clearSettings();
      expect(service.selected).toBeNull();
    });

    it('should notify subscribers', () => {
      service.addSetting({ name: 'Test', order: 1 });
      const callback = vi.fn();
      service.subscribe(callback);
      service.clearSettings();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should add subscriber', () => {
      const callback = vi.fn();
      service.subscribe(callback);
      service.addSetting({ name: 'Test', order: 1 });
      expect(callback).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);
      unsubscribe();
      service.addSetting({ name: 'Test', order: 1 });
      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      service.subscribe(callback1);
      service.subscribe(callback2);
      service.addSetting({ name: 'Test', order: 1 });
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing individual subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const unsubscribe1 = service.subscribe(callback1);
      service.subscribe(callback2);
      unsubscribe1();
      service.addSetting({ name: 'Test', order: 1 });
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getSettingManagementService', () => {
  it('should return a singleton instance', () => {
    const instance1 = getSettingManagementService();
    const instance2 = getSettingManagementService();
    expect(instance1).toBe(instance2);
  });

  it('should return an instance of SettingManagementService', () => {
    const instance = getSettingManagementService();
    expect(instance).toBeInstanceOf(SettingManagementService);
  });
});
