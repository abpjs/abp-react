import { describe, it, expect } from 'vitest';
import { Config } from './config';
import type { ABP } from './common';

describe('Config namespace (v3.1.0)', () => {
  describe('Config.Application interface', () => {
    it('should support baseUrl property (v3.1.0)', () => {
      const application: Config.Application = {
        name: 'Test App',
        baseUrl: 'https://app.example.com',
        logoUrl: '/logo.png',
      };

      expect(application.baseUrl).toBe('https://app.example.com');
    });

    it('should allow baseUrl to be undefined', () => {
      const application: Config.Application = {
        name: 'Test App',
      };

      expect(application.baseUrl).toBeUndefined();
    });

    it('should support existing properties', () => {
      const application: Config.Application = {
        name: 'My Application',
        logoUrl: '/assets/logo.svg',
      };

      expect(application.name).toBe('My Application');
      expect(application.logoUrl).toBe('/assets/logo.svg');
    });
  });

  describe('Config.ApiConfig interface', () => {
    it('should support rootNamespace property (v3.1.0)', () => {
      const apiConfig: Config.ApiConfig = {
        url: 'https://api.example.com',
        rootNamespace: 'MyApp.API',
      };

      expect(apiConfig.rootNamespace).toBe('MyApp.API');
    });

    it('should allow rootNamespace to be undefined', () => {
      const apiConfig: Config.ApiConfig = {
        url: 'https://api.example.com',
      };

      expect(apiConfig.rootNamespace).toBeUndefined();
    });

    it('should support additional properties', () => {
      const apiConfig: Config.ApiConfig = {
        url: 'https://api.example.com',
        rootNamespace: 'MyApp',
        customKey: 'custom-value',
      };

      expect(apiConfig['customKey']).toBe('custom-value');
    });
  });

  describe('Config.RemoteEnv interface (v3.1.0)', () => {
    it('should support deepmerge strategy', () => {
      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'deepmerge',
      };

      expect(remoteEnv.mergeStrategy).toBe('deepmerge');
    });

    it('should support overwrite strategy', () => {
      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'overwrite',
      };

      expect(remoteEnv.mergeStrategy).toBe('overwrite');
    });

    it('should support custom merge function strategy', () => {
      const customMerge: Config.customMergeFn = (localEnv, remoteEnv) => {
        return {
          ...localEnv,
          ...remoteEnv,
          production: localEnv.production ?? false,
          oAuthConfig: localEnv.oAuthConfig!,
          apis: localEnv.apis!,
        };
      };

      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: customMerge,
      };

      expect(typeof remoteEnv.mergeStrategy).toBe('function');
    });

    it('should support optional method property', () => {
      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'deepmerge',
        method: 'POST',
      };

      expect(remoteEnv.method).toBe('POST');
    });

    it('should support optional headers property', () => {
      const headers: ABP.Dictionary<string> = {
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'value',
      };

      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'deepmerge',
        headers,
      };

      expect(remoteEnv.headers?.['Authorization']).toBe('Bearer token');
    });

    it('should have required url property', () => {
      const remoteEnv: Config.RemoteEnv = {
        url: 'https://config.example.com/env.json',
        mergeStrategy: 'overwrite',
      };

      expect(remoteEnv.url).toBe('https://config.example.com/env.json');
    });
  });

  describe('Config.Environment interface', () => {
    it('should support remoteEnv property (v3.1.0)', () => {
      const environment: Config.Environment = {
        apis: {
          default: { url: 'https://api.example.com' },
        },
        oAuthConfig: {
          client_id: 'test-client',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        },
        production: true,
        remoteEnv: {
          url: 'https://config.example.com/env.json',
          mergeStrategy: 'deepmerge',
        },
      };

      expect(environment.remoteEnv).toBeDefined();
      expect(environment.remoteEnv?.url).toBe('https://config.example.com/env.json');
    });

    it('should allow remoteEnv to be undefined', () => {
      const environment: Config.Environment = {
        apis: {
          default: { url: 'https://api.example.com' },
        },
        oAuthConfig: {
          client_id: 'test-client',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        },
        production: true,
      };

      expect(environment.remoteEnv).toBeUndefined();
    });

    it('should support application with baseUrl', () => {
      const environment: Config.Environment = {
        apis: {
          default: { url: 'https://api.example.com' },
        },
        oAuthConfig: {
          client_id: 'test-client',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        },
        production: true,
        application: {
          name: 'Test App',
          baseUrl: 'https://app.example.com',
        },
      };

      expect(environment.application?.baseUrl).toBe('https://app.example.com');
    });
  });

  describe('Config.Apis interface', () => {
    it('should require default API config', () => {
      const apis: Config.Apis = {
        default: { url: 'https://api.example.com' },
      };

      expect(apis.default.url).toBe('https://api.example.com');
    });

    it('should support multiple API configs with rootNamespace', () => {
      const apis: Config.Apis = {
        default: { url: 'https://api.example.com', rootNamespace: 'Default' },
        identity: { url: 'https://identity.example.com', rootNamespace: 'Identity' },
        cms: { url: 'https://cms.example.com', rootNamespace: 'CMS' },
      };

      expect(apis.identity.rootNamespace).toBe('Identity');
      expect(apis.cms.rootNamespace).toBe('CMS');
    });
  });

  describe('customMergeFn type', () => {
    it('should define correct function signature', () => {
      const customMerge: Config.customMergeFn = (localEnv, remoteEnv) => {
        const result: Config.Environment = {
          production: localEnv.production ?? remoteEnv.production ?? false,
          oAuthConfig: localEnv.oAuthConfig ?? remoteEnv.oAuthConfig,
          apis: {
            ...remoteEnv.apis,
            ...localEnv.apis,
            default: localEnv.apis?.default ?? remoteEnv.apis?.default ?? { url: '' },
          },
          application: {
            ...remoteEnv.application,
            ...localEnv.application,
            name: localEnv.application?.name ?? remoteEnv.application?.name ?? '',
          },
        };
        return result;
      };

      const localEnv: Partial<Config.Environment> = {
        production: false,
        apis: { default: { url: 'https://local.api.com' } },
      };

      const remoteEnv = {
        production: true,
        apis: { default: { url: 'https://remote.api.com' } },
        application: { name: 'Remote App' },
      };

      const result = customMerge(localEnv, remoteEnv);

      // Local should override remote
      expect(result.production).toBe(false);
      expect(result.apis.default.url).toBe('https://local.api.com');
      expect(result.application?.name).toBe('Remote App');
    });
  });
});
