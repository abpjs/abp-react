import { describe, it, expect } from 'vitest';
import { ProfilePictureType } from '../../../config/enums/profile-picture-type';

describe('ProfilePictureType (v3.2.0)', () => {
  describe('enum values', () => {
    it('should have None value equal to 0', () => {
      expect(ProfilePictureType.None).toBe(0);
    });

    it('should have Gravatar value equal to 1', () => {
      expect(ProfilePictureType.Gravatar).toBe(1);
    });

    it('should have Image value equal to 2', () => {
      expect(ProfilePictureType.Image).toBe(2);
    });
  });

  describe('enum structure', () => {
    it('should be a valid TypeScript enum', () => {
      expect(typeof ProfilePictureType).toBe('object');
      expect(ProfilePictureType).not.toBeNull();
    });

    it('should have exactly 3 named values', () => {
      // TypeScript enums with numeric values have both forward and reverse mappings
      // e.g., ProfilePictureType[0] = 'None' and ProfilePictureType['None'] = 0
      const namedKeys = Object.keys(ProfilePictureType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toHaveLength(3);
    });

    it('should contain all expected keys', () => {
      const namedKeys = Object.keys(ProfilePictureType).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toContain('None');
      expect(namedKeys).toContain('Gravatar');
      expect(namedKeys).toContain('Image');
    });

    it('should have numeric values', () => {
      expect(typeof ProfilePictureType.None).toBe('number');
      expect(typeof ProfilePictureType.Gravatar).toBe('number');
      expect(typeof ProfilePictureType.Image).toBe('number');
    });

    it('should support reverse lookup by value', () => {
      expect(ProfilePictureType[0]).toBe('None');
      expect(ProfilePictureType[1]).toBe('Gravatar');
      expect(ProfilePictureType[2]).toBe('Image');
    });
  });

  describe('type safety', () => {
    it('should work with ProfilePictureType type', () => {
      const noneType: ProfilePictureType = ProfilePictureType.None;
      const gravatarType: ProfilePictureType = ProfilePictureType.Gravatar;
      const imageType: ProfilePictureType = ProfilePictureType.Image;

      expect(noneType).toBe(0);
      expect(gravatarType).toBe(1);
      expect(imageType).toBe(2);
    });

    it('should allow assignment from numeric literals', () => {
      const type: ProfilePictureType = 1;
      expect(type).toBe(ProfilePictureType.Gravatar);
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getTypeName = (type: ProfilePictureType): string => {
        switch (type) {
          case ProfilePictureType.None:
            return 'No Picture';
          case ProfilePictureType.Gravatar:
            return 'Gravatar';
          case ProfilePictureType.Image:
            return 'Custom Image';
          default:
            return 'Unknown';
        }
      };

      expect(getTypeName(ProfilePictureType.None)).toBe('No Picture');
      expect(getTypeName(ProfilePictureType.Gravatar)).toBe('Gravatar');
      expect(getTypeName(ProfilePictureType.Image)).toBe('Custom Image');
    });

    it('should work in conditional comparisons', () => {
      const hasCustomImage = (type: ProfilePictureType): boolean => {
        return type === ProfilePictureType.Image;
      };

      expect(hasCustomImage(ProfilePictureType.None)).toBe(false);
      expect(hasCustomImage(ProfilePictureType.Gravatar)).toBe(false);
      expect(hasCustomImage(ProfilePictureType.Image)).toBe(true);
    });

    it('should work in object mapping', () => {
      const typeLabels: Record<ProfilePictureType, string> = {
        [ProfilePictureType.None]: 'None',
        [ProfilePictureType.Gravatar]: 'Gravatar',
        [ProfilePictureType.Image]: 'Custom Image',
      };

      expect(typeLabels[ProfilePictureType.None]).toBe('None');
      expect(typeLabels[ProfilePictureType.Gravatar]).toBe('Gravatar');
      expect(typeLabels[ProfilePictureType.Image]).toBe('Custom Image');
    });

    it('should work with array includes', () => {
      const displayableTypes = [
        ProfilePictureType.Gravatar,
        ProfilePictureType.Image,
      ];

      expect(displayableTypes.includes(ProfilePictureType.None)).toBe(false);
      expect(displayableTypes.includes(ProfilePictureType.Gravatar)).toBe(true);
      expect(displayableTypes.includes(ProfilePictureType.Image)).toBe(true);
    });
  });

  describe('value ordering', () => {
    it('should have values in ascending order', () => {
      expect(ProfilePictureType.None).toBeLessThan(ProfilePictureType.Gravatar);
      expect(ProfilePictureType.Gravatar).toBeLessThan(ProfilePictureType.Image);
    });

    it('should have consecutive values starting from 0', () => {
      expect(ProfilePictureType.None).toBe(0);
      expect(ProfilePictureType.Gravatar).toBe(1);
      expect(ProfilePictureType.Image).toBe(2);
    });
  });
});
