import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileStateService } from './profile-state.service';
import { RootState } from '../store';
import { Profile } from '../models';

describe('ProfileStateService', () => {
  let service: ProfileStateService;
  let mockState: RootState;

  const mockProfile: Profile.Response = {
    userName: 'testuser',
    email: 'test@example.com',
    name: 'Test',
    surname: 'User',
    phoneNumber: '+1234567890',
    isExternal: false,
    hasPassword: true,
  };

  beforeEach(() => {
    mockState = {
      config: {
        environment: {},
        requirements: { layouts: [] },
        routes: [],
        localization: { values: {}, languages: [] },
        auth: { policies: {}, grantedPolicies: {} },
        setting: { values: {} },
        currentUser: { isAuthenticated: false, id: '', tenantId: '', userName: '' },
        features: { values: {} },
      },
      session: {
        language: 'en',
        tenant: { id: '', name: '' },
      },
      profile: {
        profile: mockProfile,
        loading: false,
        error: null,
      },
      loader: {
        isLoading: false,
        requests: [],
      },
    } as RootState;

    service = new ProfileStateService(() => mockState);
  });

  describe('getProfile', () => {
    it('should return the current user profile', () => {
      const profile = service.getProfile();
      expect(profile).toBeDefined();
      expect(profile?.userName).toBe('testuser');
      expect(profile?.email).toBe('test@example.com');
      expect(profile?.name).toBe('Test');
      expect(profile?.surname).toBe('User');
    });

    it('should return null when no profile is set', () => {
      mockState.profile.profile = null;
      const profile = service.getProfile();
      expect(profile).toBeNull();
    });

    it('should return profile with all fields', () => {
      const profile = service.getProfile();
      expect(profile?.phoneNumber).toBe('+1234567890');
      expect(profile?.isExternal).toBe(false);
      expect(profile?.hasPassword).toBe(true);
    });
  });
});
