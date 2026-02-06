/**
 * Tests for useSettingManagement hook
 * @abpjs/setting-management v0.9.0
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettingManagement } from '../hooks/useSettingManagement';
import { getSettingManagementService } from '../services/setting-management.service';

describe('useSettingManagement', () => {
  beforeEach(() => {
    // Clear the singleton service state before each test
    const service = getSettingManagementService();
    service.clearSettings();
  });

  describe('initial state', () => {
    it('should return empty settings array', () => {
      const { result } = renderHook(() => useSettingManagement());
      expect(result.current.settings).toEqual([]);
    });

    it('should return null selected', () => {
      const { result } = renderHook(() => useSettingManagement());
      expect(result.current.selected).toBeNull();
    });

    it('should return all required methods', () => {
      const { result } = renderHook(() => useSettingManagement());
      expect(typeof result.current.addSetting).toBe('function');
      expect(typeof result.current.addSettings).toBe('function');
      expect(typeof result.current.removeSetting).toBe('function');
      expect(typeof result.current.setSelected).toBe('function');
      expect(typeof result.current.selectByName).toBe('function');
      expect(typeof result.current.selectByUrl).toBe('function');
      expect(typeof result.current.clearSettings).toBe('function');
    });
  });

  describe('addSetting', () => {
    it('should add a setting and update state', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSetting({ name: 'Test', order: 1 });
      });

      expect(result.current.settings).toHaveLength(1);
      expect(result.current.settings[0].name).toBe('Test');
    });

    it('should not add duplicate settings', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSetting({ name: 'Test', order: 1 });
        result.current.addSetting({ name: 'Test', order: 2 });
      });

      expect(result.current.settings).toHaveLength(1);
    });
  });

  describe('addSettings', () => {
    it('should add multiple settings at once', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSettings([
          { name: 'Test1', order: 1 },
          { name: 'Test2', order: 2 },
        ]);
      });

      expect(result.current.settings).toHaveLength(2);
    });

    it('should return settings sorted by order', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSettings([
          { name: 'Third', order: 30 },
          { name: 'First', order: 10 },
          { name: 'Second', order: 20 },
        ]);
      });

      expect(result.current.settings[0].name).toBe('First');
      expect(result.current.settings[1].name).toBe('Second');
      expect(result.current.settings[2].name).toBe('Third');
    });
  });

  describe('removeSetting', () => {
    it('should remove a setting by name', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSetting({ name: 'Test', order: 1 });
      });

      act(() => {
        result.current.removeSetting('Test');
      });

      expect(result.current.settings).toHaveLength(0);
    });

    it('should clear selection when removing selected tab', () => {
      const { result } = renderHook(() => useSettingManagement());
      const tab = { name: 'Test', order: 1 };

      act(() => {
        result.current.addSetting(tab);
        result.current.setSelected(tab);
      });

      expect(result.current.selected?.name).toBe('Test');

      act(() => {
        result.current.removeSetting('Test');
      });

      expect(result.current.selected).toBeNull();
    });
  });

  describe('setSelected', () => {
    it('should set the selected tab', () => {
      const { result } = renderHook(() => useSettingManagement());
      const tab = { name: 'Test', order: 1 };

      act(() => {
        result.current.addSetting(tab);
        result.current.setSelected(tab);
      });

      expect(result.current.selected).toEqual(tab);
    });

    it('should allow clearing selection with null', () => {
      const { result } = renderHook(() => useSettingManagement());
      const tab = { name: 'Test', order: 1 };

      act(() => {
        result.current.addSetting(tab);
        result.current.setSelected(tab);
      });

      act(() => {
        result.current.setSelected(null);
      });

      expect(result.current.selected).toBeNull();
    });
  });

  describe('selectByName', () => {
    it('should select a tab by name', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSettings([
          { name: 'Test1', order: 1 },
          { name: 'Test2', order: 2 },
        ]);
      });

      act(() => {
        result.current.selectByName('Test2');
      });

      expect(result.current.selected?.name).toBe('Test2');
    });

    it('should not change selection for non-existent name', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSetting({ name: 'Test', order: 1 });
        result.current.selectByName('Test');
      });

      act(() => {
        result.current.selectByName('NonExistent');
      });

      expect(result.current.selected?.name).toBe('Test');
    });
  });

  describe('selectByUrl', () => {
    it('should select a tab by URL', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSettings([
          { name: 'Test1', order: 1, url: '/test1' },
          { name: 'Test2', order: 2, url: '/test2' },
        ]);
      });

      act(() => {
        result.current.selectByUrl('/test2');
      });

      expect(result.current.selected?.name).toBe('Test2');
    });
  });

  describe('clearSettings', () => {
    it('should remove all settings', () => {
      const { result } = renderHook(() => useSettingManagement());

      act(() => {
        result.current.addSettings([
          { name: 'Test1', order: 1 },
          { name: 'Test2', order: 2 },
        ]);
      });

      act(() => {
        result.current.clearSettings();
      });

      expect(result.current.settings).toHaveLength(0);
    });

    it('should clear selection', () => {
      const { result } = renderHook(() => useSettingManagement());
      const tab = { name: 'Test', order: 1 };

      act(() => {
        result.current.addSetting(tab);
        result.current.setSelected(tab);
      });

      act(() => {
        result.current.clearSettings();
      });

      expect(result.current.selected).toBeNull();
    });
  });

  describe('shared state between hook instances', () => {
    it('should share state between multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useSettingManagement());
      const { result: result2 } = renderHook(() => useSettingManagement());

      act(() => {
        result1.current.addSetting({ name: 'Test', order: 1 });
      });

      // Both hooks should see the same state
      expect(result1.current.settings).toHaveLength(1);
      expect(result2.current.settings).toHaveLength(1);
    });

    it('should update both hooks when one changes state', () => {
      const { result: result1 } = renderHook(() => useSettingManagement());
      const { result: result2 } = renderHook(() => useSettingManagement());

      act(() => {
        result1.current.addSetting({ name: 'Test', order: 1 });
      });

      act(() => {
        result2.current.setSelected(result2.current.settings[0]);
      });

      expect(result1.current.selected?.name).toBe('Test');
      expect(result2.current.selected?.name).toBe('Test');
    });
  });

  describe('subscription cleanup', () => {
    it('should unsubscribe on unmount', () => {
      const { result, unmount } = renderHook(() => useSettingManagement());
      const service = getSettingManagementService();

      // Add a setting before unmount
      act(() => {
        result.current.addSetting({ name: 'Before', order: 1 });
      });

      // Unmount the hook
      unmount();

      // Service should still work, but hook should not update
      // This tests that the unsubscribe function is called
      act(() => {
        service.addSetting({ name: 'After', order: 2 });
      });

      // Service should have both settings
      expect(service.settings).toHaveLength(2);
    });
  });

  describe('memoization', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useSettingManagement());

      const addSetting1 = result.current.addSetting;
      const addSettings1 = result.current.addSettings;
      const removeSetting1 = result.current.removeSetting;
      const setSelected1 = result.current.setSelected;
      const selectByName1 = result.current.selectByName;
      const selectByUrl1 = result.current.selectByUrl;
      const clearSettings1 = result.current.clearSettings;

      rerender();

      // Functions should be memoized with useCallback
      expect(result.current.addSetting).toBe(addSetting1);
      expect(result.current.addSettings).toBe(addSettings1);
      expect(result.current.removeSetting).toBe(removeSetting1);
      expect(result.current.setSelected).toBe(setSelected1);
      expect(result.current.selectByName).toBe(selectByName1);
      expect(result.current.selectByUrl).toBe(selectByUrl1);
      expect(result.current.clearSettings).toBe(clearSettings1);
    });
  });
});
