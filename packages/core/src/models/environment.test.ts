import { describe, it, expect } from 'vitest';
import type {
  Environment,
  ApplicationInfo,
  ApiConfig,
  Apis,
  RemoteEnv,
  customMergeFn,
} from './environment';

describe('Environment model (v4.0.0)', () => {
  describe('Environment interface', () => {
    it('should create a full environment', () => {
      const env: Environment = {
        apis: { default: { url: 'https://api.example.com' } },
        application: { name: 'My App', baseUrl: 'https://app.example.com', logoUrl: '/logo.png' },
        production: true,
        oAuthConfig: {
          client_id: 'my-client',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        } as any,
        hmr: false,
        test: false,
        localization: { defaultResourceName: 'MyResource' },
      };

      expect(env.production).toBe(true);
      expect(env.application?.name).toBe('My App');
      expect(env.apis.default.url).toBe('https://api.example.com');
      expect(env.localization?.defaultResourceName).toBe('MyResource');
    });

    it('should allow optional application', () => {
      const env: Environment = {
        apis: { default: { url: '' } },
        production: false,
        oAuthConfig: {} as any,
      };
      expect(env.application).toBeUndefined();
    });

    it('should allow optional hmr, test, localization, remoteEnv', () => {
      const env: Environment = {
        apis: { default: { url: '' } },
        production: false,
        oAuthConfig: {} as any,
      };
      expect(env.hmr).toBeUndefined();
      expect(env.test).toBeUndefined();
      expect(env.localization).toBeUndefined();
      expect(env.remoteEnv).toBeUndefined();
    });
  });

  describe('ApplicationInfo interface', () => {
    it('should store app info with all fields', () => {
      const info: ApplicationInfo = {
        name: 'My App',
        baseUrl: 'https://app.example.com',
        logoUrl: '/assets/logo.png',
      };
      expect(info.name).toBe('My App');
      expect(info.baseUrl).toBe('https://app.example.com');
      expect(info.logoUrl).toBe('/assets/logo.png');
    });

    it('should require name but allow optional baseUrl and logoUrl', () => {
      const info: ApplicationInfo = { name: 'Minimal App' };
      expect(info.name).toBe('Minimal App');
      expect(info.baseUrl).toBeUndefined();
      expect(info.logoUrl).toBeUndefined();
    });
  });

  describe('ApiConfig type', () => {
    it('should store url and additional keys', () => {
      const config: ApiConfig = { url: 'https://api.example.com' };
      expect(config.url).toBe('https://api.example.com');
    });

    it('should support rootNamespace', () => {
      const config: ApiConfig = { url: 'https://api.example.com', rootNamespace: 'MyApp' };
      expect(config.rootNamespace).toBe('MyApp');
    });
  });

  describe('Apis interface', () => {
    it('should support multiple API configurations', () => {
      const apis: Apis = {
        default: { url: 'https://api.example.com' },
        reporting: { url: 'https://reporting.example.com' },
      };
      expect(apis.default.url).toBe('https://api.example.com');
      expect(apis['reporting'].url).toBe('https://reporting.example.com');
    });
  });

  describe('RemoteEnv interface', () => {
    it('should support deepmerge strategy', () => {
      const remote: RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'deepmerge',
      };
      expect(remote.mergeStrategy).toBe('deepmerge');
    });

    it('should support overwrite strategy', () => {
      const remote: RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'overwrite',
      };
      expect(remote.mergeStrategy).toBe('overwrite');
    });

    it('should support custom merge function', () => {
      const customFn: customMergeFn = (local, remote) => ({
        ...local,
        ...remote,
        production: true,
        apis: { default: { url: '' } },
        oAuthConfig: {} as any,
      });
      const remote: RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: customFn,
      };
      expect(typeof remote.mergeStrategy).toBe('function');
    });

    it('should support optional method and headers', () => {
      const remote: RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'deepmerge',
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
      };
      expect(remote.method).toBe('POST');
      expect(remote.headers?.Authorization).toBe('Bearer token');
    });
  });
});
