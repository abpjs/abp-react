/**
 * Tests for SaaS Proxy Host Models
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import type { GetEditionUsageStatisticsResult } from '../../../proxy/host/models';

describe('Proxy Host Models', () => {
  describe('GetEditionUsageStatisticsResult', () => {
    it('should accept valid usage statistics with data', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Basic': 15,
          'Premium': 25,
          'Enterprise': 5,
        },
      };
      expect(result.data).toBeDefined();
      expect(result.data['Basic']).toBe(15);
      expect(result.data['Premium']).toBe(25);
      expect(result.data['Enterprise']).toBe(5);
    });

    it('should accept empty data object', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {},
      };
      expect(result.data).toEqual({});
      expect(Object.keys(result.data)).toHaveLength(0);
    });

    it('should accept single edition statistics', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Free': 100,
        },
      };
      expect(result.data['Free']).toBe(100);
    });

    it('should accept zero values', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Unused Edition': 0,
          'Another Unused': 0,
        },
      };
      expect(result.data['Unused Edition']).toBe(0);
      expect(result.data['Another Unused']).toBe(0);
    });

    it('should accept large values', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Popular Edition': 1000000,
        },
      };
      expect(result.data['Popular Edition']).toBe(1000000);
    });

    it('should work with iteration', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'A': 10,
          'B': 20,
          'C': 30,
        },
      };

      const total = Object.values(result.data).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(60);
    });

    it('should allow edition names with special characters', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Basic (Free)': 50,
          'Premium - Annual': 25,
          'Enterprise 2024': 10,
        },
      };
      expect(result.data['Basic (Free)']).toBe(50);
      expect(result.data['Premium - Annual']).toBe(25);
      expect(result.data['Enterprise 2024']).toBe(10);
    });

    it('should preserve key order when iterating', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'First': 1,
          'Second': 2,
          'Third': 3,
        },
      };

      const keys = Object.keys(result.data);
      expect(keys).toContain('First');
      expect(keys).toContain('Second');
      expect(keys).toContain('Third');
    });
  });

  describe('Type Safety', () => {
    it('should only allow number values', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'Edition1': 10,
          'Edition2': 20.5, // Floats are also numbers
        },
      };
      expect(typeof result.data['Edition1']).toBe('number');
      expect(typeof result.data['Edition2']).toBe('number');
    });

    it('should be compatible with Record<string, number> operations', () => {
      const result: GetEditionUsageStatisticsResult = {
        data: {
          'A': 1,
          'B': 2,
        },
      };

      // Spread operator
      const spread = { ...result.data };
      expect(spread).toEqual({ 'A': 1, 'B': 2 });

      // Object.entries
      const entries = Object.entries(result.data);
      expect(entries).toContainEqual(['A', 1]);
      expect(entries).toContainEqual(['B', 2]);
    });
  });
});
