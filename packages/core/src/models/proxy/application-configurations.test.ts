import { describe, it, expect } from 'vitest';
import type {
  ApplicationAuthConfigurationDto,
  ApplicationConfigurationDto,
  ApplicationFeatureConfigurationDto,
  ApplicationLocalizationConfigurationDto,
  ApplicationSettingConfigurationDto,
  ClockDto,
  CurrentCultureDto,
  CurrentUserDto,
  DateTimeFormatDto,
  IanaTimeZone,
  TimeZone,
  TimingDto,
  WindowsTimeZone,
} from './application-configurations';

describe('proxy/application-configurations models (v4.0.0)', () => {
  describe('ApplicationConfigurationDto', () => {
    it('should create a full configuration', () => {
      const config: ApplicationConfigurationDto = {
        localization: {
          values: { AbpIdentity: { 'DisplayName:UserName': 'User name' } },
          languages: [{ cultureName: 'en', displayName: 'English' }],
          currentCulture: {
            isRightToLeft: false,
            dateTimeFormat: {},
          } as CurrentCultureDto,
          languagesMap: {},
          languageFilesMap: {},
        },
        auth: {
          policies: { 'AbpIdentity.Users': true },
          grantedPolicies: { 'AbpIdentity.Users': true },
        },
        setting: { values: { 'Abp.Localization.DefaultLanguage': 'en' } },
        currentUser: {
          isAuthenticated: true,
          id: 'user-1',
          userName: 'admin',
          email: 'admin@example.com',
          emailVerified: true,
          phoneNumberVerified: false,
          roles: ['admin'],
        } as CurrentUserDto,
        features: { values: { 'Feature.SocialLogin': 'true' } },
        multiTenancy: { isEnabled: true },
        currentTenant: { id: 'tenant-1', name: 'Default', isAvailable: true },
        timing: {
          timeZone: {
            iana: { timeZoneName: 'America/New_York' },
            windows: { timeZoneId: 'Eastern Standard Time' },
          },
        },
        clock: { kind: 'Utc' },
        objectExtensions: { modules: {}, enums: {} },
      };

      expect(config.auth.grantedPolicies['AbpIdentity.Users']).toBe(true);
      expect(config.currentUser.isAuthenticated).toBe(true);
      expect(config.multiTenancy.isEnabled).toBe(true);
      expect(config.currentTenant.name).toBe('Default');
      expect(config.timing.timeZone.iana.timeZoneName).toBe('America/New_York');
      expect(config.clock.kind).toBe('Utc');
    });
  });

  describe('ApplicationAuthConfigurationDto', () => {
    it('should store policies and granted policies', () => {
      const auth: ApplicationAuthConfigurationDto = {
        policies: { 'Policy.A': true, 'Policy.B': false },
        grantedPolicies: { 'Policy.A': true },
      };
      expect(auth.policies['Policy.A']).toBe(true);
      expect(auth.policies['Policy.B']).toBe(false);
      expect(auth.grantedPolicies['Policy.A']).toBe(true);
    });

    it('should handle empty policies', () => {
      const auth: ApplicationAuthConfigurationDto = {
        policies: {},
        grantedPolicies: {},
      };
      expect(Object.keys(auth.policies)).toHaveLength(0);
    });
  });

  describe('ApplicationLocalizationConfigurationDto', () => {
    it('should store localization values with nested resources', () => {
      const loc: ApplicationLocalizationConfigurationDto = {
        values: {
          AbpIdentity: { 'DisplayName:UserName': 'User name', 'DisplayName:Email': 'Email' },
          AbpAccount: { Login: 'Log in', Register: 'Register' },
        },
        languages: [
          { cultureName: 'en', uiCultureName: 'en', displayName: 'English' },
          { cultureName: 'tr', uiCultureName: 'tr', displayName: 'Turkish' },
        ],
        currentCulture: {
          isRightToLeft: false,
          cultureName: 'en',
          name: 'en',
          displayName: 'English',
          englishName: 'English',
          dateTimeFormat: {
            shortDatePattern: 'M/d/yyyy',
            shortTimePattern: 'h:mm tt',
          } as DateTimeFormatDto,
        } as CurrentCultureDto,
        languagesMap: {},
        languageFilesMap: {},
      };

      expect(loc.values['AbpIdentity']['DisplayName:UserName']).toBe('User name');
      expect(loc.languages).toHaveLength(2);
      expect(loc.currentCulture.isRightToLeft).toBe(false);
    });
  });

  describe('CurrentUserDto', () => {
    it('should create authenticated user', () => {
      const user: CurrentUserDto = {
        isAuthenticated: true,
        id: 'user-123',
        tenantId: 'tenant-1',
        userName: 'admin',
        name: 'Admin',
        surName: 'User',
        email: 'admin@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        phoneNumberVerified: false,
        roles: ['admin', 'moderator'],
      };
      expect(user.isAuthenticated).toBe(true);
      expect(user.roles).toContain('admin');
      expect(user.roles).toHaveLength(2);
    });

    it('should create anonymous user', () => {
      const user: CurrentUserDto = {
        isAuthenticated: false,
        emailVerified: false,
        phoneNumberVerified: false,
        roles: [],
      };
      expect(user.isAuthenticated).toBe(false);
      expect(user.id).toBeUndefined();
      expect(user.roles).toHaveLength(0);
    });
  });

  describe('CurrentCultureDto', () => {
    it('should support RTL culture', () => {
      const culture: CurrentCultureDto = {
        isRightToLeft: true,
        cultureName: 'ar',
        name: 'ar',
        displayName: 'Arabic',
        englishName: 'Arabic',
        nativeName: 'العربية',
        twoLetterIsoLanguageName: 'ar',
        threeLetterIsoLanguageName: 'ara',
        dateTimeFormat: {} as DateTimeFormatDto,
      };
      expect(culture.isRightToLeft).toBe(true);
      expect(culture.nativeName).toBe('العربية');
    });
  });

  describe('TimingDto', () => {
    it('should store timezone information', () => {
      const timing: TimingDto = {
        timeZone: {
          iana: { timeZoneName: 'Europe/London' },
          windows: { timeZoneId: 'GMT Standard Time' },
        },
      };
      expect(timing.timeZone.iana.timeZoneName).toBe('Europe/London');
      expect(timing.timeZone.windows.timeZoneId).toBe('GMT Standard Time');
    });

    it('should allow optional timezone names', () => {
      const iana: IanaTimeZone = {};
      const windows: WindowsTimeZone = {};
      const tz: TimeZone = { iana, windows };
      expect(tz.iana.timeZoneName).toBeUndefined();
      expect(tz.windows.timeZoneId).toBeUndefined();
    });
  });

  describe('ClockDto', () => {
    it('should store clock kind', () => {
      const clock: ClockDto = { kind: 'Utc' };
      expect(clock.kind).toBe('Utc');
    });

    it('should allow optional kind', () => {
      const clock: ClockDto = {};
      expect(clock.kind).toBeUndefined();
    });
  });

  describe('ApplicationFeatureConfigurationDto', () => {
    it('should store feature values', () => {
      const features: ApplicationFeatureConfigurationDto = {
        values: { 'Feature.SocialLogin': 'true', 'Feature.MaxUsers': '100' },
      };
      expect(features.values['Feature.SocialLogin']).toBe('true');
      expect(features.values['Feature.MaxUsers']).toBe('100');
    });
  });

  describe('ApplicationSettingConfigurationDto', () => {
    it('should store setting values', () => {
      const settings: ApplicationSettingConfigurationDto = {
        values: { 'Abp.Localization.DefaultLanguage': 'en' },
      };
      expect(settings.values['Abp.Localization.DefaultLanguage']).toBe('en');
    });
  });
});
