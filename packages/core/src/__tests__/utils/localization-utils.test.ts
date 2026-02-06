/**
 * Tests for Localization Utilities
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import {
  getLocaleDirection,
  createLocalizer,
  createLocalizerWithFallback,
  createLocalizationPipeKeyGenerator,
} from '../../utils/localization-utils';
import { ApplicationConfiguration } from '../../models/application-configuration';

describe('localization-utils', () => {
  describe('getLocaleDirection', () => {
    describe('LTR locales', () => {
      it('should return ltr for English', () => {
        expect(getLocaleDirection('en')).toBe('ltr');
      });

      it('should return ltr for French', () => {
        expect(getLocaleDirection('fr')).toBe('ltr');
      });

      it('should return ltr for German', () => {
        expect(getLocaleDirection('de')).toBe('ltr');
      });

      it('should return ltr for Spanish', () => {
        expect(getLocaleDirection('es')).toBe('ltr');
      });

      it('should return ltr for Chinese', () => {
        expect(getLocaleDirection('zh')).toBe('ltr');
      });

      it('should return ltr for Japanese', () => {
        expect(getLocaleDirection('ja')).toBe('ltr');
      });

      it('should return ltr for Korean', () => {
        expect(getLocaleDirection('ko')).toBe('ltr');
      });

      it('should return ltr for Portuguese', () => {
        expect(getLocaleDirection('pt')).toBe('ltr');
      });

      it('should return ltr for Russian', () => {
        expect(getLocaleDirection('ru')).toBe('ltr');
      });

      it('should return ltr for Turkish', () => {
        expect(getLocaleDirection('tr')).toBe('ltr');
      });
    });

    describe('RTL locales', () => {
      it('should return rtl for Arabic', () => {
        expect(getLocaleDirection('ar')).toBe('rtl');
      });

      it('should return rtl for Hebrew', () => {
        expect(getLocaleDirection('he')).toBe('rtl');
      });

      it('should return rtl for Persian/Farsi', () => {
        expect(getLocaleDirection('fa')).toBe('rtl');
      });

      it('should return rtl for Urdu', () => {
        expect(getLocaleDirection('ur')).toBe('rtl');
      });

      it('should return rtl for Pashto', () => {
        expect(getLocaleDirection('ps')).toBe('rtl');
      });

      it('should return rtl for Kurdish', () => {
        expect(getLocaleDirection('ku')).toBe('rtl');
      });

      it('should return rtl for Yiddish', () => {
        expect(getLocaleDirection('yi')).toBe('rtl');
      });

      it('should return rtl for Divehi', () => {
        expect(getLocaleDirection('dv')).toBe('rtl');
      });

      it('should return rtl for Hausa', () => {
        expect(getLocaleDirection('ha')).toBe('rtl');
      });

      it('should return rtl for Kashmiri', () => {
        expect(getLocaleDirection('ks')).toBe('rtl');
      });
    });

    describe('locale with region code', () => {
      it('should return ltr for en-US', () => {
        expect(getLocaleDirection('en-US')).toBe('ltr');
      });

      it('should return ltr for en-GB', () => {
        expect(getLocaleDirection('en-GB')).toBe('ltr');
      });

      it('should return rtl for ar-SA', () => {
        expect(getLocaleDirection('ar-SA')).toBe('rtl');
      });

      it('should return rtl for ar-EG', () => {
        expect(getLocaleDirection('ar-EG')).toBe('rtl');
      });

      it('should return rtl for he-IL', () => {
        expect(getLocaleDirection('he-IL')).toBe('rtl');
      });

      it('should return rtl for fa-IR', () => {
        expect(getLocaleDirection('fa-IR')).toBe('rtl');
      });
    });

    describe('case insensitivity', () => {
      it('should handle uppercase locale', () => {
        expect(getLocaleDirection('AR')).toBe('rtl');
      });

      it('should handle mixed case locale', () => {
        expect(getLocaleDirection('Ar-SA')).toBe('rtl');
      });
    });
  });

  describe('createLocalizer', () => {
    const mockLocalization: ApplicationConfiguration.Localization = {
      currentCulture: {} as any,
      defaultResourceName: 'AbpCore',
      languages: [],
      languagesMap: {},
      languageFilesMap: {},
      values: {
        AbpCore: {
          Hello: 'Hello',
          Welcome: 'Welcome to ABP!',
          Goodbye: 'Goodbye',
        },
        AbpIdentity: {
          UserName: 'User Name',
          Password: 'Password',
        },
      },
    };

    it('should return localized string when resource and key exist', () => {
      const localizer = createLocalizer(mockLocalization);
      expect(localizer('AbpCore', 'Hello', 'Default')).toBe('Hello');
    });

    it('should return localized string from different resource', () => {
      const localizer = createLocalizer(mockLocalization);
      expect(localizer('AbpIdentity', 'UserName', 'Default')).toBe('User Name');
    });

    it('should return default value when resource does not exist', () => {
      const localizer = createLocalizer(mockLocalization);
      expect(localizer('NonExistent', 'Hello', 'Default Value')).toBe('Default Value');
    });

    it('should return default value when key does not exist', () => {
      const localizer = createLocalizer(mockLocalization);
      expect(localizer('AbpCore', 'NonExistent', 'Default Value')).toBe('Default Value');
    });

    it('should return default value when localization is null', () => {
      const localizer = createLocalizer(null as any);
      expect(localizer('AbpCore', 'Hello', 'Default')).toBe('Default');
    });

    it('should return default value when values is undefined', () => {
      const emptyLocalization: ApplicationConfiguration.Localization = {
        currentCulture: {} as any,
        defaultResourceName: 'AbpCore',
        languages: [],
        languagesMap: {},
        languageFilesMap: {},
        values: undefined as any,
      };
      const localizer = createLocalizer(emptyLocalization);
      expect(localizer('AbpCore', 'Hello', 'Default')).toBe('Default');
    });
  });

  describe('createLocalizerWithFallback', () => {
    const mockLocalization: ApplicationConfiguration.Localization = {
      currentCulture: {} as any,
      defaultResourceName: 'AbpCore',
      languages: [],
      languagesMap: {},
      languageFilesMap: {},
      values: {
        AbpCore: {
          Hello: 'Hello from Core',
          CoreOnly: 'Core Only Value',
        },
        AbpIdentity: {
          Hello: 'Hello from Identity',
          IdentityOnly: 'Identity Only Value',
        },
        AbpAccount: {
          Login: 'Login',
        },
      },
    };

    it('should return value from first resource when it exists', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(localizer(['AbpCore', 'AbpIdentity'], ['Hello'], 'Default')).toBe('Hello from Core');
    });

    it('should fallback to second resource when first does not have the key', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(localizer(['AbpCore', 'AbpIdentity'], ['IdentityOnly'], 'Default')).toBe(
        'Identity Only Value'
      );
    });

    it('should try multiple keys in order', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(localizer(['AbpCore'], ['NonExistent', 'Hello'], 'Default')).toBe('Hello from Core');
    });

    it('should return default when no resource has any key', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(
        localizer(['AbpCore', 'AbpIdentity'], ['NonExistent1', 'NonExistent2'], 'Default Value')
      ).toBe('Default Value');
    });

    it('should return default when resources do not exist', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(localizer(['NonExistent'], ['Hello'], 'Default')).toBe('Default');
    });

    it('should return default when localization is null', () => {
      const localizer = createLocalizerWithFallback(null as any);
      expect(localizer(['AbpCore'], ['Hello'], 'Default')).toBe('Default');
    });

    it('should return default when values is undefined', () => {
      const emptyLocalization: ApplicationConfiguration.Localization = {
        currentCulture: {} as any,
        defaultResourceName: 'AbpCore',
        languages: [],
        languagesMap: {},
        languageFilesMap: {},
        values: undefined as any,
      };
      const localizer = createLocalizerWithFallback(emptyLocalization);
      expect(localizer(['AbpCore'], ['Hello'], 'Default')).toBe('Default');
    });

    it('should skip resources that do not exist and continue checking', () => {
      const localizer = createLocalizerWithFallback(mockLocalization);
      expect(localizer(['NonExistent', 'AbpAccount'], ['Login'], 'Default')).toBe('Login');
    });
  });

  describe('createLocalizationPipeKeyGenerator', () => {
    const mockLocalization: ApplicationConfiguration.Localization = {
      currentCulture: {} as any,
      defaultResourceName: 'AbpCore',
      languages: [],
      languagesMap: {},
      languageFilesMap: {},
      values: {
        AbpCore: {
          Hello: 'Hello',
          CoreOnly: 'Core Only',
        },
        AbpIdentity: {
          UserName: 'User Name',
          IdentityOnly: 'Identity Only',
        },
      },
    };

    it('should return resource::key format when key exists', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['AbpCore'], ['Hello'], 'default')).toBe('AbpCore::Hello');
    });

    it('should return key from first resource that has it', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['AbpCore', 'AbpIdentity'], ['Hello'], 'default')).toBe('AbpCore::Hello');
    });

    it('should fallback to second resource if first does not have key', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['AbpCore', 'AbpIdentity'], ['IdentityOnly'], 'default')).toBe(
        'AbpIdentity::IdentityOnly'
      );
    });

    it('should try multiple keys in order', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['AbpCore'], ['NonExistent', 'Hello'], 'default')).toBe('AbpCore::Hello');
    });

    it('should return default key when no match found', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['AbpCore'], ['NonExistent'], 'defaultKey')).toBe('defaultKey');
    });

    it('should return default key when resources do not exist', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['NonExistent'], ['Hello'], 'defaultKey')).toBe('defaultKey');
    });

    it('should return default key when localization is null', () => {
      const generator = createLocalizationPipeKeyGenerator(null as any);
      expect(generator(['AbpCore'], ['Hello'], 'defaultKey')).toBe('defaultKey');
    });

    it('should return default key when values is undefined', () => {
      const emptyLocalization: ApplicationConfiguration.Localization = {
        currentCulture: {} as any,
        defaultResourceName: 'AbpCore',
        languages: [],
        languagesMap: {},
        languageFilesMap: {},
        values: undefined as any,
      };
      const generator = createLocalizationPipeKeyGenerator(emptyLocalization);
      expect(generator(['AbpCore'], ['Hello'], 'defaultKey')).toBe('defaultKey');
    });

    it('should skip non-existent resources and find key in later resource', () => {
      const generator = createLocalizationPipeKeyGenerator(mockLocalization);
      expect(generator(['NonExistent', 'AbpIdentity'], ['UserName'], 'default')).toBe(
        'AbpIdentity::UserName'
      );
    });
  });
});
