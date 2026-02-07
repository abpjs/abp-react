import { describe, it, expect } from 'vitest';
import {
  eAccountManageProfileTabNames,
  type AccountManageProfileTabName,
} from '../../../config/enums/manage-profile-tab-names';

describe('eAccountManageProfileTabNames (v3.2.0)', () => {
  describe('enum values', () => {
    it('should have ProfilePicture key with correct value', () => {
      expect(eAccountManageProfileTabNames.ProfilePicture).toBe(
        'AbpAccount::ProfilePicture'
      );
    });

    it('should have ChangePassword key with correct value', () => {
      expect(eAccountManageProfileTabNames.ChangePassword).toBe(
        'AbpUi::ChangePassword'
      );
    });

    it('should have PersonalSettings key with correct value', () => {
      expect(eAccountManageProfileTabNames.PersonalSettings).toBe(
        'AbpAccount::PersonalSettings'
      );
    });

    it('should have TwoFactor key with correct value', () => {
      expect(eAccountManageProfileTabNames.TwoFactor).toBe(
        'AbpAccount::AccountSettingsTwoFactor'
      );
    });
  });

  describe('enum structure', () => {
    it('should be a const object (readonly at compile time)', () => {
      expect(typeof eAccountManageProfileTabNames).toBe('object');
      expect(eAccountManageProfileTabNames).not.toBeNull();
    });

    it('should have exactly 4 keys', () => {
      const keys = Object.keys(eAccountManageProfileTabNames);
      expect(keys).toHaveLength(4);
    });

    it('should contain all expected keys', () => {
      const keys = Object.keys(eAccountManageProfileTabNames);
      expect(keys).toContain('ProfilePicture');
      expect(keys).toContain('ChangePassword');
      expect(keys).toContain('PersonalSettings');
      expect(keys).toContain('TwoFactor');
    });

    it('should have all values be strings', () => {
      Object.values(eAccountManageProfileTabNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have all values be localization keys', () => {
      // ABP localization keys follow the pattern: Resource::Key
      Object.values(eAccountManageProfileTabNames).forEach((value) => {
        expect(value).toMatch(/^Abp\w+::\w+/);
      });
    });
  });

  describe('type safety', () => {
    it('should work with AccountManageProfileTabName type', () => {
      const profilePictureKey: AccountManageProfileTabName =
        eAccountManageProfileTabNames.ProfilePicture;
      const changePasswordKey: AccountManageProfileTabName =
        eAccountManageProfileTabNames.ChangePassword;
      const personalSettingsKey: AccountManageProfileTabName =
        eAccountManageProfileTabNames.PersonalSettings;
      const twoFactorKey: AccountManageProfileTabName =
        eAccountManageProfileTabNames.TwoFactor;

      expect(profilePictureKey).toBe('AbpAccount::ProfilePicture');
      expect(changePasswordKey).toBe('AbpUi::ChangePassword');
      expect(personalSettingsKey).toBe('AbpAccount::PersonalSettings');
      expect(twoFactorKey).toBe('AbpAccount::AccountSettingsTwoFactor');
    });

    it('should preserve literal types', () => {
      const value = eAccountManageProfileTabNames.ProfilePicture;
      expect(value).toBe('AbpAccount::ProfilePicture');

      // TypeScript will infer this as the literal type
      const exactValue: 'AbpAccount::ProfilePicture' =
        eAccountManageProfileTabNames.ProfilePicture;
      expect(exactValue).toBe('AbpAccount::ProfilePicture');
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all tab names', () => {
      const allNames = Object.values(eAccountManageProfileTabNames);
      expect(allNames).toHaveLength(4);
      expect(allNames.every((name) => typeof name === 'string')).toBe(true);
    });

    it('should allow lookup by key name', () => {
      const keyName =
        'PersonalSettings' as keyof typeof eAccountManageProfileTabNames;
      const value = eAccountManageProfileTabNames[keyName];
      expect(value).toBe('AbpAccount::PersonalSettings');
    });

    it('should work in object mapping', () => {
      const tabConfig: Record<AccountManageProfileTabName, boolean> = {
        [eAccountManageProfileTabNames.ProfilePicture]: true,
        [eAccountManageProfileTabNames.ChangePassword]: true,
        [eAccountManageProfileTabNames.PersonalSettings]: true,
        [eAccountManageProfileTabNames.TwoFactor]: false,
      };

      expect(
        tabConfig[eAccountManageProfileTabNames.ProfilePicture]
      ).toBe(true);
      expect(tabConfig[eAccountManageProfileTabNames.TwoFactor]).toBe(false);
      expect(Object.keys(tabConfig)).toHaveLength(4);
    });

    it('should work in switch statements', () => {
      const getTabLabel = (tabName: AccountManageProfileTabName): string => {
        switch (tabName) {
          case eAccountManageProfileTabNames.ProfilePicture:
            return 'Profile Picture';
          case eAccountManageProfileTabNames.ChangePassword:
            return 'Change Password';
          case eAccountManageProfileTabNames.PersonalSettings:
            return 'Personal Settings';
          case eAccountManageProfileTabNames.TwoFactor:
            return 'Two-Factor Authentication';
          default:
            return 'Unknown';
        }
      };

      expect(getTabLabel(eAccountManageProfileTabNames.ProfilePicture)).toBe(
        'Profile Picture'
      );
      expect(getTabLabel(eAccountManageProfileTabNames.ChangePassword)).toBe(
        'Change Password'
      );
      expect(getTabLabel(eAccountManageProfileTabNames.PersonalSettings)).toBe(
        'Personal Settings'
      );
      expect(getTabLabel(eAccountManageProfileTabNames.TwoFactor)).toBe(
        'Two-Factor Authentication'
      );
    });
  });

  describe('localization resource mapping', () => {
    it('should use AbpAccount resource for most tabs', () => {
      expect(eAccountManageProfileTabNames.ProfilePicture).toMatch(
        /^AbpAccount::/
      );
      expect(eAccountManageProfileTabNames.PersonalSettings).toMatch(
        /^AbpAccount::/
      );
      expect(eAccountManageProfileTabNames.TwoFactor).toMatch(/^AbpAccount::/);
    });

    it('should use AbpUi resource for ChangePassword', () => {
      // ChangePassword is a common UI element, so it uses AbpUi resource
      expect(eAccountManageProfileTabNames.ChangePassword).toMatch(/^AbpUi::/);
    });

    it('should have consistent naming pattern for account-specific tabs', () => {
      // Account-specific tabs should use AbpAccount resource
      const accountTabs = Object.values(eAccountManageProfileTabNames).filter(
        (value) => value.startsWith('AbpAccount::')
      );
      expect(accountTabs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('tab ordering scenarios', () => {
    it('should provide all standard profile tabs', () => {
      const standardTabs = [
        eAccountManageProfileTabNames.ProfilePicture,
        eAccountManageProfileTabNames.ChangePassword,
        eAccountManageProfileTabNames.PersonalSettings,
        eAccountManageProfileTabNames.TwoFactor,
      ];

      expect(standardTabs).toHaveLength(4);
      expect(
        standardTabs.every((tab) => typeof tab === 'string' && tab.length > 0)
      ).toBe(true);
    });
  });
});
