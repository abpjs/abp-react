/**
 * Import Model Tests
 */

import { describe, expect, it } from 'vitest';
import { eImportKeyword } from '../enums';
import { Import } from './import';

describe('Import', () => {
  it('should create with minimal options', () => {
    const importItem = new Import({ path: '@abpjs/core' });

    expect(importItem.path).toBe('@abpjs/core');
    expect(importItem.keyword).toBe(eImportKeyword.Default);
    expect(importItem.refs).toEqual([]);
    expect(importItem.specifiers).toEqual([]);
    expect(importItem.alias).toBeUndefined();
  });

  it('should create with all options', () => {
    const importItem = new Import({
      path: '@abpjs/core',
      keyword: eImportKeyword.Type,
      refs: ['ConfigState', 'SessionState'],
      specifiers: ['ConfigState', 'SessionState'],
      alias: 'CoreModule',
    });

    expect(importItem.path).toBe('@abpjs/core');
    expect(importItem.keyword).toBe(eImportKeyword.Type);
    expect(importItem.refs).toEqual(['ConfigState', 'SessionState']);
    expect(importItem.specifiers).toEqual(['ConfigState', 'SessionState']);
    expect(importItem.alias).toBe('CoreModule');
  });

  it('should override default keyword', () => {
    const importItem = new Import({
      path: './models',
      keyword: eImportKeyword.Type,
    });

    expect(importItem.keyword).toBe(eImportKeyword.Type);
  });

  it('should override default refs', () => {
    const importItem = new Import({
      path: './types',
      refs: ['Type1', 'Type2'],
    });

    expect(importItem.refs).toEqual(['Type1', 'Type2']);
  });

  it('should override default specifiers', () => {
    const importItem = new Import({
      path: './utils',
      specifiers: ['helper1', 'helper2'],
    });

    expect(importItem.specifiers).toEqual(['helper1', 'helper2']);
  });
});
