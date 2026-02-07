import { describe, it, expect } from 'vitest';
import { PermissionService } from './permission.service';
import type { RootState } from '../store';

function createMockState(grantedPolicies: Record<string, boolean>): RootState {
  return {
    config: {
      environment: {},
      requirements: { layouts: [] },
      routes: [],
      localization: {
        currentCulture: {
          cultureName: '',
          dateTimeFormat: {
            calendarAlgorithmType: '',
            dateSeparator: '',
            fullDateTimePattern: '',
            longTimePattern: '',
            shortDatePattern: '',
            shortTimePattern: '',
          },
          displayName: '',
          englishName: '',
          isRightToLeft: false,
          name: '',
          nativeName: '',
          threeLetterIsoLanguageName: '',
          twoLetterIsoLanguageName: '',
        },
        defaultResourceName: '',
        languages: [],
        values: {},
      },
      auth: { policies: {}, grantedPolicies },
      setting: { values: {} },
      currentUser: {
        isAuthenticated: false,
        id: '',
        tenantId: '',
        userName: '',
        email: '',
        emailVerified: false,
        name: '',
        phoneNumber: '',
        phoneNumberVerified: false,
        surName: '',
        roles: [],
      },
      currentTenant: { id: '', name: '' },
      features: { values: {} },
    },
    session: {
      language: '',
      tenant: {},
      sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
    },
    profile: { profile: null },
    loader: { showLoading: false },
  } as unknown as RootState;
}

describe('PermissionService (v4.0.0)', () => {
  describe('getGrantedPolicy', () => {
    it('should return true for empty key', () => {
      const service = new PermissionService(() => createMockState({}));
      expect(service.getGrantedPolicy('')).toBe(true);
    });

    it('should return true for undefined key', () => {
      const service = new PermissionService(() => createMockState({}));
      expect(service.getGrantedPolicy()).toBe(true);
    });

    it('should return true for granted policy', () => {
      const service = new PermissionService(
        () => createMockState({ 'AbpIdentity.Users': true })
      );
      expect(service.getGrantedPolicy('AbpIdentity.Users')).toBe(true);
    });

    it('should return false for non-granted policy', () => {
      const service = new PermissionService(
        () => createMockState({ 'AbpIdentity.Users': false })
      );
      expect(service.getGrantedPolicy('AbpIdentity.Users')).toBe(false);
    });

    it('should return false for non-existent policy', () => {
      const service = new PermissionService(() => createMockState({}));
      expect(service.getGrantedPolicy('NonExistent.Policy')).toBe(false);
    });

    describe('AND (&&) conditions', () => {
      it('should return true when all policies are granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && Policy.B')).toBe(true);
      });

      it('should return false when one policy is not granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': false,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && Policy.B')).toBe(false);
      });

      it('should return false when both policies are not granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': false,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && Policy.B')).toBe(false);
      });
    });

    describe('OR (||) conditions', () => {
      it('should return true when at least one policy is granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A || Policy.B')).toBe(true);
      });

      it('should return false when no policies are granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': false,
            })
        );
        expect(service.getGrantedPolicy('Policy.A || Policy.B')).toBe(false);
      });

      it('should return true when both policies are granted', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A || Policy.B')).toBe(true);
      });
    });

    describe('NOT (!) conditions', () => {
      it('should negate a true policy', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': false,
            })
        );
        expect(service.getGrantedPolicy('!Policy.A || Policy.B')).toBe(false);
      });

      it('should negate a false policy', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': false,
            })
        );
        expect(service.getGrantedPolicy('!Policy.A || Policy.B')).toBe(true);
      });
    });

    describe('parenthesized conditions', () => {
      it('should evaluate (A || B) && C when A is false', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': true,
              'Policy.C': true,
            })
        );
        // When first operand of || is false, both sides are evaluated correctly
        expect(service.getGrantedPolicy('(Policy.A || Policy.B) && Policy.C')).toBe(true);
      });

      it('should evaluate A && (B || C) correctly', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': false,
              'Policy.C': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && (Policy.B || Policy.C)')).toBe(true);
      });

      it('should evaluate A && (B || C) when A is false', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': true,
              'Policy.C': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && (Policy.B || Policy.C)')).toBe(false);
      });
    });

    describe('complex expressions', () => {
      it('should handle three-way AND', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': true,
              'Policy.C': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A && Policy.B && Policy.C')).toBe(true);
      });

      it('should handle three-way OR', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': false,
              'Policy.B': false,
              'Policy.C': true,
            })
        );
        expect(service.getGrantedPolicy('Policy.A || Policy.B || Policy.C')).toBe(true);
      });

      it('should handle mixed AND and OR', () => {
        const service = new PermissionService(
          () =>
            createMockState({
              'Policy.A': true,
              'Policy.B': false,
              'Policy.C': true,
            })
        );
        // Without parens: A && B || C = (A && B) || C = false || true = true
        expect(service.getGrantedPolicy('Policy.A && Policy.B || Policy.C')).toBe(true);
      });

      it('should return true for key with only whitespace/operators', () => {
        const service = new PermissionService(() => createMockState({}));
        expect(service.getGrantedPolicy('   ')).toBe(true);
      });
    });
  });
});
