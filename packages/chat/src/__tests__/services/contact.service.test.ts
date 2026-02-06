/**
 * Tests for ContactService
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactService } from '../../services/contact.service';

describe('ContactService', () => {
  const mockRestService = {
    request: vi.fn(),
  };

  let service: ContactService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ContactService(mockRestService as any);
  });

  it('should have default apiName', () => {
    expect(service.apiName).toBe('default');
  });

  describe('getContactsByInput', () => {
    it('should call REST service with correct parameters', async () => {
      const mockContacts = [
        { userId: '1', name: 'John', surname: 'Doe', username: 'johndoe' },
      ];
      mockRestService.request.mockResolvedValue(mockContacts);

      const result = await service.getContactsByInput({
        filter: 'john',
        includeOtherContacts: true,
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/chat/contact',
        params: { filter: 'john', includeOtherContacts: true },
      });
      expect(result).toEqual(mockContacts);
    });

    it('should call REST service without parameters', async () => {
      mockRestService.request.mockResolvedValue([]);

      await service.getContactsByInput();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/chat/contact',
        params: undefined,
      });
    });

    it('should return empty array when no contacts', async () => {
      mockRestService.request.mockResolvedValue([]);

      const result = await service.getContactsByInput();

      expect(result).toEqual([]);
    });
  });
});
