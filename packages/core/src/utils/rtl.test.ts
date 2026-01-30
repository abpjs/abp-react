import { describe, it, expect } from 'vitest';
import { isRtlLanguage, getTextDirection, RTL_LANGUAGES } from './rtl';

describe('rtl utilities', () => {
  describe('RTL_LANGUAGES', () => {
    it('should include Arabic languages', () => {
      expect(RTL_LANGUAGES).toContain('ar');
      expect(RTL_LANGUAGES).toContain('ar-SA');
      expect(RTL_LANGUAGES).toContain('ar-EG');
    });

    it('should include Hebrew', () => {
      expect(RTL_LANGUAGES).toContain('he');
      expect(RTL_LANGUAGES).toContain('he-IL');
      expect(RTL_LANGUAGES).toContain('iw'); // Old code
    });

    it('should include Persian/Farsi', () => {
      expect(RTL_LANGUAGES).toContain('fa');
      expect(RTL_LANGUAGES).toContain('fa-IR');
    });

    it('should include Urdu', () => {
      expect(RTL_LANGUAGES).toContain('ur');
      expect(RTL_LANGUAGES).toContain('ur-PK');
    });

    it('should include other RTL languages', () => {
      expect(RTL_LANGUAGES).toContain('ps'); // Pashto
      expect(RTL_LANGUAGES).toContain('sd'); // Sindhi
      expect(RTL_LANGUAGES).toContain('ug'); // Uyghur
      expect(RTL_LANGUAGES).toContain('yi'); // Yiddish
      expect(RTL_LANGUAGES).toContain('dv'); // Divehi
    });
  });

  describe('isRtlLanguage', () => {
    describe('should return true for RTL languages', () => {
      it('Arabic base code', () => {
        expect(isRtlLanguage('ar')).toBe(true);
      });

      it('Arabic with region', () => {
        expect(isRtlLanguage('ar-SA')).toBe(true);
        expect(isRtlLanguage('ar-EG')).toBe(true);
        expect(isRtlLanguage('ar-AE')).toBe(true);
      });

      it('Hebrew', () => {
        expect(isRtlLanguage('he')).toBe(true);
        expect(isRtlLanguage('he-IL')).toBe(true);
      });

      it('Persian/Farsi', () => {
        expect(isRtlLanguage('fa')).toBe(true);
        expect(isRtlLanguage('fa-IR')).toBe(true);
      });

      it('Urdu', () => {
        expect(isRtlLanguage('ur')).toBe(true);
        expect(isRtlLanguage('ur-PK')).toBe(true);
      });
    });

    describe('should return false for LTR languages', () => {
      it('English', () => {
        expect(isRtlLanguage('en')).toBe(false);
        expect(isRtlLanguage('en-US')).toBe(false);
        expect(isRtlLanguage('en-GB')).toBe(false);
      });

      it('French', () => {
        expect(isRtlLanguage('fr')).toBe(false);
        expect(isRtlLanguage('fr-FR')).toBe(false);
      });

      it('German', () => {
        expect(isRtlLanguage('de')).toBe(false);
        expect(isRtlLanguage('de-DE')).toBe(false);
      });

      it('Chinese', () => {
        expect(isRtlLanguage('zh')).toBe(false);
        expect(isRtlLanguage('zh-CN')).toBe(false);
      });

      it('Japanese', () => {
        expect(isRtlLanguage('ja')).toBe(false);
        expect(isRtlLanguage('ja-JP')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(isRtlLanguage('')).toBe(false);
      });

      it('should handle null', () => {
        expect(isRtlLanguage(null)).toBe(false);
      });

      it('should handle undefined', () => {
        expect(isRtlLanguage(undefined)).toBe(false);
      });

      it('should be case-insensitive', () => {
        expect(isRtlLanguage('AR')).toBe(true);
        expect(isRtlLanguage('Ar')).toBe(true);
        expect(isRtlLanguage('AR-SA')).toBe(true);
        expect(isRtlLanguage('He-IL')).toBe(true);
      });

      it('should match by base language code', () => {
        // Even if ar-XX is not in the list, should match base 'ar'
        expect(isRtlLanguage('ar-XX')).toBe(true);
        expect(isRtlLanguage('he-XX')).toBe(true);
        expect(isRtlLanguage('fa-XX')).toBe(true);
      });
    });
  });

  describe('getTextDirection', () => {
    it('should return rtl for RTL languages', () => {
      expect(getTextDirection('ar')).toBe('rtl');
      expect(getTextDirection('ar-SA')).toBe('rtl');
      expect(getTextDirection('he')).toBe('rtl');
      expect(getTextDirection('fa')).toBe('rtl');
      expect(getTextDirection('ur')).toBe('rtl');
    });

    it('should return ltr for LTR languages', () => {
      expect(getTextDirection('en')).toBe('ltr');
      expect(getTextDirection('en-US')).toBe('ltr');
      expect(getTextDirection('fr')).toBe('ltr');
      expect(getTextDirection('de')).toBe('ltr');
      expect(getTextDirection('zh')).toBe('ltr');
    });

    it('should return ltr for empty/null/undefined', () => {
      expect(getTextDirection('')).toBe('ltr');
      expect(getTextDirection(null)).toBe('ltr');
      expect(getTextDirection(undefined)).toBe('ltr');
    });
  });
});
