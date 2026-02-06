import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClaims } from '../../hooks/useClaims';
import { Identity } from '../../models';

// Mock the modules
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({
    request: vi.fn(),
  })),
}));

// Mock the IdentityService
const mockGetClaimTypes = vi.fn();
const mockGetRolesClaimTypes = vi.fn();
const mockGetUsersClaimTypes = vi.fn();
const mockGetClaimTypeById = vi.fn();
const mockCreateClaimType = vi.fn();
const mockUpdateClaimType = vi.fn();
const mockDeleteClaimType = vi.fn();
const mockGetClaims = vi.fn();
const mockUpdateClaims = vi.fn();

vi.mock('../../services', () => ({
  IdentityService: vi.fn().mockImplementation(() => ({
    getClaimTypes: mockGetClaimTypes,
    getRolesClaimTypes: mockGetRolesClaimTypes,
    getUsersClaimTypes: mockGetUsersClaimTypes,
    getClaimTypeById: mockGetClaimTypeById,
    createClaimType: mockCreateClaimType,
    updateClaimType: mockUpdateClaimType,
    deleteClaimType: mockDeleteClaimType,
    getClaims: mockGetClaims,
    updateClaims: mockUpdateClaims,
  })),
}));

describe('useClaims', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have empty claim types array', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.claimTypes).toEqual([]);
    });

    it('should have zero total count', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.totalCount).toBe(0);
    });

    it('should have empty claim type names array', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.claimTypeNames).toEqual([]);
    });

    it('should have null selected claim type', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.selectedClaimType).toBeNull();
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.isLoading).toBe(false);
    });

    it('should have no error', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.error).toBeNull();
    });

    it('should have default sort key', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.sortKey).toBe('name');
    });

    it('should have empty sort order', () => {
      const { result } = renderHook(() => useClaims());
      expect(result.current.sortOrder).toBe('');
    });
  });

  describe('fetchClaimTypes', () => {
    it('should fetch claim types and update state', async () => {
      const mockResponse: Identity.ClaimResponse = {
        items: [
          {
            id: 'claim-1',
            name: 'email',
            required: true,
            isStatic: true,
            regex: '',
            regexDescription: '',
            description: 'Email claim',
            valueType: 0,
          },
        ],
        totalCount: 1,
      };
      mockGetClaimTypes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchClaimTypes();
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.claimTypes).toEqual(mockResponse.items);
      expect(result.current.totalCount).toBe(1);
    });

    it('should handle errors', async () => {
      mockGetClaimTypes.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchClaimTypes();
        expect(operationResult.success).toBe(false);
        expect(operationResult.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should pass parameters to service', async () => {
      mockGetClaimTypes.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useClaims());
      const params = { skipCount: 10, maxResultCount: 20 };

      await act(async () => {
        await result.current.fetchClaimTypes(params);
      });

      expect(mockGetClaimTypes).toHaveBeenCalledWith(params);
    });
  });

  describe('fetchRolesClaimTypes (v3.0.0)', () => {
    it('should fetch claim type names for roles', async () => {
      const mockResponse: Identity.ClaimTypeName[] = [
        { name: 'email' },
        { name: 'role' },
      ];
      mockGetRolesClaimTypes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchRolesClaimTypes();
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.claimTypeNames).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mockGetRolesClaimTypes.mockRejectedValue(new Error('Failed to fetch role claim types'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchRolesClaimTypes();
        expect(operationResult.success).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch role claim types');
    });

    it('should return empty array when no claim types exist', async () => {
      mockGetRolesClaimTypes.mockResolvedValue([]);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchRolesClaimTypes();
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.claimTypeNames).toEqual([]);
    });
  });

  describe('fetchUsersClaimTypes (v3.0.0)', () => {
    it('should fetch claim type names for users', async () => {
      const mockResponse: Identity.ClaimTypeName[] = [
        { name: 'email' },
        { name: 'phone_number' },
      ];
      mockGetUsersClaimTypes.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchUsersClaimTypes();
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.claimTypeNames).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      mockGetUsersClaimTypes.mockRejectedValue(new Error('Failed to fetch user claim types'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchUsersClaimTypes();
        expect(operationResult.success).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch user claim types');
    });

    it('should return empty array when no claim types exist', async () => {
      mockGetUsersClaimTypes.mockResolvedValue([]);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.fetchUsersClaimTypes();
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.claimTypeNames).toEqual([]);
    });
  });

  describe('getClaimTypeById', () => {
    it('should fetch claim type and set as selected', async () => {
      const mockClaimType: Identity.ClaimType = {
        id: 'claim-1',
        name: 'email',
        required: true,
        isStatic: true,
        regex: '',
        regexDescription: '',
        description: 'Email claim',
        valueType: 0,
      };
      mockGetClaimTypeById.mockResolvedValue(mockClaimType);

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.getClaimTypeById('claim-1');
        expect(operationResult.success).toBe(true);
      });

      expect(result.current.selectedClaimType).toEqual(mockClaimType);
    });

    it('should handle errors', async () => {
      mockGetClaimTypeById.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.getClaimTypeById('invalid-id');
        expect(operationResult.success).toBe(false);
      });

      expect(result.current.error).toBe('Not found');
    });
  });

  describe('createClaimType', () => {
    it('should create a claim type and refresh list', async () => {
      const newClaimType: Identity.ClaimType = {
        name: 'custom_claim',
        required: false,
        isStatic: false,
        regex: '',
        regexDescription: '',
        description: 'Custom claim',
        valueType: 0,
      };
      mockCreateClaimType.mockResolvedValue({ ...newClaimType, id: 'new-id' });
      mockGetClaimTypes.mockResolvedValue({ items: [{ ...newClaimType, id: 'new-id' }], totalCount: 1 });

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.createClaimType(newClaimType);
        expect(operationResult.success).toBe(true);
      });

      expect(mockCreateClaimType).toHaveBeenCalledWith(newClaimType);
      expect(mockGetClaimTypes).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockCreateClaimType.mockRejectedValue(new Error('Creation failed'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.createClaimType({
          name: 'test',
          required: false,
          isStatic: false,
          regex: '',
          regexDescription: '',
          description: '',
          valueType: 0,
        });
        expect(operationResult.success).toBe(false);
      });

      expect(result.current.error).toBe('Creation failed');
    });
  });

  describe('updateClaimType', () => {
    it('should update a claim type and refresh list', async () => {
      const updatedClaimType: Identity.ClaimType = {
        id: 'claim-1',
        name: 'updated_claim',
        required: true,
        isStatic: false,
        regex: '',
        regexDescription: '',
        description: 'Updated',
        valueType: 1,
      };
      mockUpdateClaimType.mockResolvedValue(updatedClaimType);
      mockGetClaimTypes.mockResolvedValue({ items: [updatedClaimType], totalCount: 1 });

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.updateClaimType(updatedClaimType);
        expect(operationResult.success).toBe(true);
      });

      expect(mockUpdateClaimType).toHaveBeenCalledWith(updatedClaimType);
    });

    it('should handle errors', async () => {
      mockUpdateClaimType.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.updateClaimType({
          id: 'claim-1',
          name: 'test',
          required: false,
          isStatic: false,
          regex: '',
          regexDescription: '',
          description: '',
          valueType: 0,
        });
        expect(operationResult.success).toBe(false);
        expect(operationResult.error).toBe('Update failed');
      });

      expect(result.current.error).toBe('Update failed');
    });

    it('should handle non-Error rejection', async () => {
      mockUpdateClaimType.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.updateClaimType({
          id: 'claim-1',
          name: 'test',
          required: false,
          isStatic: false,
          regex: '',
          regexDescription: '',
          description: '',
          valueType: 0,
        });
        expect(operationResult.success).toBe(false);
        expect(operationResult.error).toBe('Failed to update claim type');
      });

      expect(result.current.error).toBe('Failed to update claim type');
    });
  });

  describe('deleteClaimType', () => {
    it('should delete a claim type and refresh list', async () => {
      mockDeleteClaimType.mockResolvedValue(undefined);
      mockGetClaimTypes.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.deleteClaimType('claim-1');
        expect(operationResult.success).toBe(true);
      });

      expect(mockDeleteClaimType).toHaveBeenCalledWith('claim-1');
      expect(mockGetClaimTypes).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockDeleteClaimType.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.deleteClaimType('claim-1');
        expect(operationResult.success).toBe(false);
        expect(operationResult.error).toBe('Delete failed');
      });

      expect(result.current.error).toBe('Delete failed');
    });

    it('should handle non-Error rejection', async () => {
      mockDeleteClaimType.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.deleteClaimType('claim-1');
        expect(operationResult.success).toBe(false);
        expect(operationResult.error).toBe('Failed to delete claim type');
      });

      expect(result.current.error).toBe('Failed to delete claim type');
    });
  });

  describe('getClaims', () => {
    it('should fetch claims for a user', async () => {
      const mockClaims: Identity.ClaimRequest[] = [
        { userId: 'user-1', claimType: 'email', claimValue: 'user@example.com' },
      ];
      mockGetClaims.mockResolvedValue(mockClaims);

      const { result } = renderHook(() => useClaims());

      let claims: Identity.ClaimRequest[] = [];
      await act(async () => {
        claims = await result.current.getClaims('user-1', 'users');
      });

      expect(mockGetClaims).toHaveBeenCalledWith({ id: 'user-1', type: 'users' });
      expect(claims).toEqual(mockClaims);
    });

    it('should fetch claims for a role', async () => {
      const mockClaims: Identity.ClaimRequest[] = [
        { roleId: 'role-1', claimType: 'permission', claimValue: 'read' },
      ];
      mockGetClaims.mockResolvedValue(mockClaims);

      const { result } = renderHook(() => useClaims());

      let claims: Identity.ClaimRequest[] = [];
      await act(async () => {
        claims = await result.current.getClaims('role-1', 'roles');
      });

      expect(mockGetClaims).toHaveBeenCalledWith({ id: 'role-1', type: 'roles' });
      expect(claims).toEqual(mockClaims);
    });

    it('should return empty array on error', async () => {
      mockGetClaims.mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useClaims());

      let claims: Identity.ClaimRequest[] = [];
      await act(async () => {
        claims = await result.current.getClaims('user-1', 'users');
      });

      expect(claims).toEqual([]);
    });
  });

  describe('updateClaims', () => {
    it('should update claims for a user', async () => {
      mockUpdateClaims.mockResolvedValue(undefined);

      const { result } = renderHook(() => useClaims());
      const claims: Identity.ClaimRequest[] = [
        { userId: 'user-1', claimType: 'email', claimValue: 'new@example.com' },
      ];

      await act(async () => {
        const operationResult = await result.current.updateClaims('user-1', 'users', claims);
        expect(operationResult.success).toBe(true);
      });

      expect(mockUpdateClaims).toHaveBeenCalledWith({ id: 'user-1', type: 'users', claims });
    });

    it('should handle errors', async () => {
      mockUpdateClaims.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useClaims());

      await act(async () => {
        const operationResult = await result.current.updateClaims('user-1', 'users', []);
        expect(operationResult.success).toBe(false);
      });

      expect(result.current.error).toBe('Update failed');
    });
  });

  describe('setSelectedClaimType', () => {
    it('should set selected claim type', () => {
      const { result } = renderHook(() => useClaims());
      const claimType: Identity.ClaimType = {
        id: 'claim-1',
        name: 'email',
        required: true,
        isStatic: true,
        regex: '',
        regexDescription: '',
        description: 'Email',
        valueType: 0,
      };

      act(() => {
        result.current.setSelectedClaimType(claimType);
      });

      expect(result.current.selectedClaimType).toEqual(claimType);
    });

    it('should clear selected claim type', () => {
      const { result } = renderHook(() => useClaims());

      act(() => {
        result.current.setSelectedClaimType({
          id: 'claim-1',
          name: 'email',
          required: true,
          isStatic: true,
          regex: '',
          regexDescription: '',
          description: 'Email',
          valueType: 0,
        });
      });

      act(() => {
        result.current.setSelectedClaimType(null);
      });

      expect(result.current.selectedClaimType).toBeNull();
    });
  });

  describe('setSortKey and setSortOrder', () => {
    it('should update sort key', () => {
      const { result } = renderHook(() => useClaims());

      act(() => {
        result.current.setSortKey('description');
      });

      expect(result.current.sortKey).toBe('description');
    });

    it('should update sort order', () => {
      const { result } = renderHook(() => useClaims());

      act(() => {
        result.current.setSortOrder('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
    });
  });

  describe('reset', () => {
    it('should reset all state to defaults', async () => {
      mockGetClaimTypes.mockResolvedValue({
        items: [
          {
            id: 'claim-1',
            name: 'email',
            required: true,
            isStatic: true,
            regex: '',
            regexDescription: '',
            description: 'Email',
            valueType: 0,
          },
        ],
        totalCount: 1,
      });
      mockGetRolesClaimTypes.mockResolvedValue([{ name: 'email' }]);

      const { result } = renderHook(() => useClaims());

      // First populate some state
      await act(async () => {
        await result.current.fetchClaimTypes();
        await result.current.fetchRolesClaimTypes();
        result.current.setSelectedClaimType({
          id: 'claim-1',
          name: 'email',
          required: true,
          isStatic: true,
          regex: '',
          regexDescription: '',
          description: 'Email',
          valueType: 0,
        });
      });

      // Verify state is populated
      expect(result.current.claimTypes.length).toBe(1);
      expect(result.current.claimTypeNames.length).toBe(1);
      expect(result.current.selectedClaimType).not.toBeNull();

      // Now reset
      act(() => {
        result.current.reset();
      });

      // Verify state is reset
      expect(result.current.claimTypes).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.claimTypeNames).toEqual([]);
      expect(result.current.selectedClaimType).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
