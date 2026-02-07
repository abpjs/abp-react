import { describe, it, expect, beforeEach } from 'vitest';
import { LocalizationService } from './localization.service';
import { RootState } from '../store';
import { ConfigState } from '../slices/config.slice';

describe('LocalizationService', () => {
  let service: LocalizationService;
  let mockState: RootState;

  beforeEach(() => {
    mockState = {
      config: {
        environment: {
          localization: { defaultResourceName: 'TestResource' },
        },
        requirements: { layouts: [] },
        routes: [],
        localization: {
          values: {
            TestResource: {
              Hello: 'Hello',
              Greeting: 'Hello {0}!',
              DoubleGreeting: 'Hello {0} and {1}!',
              QuotedGreeting: "Hello '{0}'!",
              Welcome: 'Welcome to the app',
            },
            OtherResource: {
              Goodbye: 'Goodbye',
            },
          },
          languages: [
            { cultureName: 'en', displayName: 'English', uiCultureName: 'en', flagIcon: 'us' },
            { cultureName: 'tr', displayName: 'Türkçe', uiCultureName: 'tr', flagIcon: 'tr' },
            { cultureName: 'de', displayName: 'Deutsch', uiCultureName: 'de', flagIcon: 'de' },
          ],
        },
        auth: { policies: {}, grantedPolicies: {} },
        setting: { values: {} },
        currentUser: { isAuthenticated: false, id: '', tenantId: '', userName: '' },
        features: { values: {} },
      } as ConfigState,
      session: {
        language: 'en',
        tenant: { id: '', name: '' },
      },
      profile: {
        profile: null,
        loading: false,
        error: null,
      },
      loader: {
        isLoading: false,
        requests: [],
      },
    };

    service = new LocalizationService(() => mockState);
  });

  describe('currentLang', () => {
    it('should return the current language from session state', () => {
      expect(service.currentLang).toBe('en');
    });

    it('should reflect changes in session language', () => {
      mockState.session.language = 'tr';
      expect(service.currentLang).toBe('tr');
    });
  });

  describe('get', () => {
    it('should return localized string for ResourceName::Key format', () => {
      expect(service.get('TestResource::Hello')).toBe('Hello');
    });

    it('should return localized string from another resource', () => {
      expect(service.get('OtherResource::Goodbye')).toBe('Goodbye');
    });

    it('should use default resource when only key is provided', () => {
      expect(service.get('Hello')).toBe('Hello');
    });

    it('should use default resource for ::Key format', () => {
      expect(service.get('::Hello')).toBe('Hello');
    });

    it('should interpolate single parameter with {0} format', () => {
      expect(service.get('TestResource::Greeting', 'World')).toBe('Hello World!');
    });

    it('should interpolate multiple parameters', () => {
      expect(service.get('TestResource::DoubleGreeting', 'Alice', 'Bob')).toBe(
        'Hello Alice and Bob!'
      );
    });

    it("should handle quoted parameter placeholders '{0}'", () => {
      // The localization service replaces '{0}' (with surrounding quotes) with the parameter value
      // Input: "Hello '{0}'!" with param 'World' -> output: "Hello 'World'!" (quotes preserved around value)
      expect(service.get('TestResource::QuotedGreeting', 'World')).toBe("Hello 'World'!");
    });

    it('should return key as default when key not found', () => {
      expect(service.get('NonExistent')).toBe('NonExistent');
    });

    it('should return key when resource not found', () => {
      expect(service.get('UnknownResource::Key')).toBe('UnknownResource::Key');
    });

    it('should handle LocalizationWithDefault object', () => {
      expect(service.get({ key: 'NonExistent', defaultValue: 'Default Value' })).toBe(
        'Default Value'
      );
    });

    it('should return localized value when key exists in LocalizationWithDefault', () => {
      expect(service.get({ key: 'TestResource::Hello', defaultValue: 'Fallback' })).toBe('Hello');
    });

    it('should handle empty key string', () => {
      expect(service.get('')).toBe('');
    });

    it('should throw error when defaultResourceName is not configured for :: prefix', () => {
      mockState.config.environment = {};
      expect(() => service.get('::Key')).toThrow('defaultResourceName');
    });

    it('should interpolate parameters multiple times if same placeholder appears', () => {
      mockState.config.localization.values.TestResource.Repeat = '{0} {0} {0}';
      expect(service.get('TestResource::Repeat', 'test')).toBe('test test test');
    });
  });

  describe('instant', () => {
    it('should work the same as get method', () => {
      expect(service.instant('TestResource::Hello')).toBe('Hello');
      expect(service.instant('TestResource::Greeting', 'World')).toBe('Hello World!');
    });

    it('should accept LocalizationWithDefault', () => {
      expect(service.instant({ key: 'NonExistent', defaultValue: 'Fallback' })).toBe('Fallback');
    });
  });

  describe('t', () => {
    it('should work the same as get method (shorthand)', () => {
      expect(service.t('TestResource::Hello')).toBe('Hello');
      expect(service.t('TestResource::Greeting', 'World')).toBe('Hello World!');
    });

    it('should accept LocalizationWithDefault', () => {
      expect(service.t({ key: 'TestResource::Hello', defaultValue: 'Fallback' })).toBe('Hello');
    });
  });

  describe('getLanguages', () => {
    it('should return all available languages', () => {
      const languages = service.getLanguages();
      expect(languages).toHaveLength(3);
      expect(languages[0].cultureName).toBe('en');
      expect(languages[1].cultureName).toBe('tr');
      expect(languages[2].cultureName).toBe('de');
    });

    it('should return empty array when no languages are configured', () => {
      mockState.config.localization.languages = [];
      expect(service.getLanguages()).toEqual([]);
    });
  });

  describe('getLocalizationValues', () => {
    it('should return all localization values', () => {
      const values = service.getLocalizationValues();
      expect(values.TestResource).toBeDefined();
      expect(values.TestResource.Hello).toBe('Hello');
      expect(values.OtherResource.Goodbye).toBe('Goodbye');
    });

    it('should return empty object when no values are configured', () => {
      mockState.config.localization.values = {};
      expect(service.getLocalizationValues()).toEqual({});
    });
  });

  describe('localize (v2.9.0)', () => {
    it('should return localized string when resource and key exist', async () => {
      const result = await service.localize('TestResource', 'Hello', 'Default');
      expect(result).toBe('Hello');
    });

    it('should return localized string from another resource', async () => {
      const result = await service.localize('OtherResource', 'Goodbye', 'Default');
      expect(result).toBe('Goodbye');
    });

    it('should return default value when resource does not exist', async () => {
      const result = await service.localize('NonExistent', 'Key', 'Default Value');
      expect(result).toBe('Default Value');
    });

    it('should return default value when key does not exist', async () => {
      const result = await service.localize('TestResource', 'NonExistentKey', 'Default Value');
      expect(result).toBe('Default Value');
    });

    it('should return default value when values is undefined', async () => {
      mockState.config.localization = undefined as any;
      const result = await service.localize('TestResource', 'Hello', 'Default');
      expect(result).toBe('Default');
    });
  });

  describe('localizeSync (v2.9.0)', () => {
    it('should return localized string when resource and key exist', () => {
      const result = service.localizeSync('TestResource', 'Hello', 'Default');
      expect(result).toBe('Hello');
    });

    it('should return localized string from another resource', () => {
      const result = service.localizeSync('OtherResource', 'Goodbye', 'Default');
      expect(result).toBe('Goodbye');
    });

    it('should return default value when resource does not exist', () => {
      const result = service.localizeSync('NonExistent', 'Key', 'Default Value');
      expect(result).toBe('Default Value');
    });

    it('should return default value when key does not exist', () => {
      const result = service.localizeSync('TestResource', 'NonExistentKey', 'Default Value');
      expect(result).toBe('Default Value');
    });

    it('should return default value when values is undefined', () => {
      mockState.config.localization = undefined as any;
      const result = service.localizeSync('TestResource', 'Hello', 'Default');
      expect(result).toBe('Default');
    });
  });

  describe('localizeWithFallback (v2.9.0)', () => {
    it('should return value from first resource when it exists', async () => {
      const result = await service.localizeWithFallback(
        ['TestResource', 'OtherResource'],
        ['Hello'],
        'Default'
      );
      expect(result).toBe('Hello');
    });

    it('should fallback to second resource when first does not have the key', async () => {
      const result = await service.localizeWithFallback(
        ['TestResource', 'OtherResource'],
        ['Goodbye'],
        'Default'
      );
      expect(result).toBe('Goodbye');
    });

    it('should try multiple keys in order', async () => {
      const result = await service.localizeWithFallback(
        ['TestResource'],
        ['NonExistent', 'Hello'],
        'Default'
      );
      expect(result).toBe('Hello');
    });

    it('should return default when no resource has any key', async () => {
      const result = await service.localizeWithFallback(
        ['TestResource', 'OtherResource'],
        ['NonExistent1', 'NonExistent2'],
        'Default Value'
      );
      expect(result).toBe('Default Value');
    });

    it('should return default when resources do not exist', async () => {
      const result = await service.localizeWithFallback(['NonExistent'], ['Hello'], 'Default');
      expect(result).toBe('Default');
    });

    it('should return default when values is undefined', async () => {
      mockState.config.localization = undefined as any;
      const result = await service.localizeWithFallback(
        ['TestResource'],
        ['Hello'],
        'Default'
      );
      expect(result).toBe('Default');
    });
  });

  describe('localizeWithFallbackSync (v2.9.0)', () => {
    it('should return value from first resource when it exists', () => {
      const result = service.localizeWithFallbackSync(
        ['TestResource', 'OtherResource'],
        ['Hello'],
        'Default'
      );
      expect(result).toBe('Hello');
    });

    it('should fallback to second resource when first does not have the key', () => {
      const result = service.localizeWithFallbackSync(
        ['TestResource', 'OtherResource'],
        ['Goodbye'],
        'Default'
      );
      expect(result).toBe('Goodbye');
    });

    it('should try multiple keys in order', () => {
      const result = service.localizeWithFallbackSync(
        ['TestResource'],
        ['NonExistent', 'Hello'],
        'Default'
      );
      expect(result).toBe('Hello');
    });

    it('should return default when no resource has any key', () => {
      const result = service.localizeWithFallbackSync(
        ['TestResource', 'OtherResource'],
        ['NonExistent1', 'NonExistent2'],
        'Default Value'
      );
      expect(result).toBe('Default Value');
    });

    it('should return default when resources do not exist', () => {
      const result = service.localizeWithFallbackSync(['NonExistent'], ['Hello'], 'Default');
      expect(result).toBe('Default');
    });

    it('should return default when values is undefined', () => {
      mockState.config.localization = undefined as any;
      const result = service.localizeWithFallbackSync(['TestResource'], ['Hello'], 'Default');
      expect(result).toBe('Default');
    });

    it('should skip non-existent resources and continue checking', () => {
      const result = service.localizeWithFallbackSync(
        ['NonExistent', 'OtherResource'],
        ['Goodbye'],
        'Default'
      );
      expect(result).toBe('Goodbye');
    });
  });

  describe('getResource (v3.2.0)', () => {
    it('should return entire resource by name', () => {
      const result = service.getResource('TestResource');

      expect(result).toEqual({
        Hello: 'Hello',
        Greeting: 'Hello {0}!',
        DoubleGreeting: 'Hello {0} and {1}!',
        QuotedGreeting: "Hello '{0}'!",
        Welcome: 'Welcome to the app',
      });
    });

    it('should return empty object for non-existent resource', () => {
      const result = service.getResource('NonExistent');

      expect(result).toEqual({});
    });

    it('should return different resource', () => {
      const result = service.getResource('OtherResource');

      expect(result).toEqual({
        Goodbye: 'Goodbye',
      });
    });

    it('should return empty object when localization values is undefined', () => {
      mockState.config.localization = undefined as any;

      const result = service.getResource('TestResource');

      expect(result).toEqual({});
    });

    it('should return empty object when localization is null', () => {
      mockState.config.localization = null as any;

      const result = service.getResource('TestResource');

      expect(result).toEqual({});
    });

    it('should handle resource with many keys', () => {
      mockState.config.localization.values['LargeResource'] = {
        Key1: 'Value1',
        Key2: 'Value2',
        Key3: 'Value3',
        Key4: 'Value4',
        Key5: 'Value5',
      };

      const result = service.getResource('LargeResource');

      expect(Object.keys(result)).toHaveLength(5);
      expect(result.Key1).toBe('Value1');
      expect(result.Key5).toBe('Value5');
    });

    it('should handle resource with special characters in keys', () => {
      mockState.config.localization.values['SpecialResource'] = {
        'Key.With.Dots': 'Dotted',
        'Key::With::Colons': 'Colons',
        'Key With Spaces': 'Spaced',
      };

      const result = service.getResource('SpecialResource');

      expect(result['Key.With.Dots']).toBe('Dotted');
      expect(result['Key::With::Colons']).toBe('Colons');
      expect(result['Key With Spaces']).toBe('Spaced');
    });
  });
});
