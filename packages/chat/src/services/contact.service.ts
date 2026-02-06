/**
 * Contact Service
 * Service for managing chat contacts via REST API
 * Translated from @volo/abp.ng.chat ContactService v2.9.0
 */
import { RestService } from '@abpjs/core';
import type { ChatContactDto } from '../models/chat-contact-dto';
import type { GetContactsInput } from '../models/get-contacts-input';

/**
 * Service for chat contact operations
 */
export class ContactService {
  private rest: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Get chat contacts based on filter criteria
   * @param params Optional filter parameters
   * @returns Promise with array of chat contacts
   */
  getContactsByInput(params?: GetContactsInput): Promise<ChatContactDto[]> {
    return this.rest.request<null, ChatContactDto[]>({
      method: 'GET',
      url: '/api/chat/contact',
      params: params as unknown as Record<string, unknown>,
    });
  }
}
