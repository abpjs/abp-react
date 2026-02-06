import { describe, it, expect } from 'vitest';
import { ABP } from './common';

describe('ABP namespace (v3.1.0)', () => {
  describe('ABP.Lookup interface', () => {
    it('should allow creating lookup objects', () => {
      const lookup: ABP.Lookup = {
        id: 'lookup-123',
        displayName: 'Test Item',
      };

      expect(lookup.id).toBe('lookup-123');
      expect(lookup.displayName).toBe('Test Item');
    });

    it('should be usable in arrays for dropdowns', () => {
      const lookups: ABP.Lookup[] = [
        { id: '1', displayName: 'Option 1' },
        { id: '2', displayName: 'Option 2' },
        { id: '3', displayName: 'Option 3' },
      ];

      expect(lookups).toHaveLength(3);
      expect(lookups[0].displayName).toBe('Option 1');
    });

    it('should support finding by id', () => {
      const lookups: ABP.Lookup[] = [
        { id: 'user-1', displayName: 'John Doe' },
        { id: 'user-2', displayName: 'Jane Smith' },
      ];

      const found = lookups.find((l) => l.id === 'user-2');

      expect(found?.displayName).toBe('Jane Smith');
    });
  });

  describe('ABP.Root interface', () => {
    it('should support cultureNameLocaleFileMap option (v3.1.0)', () => {
      const root: ABP.Root = {
        environment: {},
        cultureNameLocaleFileMap: {
          'zh-Hans': 'zh-cn',
          'zh-Hant': 'zh-tw',
        },
      };

      expect(root.cultureNameLocaleFileMap).toBeDefined();
      expect(root.cultureNameLocaleFileMap?.['zh-Hans']).toBe('zh-cn');
    });

    it('should allow cultureNameLocaleFileMap to be undefined', () => {
      const root: ABP.Root = {
        environment: {},
      };

      expect(root.cultureNameLocaleFileMap).toBeUndefined();
    });

    it('should support existing options', () => {
      const root: ABP.Root = {
        environment: {
          production: true,
        },
        skipGetAppConfiguration: true,
        sendNullsAsQueryParam: true,
        cultureNameLocaleFileMap: {},
      };

      expect(root.skipGetAppConfiguration).toBe(true);
      expect(root.sendNullsAsQueryParam).toBe(true);
    });
  });

  describe('ABP.Dictionary interface', () => {
    it('should work as generic dictionary', () => {
      const stringDict: ABP.Dictionary<string> = {
        key1: 'value1',
        key2: 'value2',
      };

      expect(stringDict['key1']).toBe('value1');
    });

    it('should work with cultureNameLocaleFileMap', () => {
      const cultureMap: ABP.Dictionary<string> = {
        'en-US': 'en',
        'fr-FR': 'fr',
        'de-DE': 'de',
      };

      const root: ABP.Root = {
        environment: {},
        cultureNameLocaleFileMap: cultureMap,
      };

      expect(root.cultureNameLocaleFileMap?.['en-US']).toBe('en');
    });
  });

  describe('ABP.PageQueryParams interface', () => {
    it('should support all query params', () => {
      const params: ABP.PageQueryParams = {
        filter: 'search term',
        sorting: 'name asc',
        skipCount: 10,
        maxResultCount: 25,
      };

      expect(params.filter).toBe('search term');
      expect(params.sorting).toBe('name asc');
      expect(params.skipCount).toBe(10);
      expect(params.maxResultCount).toBe(25);
    });

    it('should allow partial params', () => {
      const params: ABP.PageQueryParams = {
        maxResultCount: 10,
      };

      expect(params.filter).toBeUndefined();
      expect(params.maxResultCount).toBe(10);
    });
  });

  describe('ABP.PagedResponse interface', () => {
    it('should combine items and totalCount', () => {
      const response: ABP.PagedResponse<string> = {
        items: ['a', 'b', 'c'],
        totalCount: 100,
      };

      expect(response.items).toHaveLength(3);
      expect(response.totalCount).toBe(100);
    });
  });

  describe('ABP.BasicItem interface', () => {
    it('should have id and name', () => {
      const item: ABP.BasicItem = {
        id: 'item-123',
        name: 'Basic Item',
      };

      expect(item.id).toBe('item-123');
      expect(item.name).toBe('Basic Item');
    });
  });
});
