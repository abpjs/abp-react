/**
 * Generic Type Tree Parser Tests
 */

import { describe, expect, it } from 'vitest';
import { TypeNode, parseGenerics } from '../../utils/generics';

describe('Generics Utils', () => {
  describe('TypeNode', () => {
    it('should create a node with data', () => {
      const node = new TypeNode('string', null);
      expect(node.data).toBe('string');
      expect(node.parent).toBeNull();
      expect(node.children).toEqual([]);
      expect(node.index).toBe(0);
    });

    it('should use default mapper that returns data', () => {
      const node = new TypeNode('string', null);
      expect(node.toString()).toBe('string');
    });

    it('should use custom mapper', () => {
      const node = new TypeNode('System.String', null, (n) => n.data.split('.').pop()!);
      expect(node.toString()).toBe('String');
    });

    describe('toGenerics', () => {
      it('should return data for leaf node', () => {
        const node = new TypeNode('string', null);
        expect(node.toGenerics()).toEqual(['string']);
      });

      it('should return generic placeholders for nodes with children', () => {
        const root = new TypeNode('List', null);
        const child = new TypeNode('User', root);
        child.index = 0;
        root.children.push(child);
        expect(root.toGenerics()).toEqual(['List<T0>', 'User']);
      });
    });

    describe('valueOf', () => {
      it('should return toString value', () => {
        const node = new TypeNode('string', null);
        expect(node.valueOf()).toBe('string');
      });
    });
  });

  describe('parseGenerics', () => {
    it('should parse simple type', () => {
      const root = parseGenerics('string');
      expect(root.data).toBe('string');
      expect(root.children).toHaveLength(0);
    });

    it('should parse single generic type', () => {
      const root = parseGenerics('List<User>');
      expect(root.data).toBe('List');
      expect(root.children).toHaveLength(1);
      expect(root.children[0].data).toBe('User');
    });

    it('should parse nested generics', () => {
      const root = parseGenerics('List<Dictionary<string, User>>');
      expect(root.data).toBe('List');
      expect(root.children).toHaveLength(1);
      const dict = root.children[0];
      expect(dict.data).toBe('Dictionary');
      // The parser treats 'string, User' as a single compound child
      // since comma-separated args at the same level are handled by flattenDictionaryTypes
      expect(dict.children).toHaveLength(1);
      expect(dict.children[0].data).toBe('string, User');
    });

    it('should generate generic placeholders via toGenerics', () => {
      const root = parseGenerics('List<User>');
      expect(root.toGenerics()).toEqual(['List<T0>', 'User']);
    });

    it('should apply mapper function in toString', () => {
      const root = parseGenerics('System.String', (node) =>
        node.data === 'System.String' ? 'string' : node.data
      );
      expect(root.toString()).toBe('string');
    });

    it('should handle multiple generic args', () => {
      const root = parseGenerics('Dictionary<string, number>');
      expect(root.data).toBe('Dictionary');
      // The parser handles comma-separated args as a single compound child
      expect(root.children).toHaveLength(1);
      expect(root.children[0].data).toBe('string, number');
    });
  });
});
