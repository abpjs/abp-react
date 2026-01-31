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
});
