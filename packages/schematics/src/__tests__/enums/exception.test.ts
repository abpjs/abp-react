/**
 * Exception Tests
 */

import { describe, expect, it } from 'vitest';
import { Exception } from '../../enums/exception';

describe('Exception', () => {
  it('should have DirRemoveFailed message', () => {
    expect(Exception.DirRemoveFailed).toBe('[Directory Remove Failed] Cannot remove "{0}".');
  });

  it('should have FileNotFound message', () => {
    expect(Exception.FileNotFound).toBe('[File Not Found] There is no file at "{0}" path.');
  });

  it('should have FileWriteFailed message', () => {
    expect(Exception.FileWriteFailed).toBe('[File Write Failed] Cannot write file at "{0}".');
  });

  it('should have InvalidModule message', () => {
    expect(Exception.InvalidModule).toBe(
      '[Invalid Module] Backend module "{0}" does not exist in API definition.'
    );
  });

  it('should have InvalidApiDefinition message', () => {
    expect(Exception.InvalidApiDefinition).toBe(
      '[Invalid API Definition] The provided API definition is invalid.'
    );
  });

  it('should have InvalidWorkspace message', () => {
    expect(Exception.InvalidWorkspace).toBe(
      '[Invalid Workspace] The angular.json should be a valid JSON file.'
    );
  });

  it('should have NoApi message', () => {
    expect(Exception.NoApi).toContain('[API Not Available]');
  });

  it('should have NoProject message', () => {
    expect(Exception.NoProject).toContain('[Project Not Found]');
  });

  it('should have NoProxyConfig message', () => {
    expect(Exception.NoProxyConfig).toBe(
      '[Proxy Config Not Found] There is no JSON file at "{0}".'
    );
  });

  it('should have NoTypeDefinition message', () => {
    expect(Exception.NoTypeDefinition).toBe(
      '[Type Definition Not Found] There is no type definition for "{0}".'
    );
  });

  it('should have NoWorkspace message', () => {
    expect(Exception.NoWorkspace).toContain('[Workspace Not Found]');
  });

  it('should have NoEnvironment message', () => {
    expect(Exception.NoEnvironment).toBe(
      '[Environment Not Found] An environment file cannot be located in "{0}" project.'
    );
  });

  it('should have NoApiUrl message', () => {
    expect(Exception.NoApiUrl).toContain('[API URL Not Found]');
  });

  it('should have NoRootNamespace message', () => {
    expect(Exception.NoRootNamespace).toContain('[Root Namespace Not Found]');
  });
});
