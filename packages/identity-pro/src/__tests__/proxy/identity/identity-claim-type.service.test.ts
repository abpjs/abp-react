/**
 * Tests for IdentityClaimTypeService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityClaimTypeService } from '../../../proxy/identity/identity-claim-type.service';
import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  CreateClaimTypeDto,
  GetIdentityClaimTypesInput,
  UpdateClaimTypeDto,
} from '../../../proxy/identity/models';
import { IdentityClaimValueType } from '../../../proxy/identity/identity-claim-value-type.enum';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentityClaimTypeService', () => {
  let service: IdentityClaimTypeService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockClaimType: ClaimTypeDto = {
    id: 'claim-type-1',
    name: 'email',
    required: true,
    isStatic: false,
    regex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    regexDescription: 'Valid email format',
    description: 'User email address',
    valueType: IdentityClaimValueType.String,
    valueTypeAsString: 'String',
    extraProperties: {},
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentityClaimTypeService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentityClaimTypeService);
    });
  });

  describe('create', () => {
    it('should call REST API with correct parameters', async () => {
      const input: CreateClaimTypeDto = {
        name: 'custom_claim',
        required: false,
        regex: '',
        regexDescription: '',
        description: 'Custom claim',
        valueType: IdentityClaimValueType.String,
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValueOnce(mockClaimType);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/claim-types',
        body: input,
      });
      expect(result).toEqual(mockClaimType);
    });

    it('should handle API errors', async () => {
      const input: CreateClaimTypeDto = {
        name: 'test',
        required: false,
        regex: '',
        regexDescription: '',
        description: '',
        valueType: IdentityClaimValueType.String,
        extraProperties: {},
      };
      const error = new Error('Validation error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.create(input)).rejects.toThrow('Validation error');
    });
  });

  describe('delete', () => {
    it('should call REST API with correct parameters', async () => {
      const id = 'claim-type-1';
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.delete(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/identity/claim-types/${id}`,
      });
    });

    it('should handle not found error', async () => {
      const error = new Error('Not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.delete('non-existent')).rejects.toThrow('Not found');
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      const id = 'claim-type-1';
      mockRestService.request.mockResolvedValueOnce(mockClaimType);

      const result = await service.get(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/identity/claim-types/${id}`,
      });
      expect(result).toEqual(mockClaimType);
    });

    it('should handle not found error', async () => {
      const error = new Error('Not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get('non-existent')).rejects.toThrow('Not found');
    });
  });

  describe('getList', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetIdentityClaimTypesInput = {
        filter: 'email',
        sorting: 'name asc',
        skipCount: 0,
        maxResultCount: 10,
      };

      const expectedResponse: PagedResultDto<ClaimTypeDto> = {
        items: [mockClaimType],
        totalCount: 1,
      };

      mockRestService.request.mockResolvedValueOnce(expectedResponse);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/claim-types',
        params: {
          filter: 'email',
          sorting: 'name asc',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should handle empty results', async () => {
      const input: GetIdentityClaimTypesInput = {
        filter: 'nonexistent',
        sorting: '',
        skipCount: 0,
        maxResultCount: 10,
      };

      const expectedResponse: PagedResultDto<ClaimTypeDto> = {
        items: [],
        totalCount: 0,
      };

      mockRestService.request.mockResolvedValueOnce(expectedResponse);

      const result = await service.getList(input);

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should handle pagination', async () => {
      const input: GetIdentityClaimTypesInput = {
        filter: '',
        sorting: 'name',
        skipCount: 10,
        maxResultCount: 5,
      };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 20 });

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            skipCount: 10,
            maxResultCount: 5,
          }),
        })
      );
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const id = 'claim-type-1';
      const input: UpdateClaimTypeDto = {
        name: 'updated_email',
        required: true,
        regex: '.*',
        regexDescription: 'Any value',
        description: 'Updated description',
        valueType: IdentityClaimValueType.String,
        extraProperties: {},
      };

      const updatedClaimType = { ...mockClaimType, ...input };
      mockRestService.request.mockResolvedValueOnce(updatedClaimType);

      const result = await service.update(id, input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/identity/claim-types/${id}`,
        body: input,
      });
      expect(result.name).toBe('updated_email');
    });

    it('should handle validation errors', async () => {
      const error = new Error('Invalid regex pattern');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update('claim-1', {
          name: 'test',
          required: false,
          regex: '[invalid',
          regexDescription: '',
          description: '',
          valueType: IdentityClaimValueType.String,
          extraProperties: {},
        })
      ).rejects.toThrow('Invalid regex pattern');
    });
  });
});
