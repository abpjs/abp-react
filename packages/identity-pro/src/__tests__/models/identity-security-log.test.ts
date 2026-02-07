/**
 * Tests for Identity Security Log Models
 * @abpjs/identity-pro v3.1.0
 */
import { describe, it, expect } from 'vitest';
import type {
  IdentitySecurityLogDto,
  IdentitySecurityLogGetListInput,
  IdentitySecurityLogResponse,
} from '../../models/identity-security-log';
import { createIdentitySecurityLogGetListInput } from '../../models/identity-security-log';

describe('IdentitySecurityLogDto', () => {
  describe('interface structure', () => {
    it('should accept a complete security log object', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-123',
        tenantId: 'tenant-1',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'LoginSucceeded',
        userId: 'user-123',
        userName: 'admin',
        clientIpAddress: '192.168.1.1',
        clientId: 'client-1',
        correlationId: 'corr-123',
        browserInfo: 'Mozilla/5.0',
        creationTime: '2024-01-01T10:00:00Z',
        extraProperties: { key: 'value' },
      };

      expect(log.id).toBe('log-123');
      expect(log.tenantId).toBe('tenant-1');
      expect(log.applicationName).toBe('MyApp');
      expect(log.identity).toBe('admin');
      expect(log.action).toBe('LoginSucceeded');
      expect(log.userId).toBe('user-123');
      expect(log.userName).toBe('admin');
      expect(log.clientIpAddress).toBe('192.168.1.1');
      expect(log.clientId).toBe('client-1');
      expect(log.correlationId).toBe('corr-123');
      expect(log.browserInfo).toBe('Mozilla/5.0');
      expect(log.creationTime).toBe('2024-01-01T10:00:00Z');
      expect(log.extraProperties).toEqual({ key: 'value' });
    });

    it('should accept minimal security log with only required fields', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-123',
        creationTime: '2024-01-01T10:00:00Z',
      };

      expect(log.id).toBe('log-123');
      expect(log.creationTime).toBe('2024-01-01T10:00:00Z');
      expect(log.tenantId).toBeUndefined();
      expect(log.applicationName).toBeUndefined();
    });

    it('should accept null values for optional fields', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-123',
        tenantId: null,
        applicationName: null,
        identity: null,
        action: null,
        userId: null,
        userName: null,
        clientIpAddress: null,
        clientId: null,
        correlationId: null,
        browserInfo: null,
        creationTime: '2024-01-01T10:00:00Z',
      };

      expect(log.tenantId).toBeNull();
      expect(log.applicationName).toBeNull();
      expect(log.identity).toBeNull();
    });
  });

  describe('action types', () => {
    it('should accept LoginSucceeded action', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-1',
        action: 'LoginSucceeded',
        creationTime: '2024-01-01T10:00:00Z',
      };
      expect(log.action).toBe('LoginSucceeded');
    });

    it('should accept LoginFailed action', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-2',
        action: 'LoginFailed',
        creationTime: '2024-01-01T10:00:00Z',
      };
      expect(log.action).toBe('LoginFailed');
    });

    it('should accept Logout action', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-3',
        action: 'Logout',
        creationTime: '2024-01-01T10:00:00Z',
      };
      expect(log.action).toBe('Logout');
    });

    it('should accept ChangePassword action', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-4',
        action: 'ChangePassword',
        creationTime: '2024-01-01T10:00:00Z',
      };
      expect(log.action).toBe('ChangePassword');
    });
  });

  describe('extraProperties', () => {
    it('should accept various property types', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-1',
        creationTime: '2024-01-01T10:00:00Z',
        extraProperties: {
          stringValue: 'test',
          numberValue: 42,
          booleanValue: true,
          nestedObject: { nested: 'value' },
          arrayValue: [1, 2, 3],
        },
      };

      expect(log.extraProperties?.stringValue).toBe('test');
      expect(log.extraProperties?.numberValue).toBe(42);
      expect(log.extraProperties?.booleanValue).toBe(true);
    });
  });
});

describe('IdentitySecurityLogGetListInput', () => {
  describe('interface structure', () => {
    it('should accept all filter parameters', () => {
      const input: IdentitySecurityLogGetListInput = {
        filter: 'admin',
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-31T23:59:59Z',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'LoginSucceeded',
        userId: 'user-123',
        userName: 'admin',
        clientId: 'client-1',
        correlationId: 'corr-123',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 10,
      };

      expect(input.filter).toBe('admin');
      expect(input.startTime).toBe('2024-01-01T00:00:00Z');
      expect(input.endTime).toBe('2024-01-31T23:59:59Z');
      expect(input.applicationName).toBe('MyApp');
      expect(input.identity).toBe('admin');
      expect(input.action).toBe('LoginSucceeded');
      expect(input.userId).toBe('user-123');
      expect(input.userName).toBe('admin');
      expect(input.clientId).toBe('client-1');
      expect(input.correlationId).toBe('corr-123');
      expect(input.sorting).toBe('creationTime desc');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
    });

    it('should accept empty input', () => {
      const input: IdentitySecurityLogGetListInput = {};

      expect(input.filter).toBeUndefined();
      expect(input.skipCount).toBeUndefined();
      expect(input.maxResultCount).toBeUndefined();
    });

    it('should accept pagination only', () => {
      const input: IdentitySecurityLogGetListInput = {
        skipCount: 20,
        maxResultCount: 10,
      };

      expect(input.skipCount).toBe(20);
      expect(input.maxResultCount).toBe(10);
    });

    it('should accept date range only', () => {
      const input: IdentitySecurityLogGetListInput = {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-31T23:59:59Z',
      };

      expect(input.startTime).toBe('2024-01-01T00:00:00Z');
      expect(input.endTime).toBe('2024-01-31T23:59:59Z');
    });
  });

  describe('sorting options', () => {
    it('should accept creationTime desc sorting', () => {
      const input: IdentitySecurityLogGetListInput = {
        sorting: 'creationTime desc',
      };
      expect(input.sorting).toBe('creationTime desc');
    });

    it('should accept creationTime asc sorting', () => {
      const input: IdentitySecurityLogGetListInput = {
        sorting: 'creationTime asc',
      };
      expect(input.sorting).toBe('creationTime asc');
    });

    it('should accept userName sorting', () => {
      const input: IdentitySecurityLogGetListInput = {
        sorting: 'userName',
      };
      expect(input.sorting).toBe('userName');
    });
  });
});

describe('IdentitySecurityLogResponse', () => {
  it('should be a PagedResultDto of IdentitySecurityLogDto', () => {
    const response: IdentitySecurityLogResponse = {
      items: [
        {
          id: 'log-1',
          creationTime: '2024-01-01T10:00:00Z',
          action: 'LoginSucceeded',
        },
        {
          id: 'log-2',
          creationTime: '2024-01-01T11:00:00Z',
          action: 'Logout',
        },
      ],
      totalCount: 2,
    };

    expect(response.items).toHaveLength(2);
    expect(response.totalCount).toBe(2);
    expect(response.items[0].id).toBe('log-1');
    expect(response.items[1].id).toBe('log-2');
  });

  it('should handle empty response', () => {
    const response: IdentitySecurityLogResponse = {
      items: [],
      totalCount: 0,
    };

    expect(response.items).toHaveLength(0);
    expect(response.totalCount).toBe(0);
  });
});

describe('createIdentitySecurityLogGetListInput', () => {
  it('should create default input with skipCount 0 and maxResultCount 10', () => {
    const input = createIdentitySecurityLogGetListInput();

    expect(input.skipCount).toBe(0);
    expect(input.maxResultCount).toBe(10);
  });

  it('should allow overriding skipCount', () => {
    const input = createIdentitySecurityLogGetListInput({ skipCount: 20 });

    expect(input.skipCount).toBe(20);
    expect(input.maxResultCount).toBe(10);
  });

  it('should allow overriding maxResultCount', () => {
    const input = createIdentitySecurityLogGetListInput({ maxResultCount: 50 });

    expect(input.skipCount).toBe(0);
    expect(input.maxResultCount).toBe(50);
  });

  it('should allow overriding both pagination values', () => {
    const input = createIdentitySecurityLogGetListInput({
      skipCount: 30,
      maxResultCount: 15,
    });

    expect(input.skipCount).toBe(30);
    expect(input.maxResultCount).toBe(15);
  });

  it('should allow adding filter parameters', () => {
    const input = createIdentitySecurityLogGetListInput({
      filter: 'admin',
      action: 'LoginSucceeded',
    });

    expect(input.filter).toBe('admin');
    expect(input.action).toBe('LoginSucceeded');
    expect(input.skipCount).toBe(0);
    expect(input.maxResultCount).toBe(10);
  });

  it('should allow adding date range parameters', () => {
    const input = createIdentitySecurityLogGetListInput({
      startTime: '2024-01-01T00:00:00Z',
      endTime: '2024-01-31T23:59:59Z',
    });

    expect(input.startTime).toBe('2024-01-01T00:00:00Z');
    expect(input.endTime).toBe('2024-01-31T23:59:59Z');
  });

  it('should allow all parameters together', () => {
    const input = createIdentitySecurityLogGetListInput({
      filter: 'search term',
      startTime: '2024-01-01T00:00:00Z',
      endTime: '2024-01-31T23:59:59Z',
      applicationName: 'TestApp',
      identity: 'admin',
      action: 'LoginFailed',
      userId: 'user-456',
      userName: 'testuser',
      clientId: 'client-abc',
      correlationId: 'corr-xyz',
      sorting: 'creationTime desc',
      skipCount: 10,
      maxResultCount: 25,
    });

    expect(input.filter).toBe('search term');
    expect(input.startTime).toBe('2024-01-01T00:00:00Z');
    expect(input.endTime).toBe('2024-01-31T23:59:59Z');
    expect(input.applicationName).toBe('TestApp');
    expect(input.identity).toBe('admin');
    expect(input.action).toBe('LoginFailed');
    expect(input.userId).toBe('user-456');
    expect(input.userName).toBe('testuser');
    expect(input.clientId).toBe('client-abc');
    expect(input.correlationId).toBe('corr-xyz');
    expect(input.sorting).toBe('creationTime desc');
    expect(input.skipCount).toBe(10);
    expect(input.maxResultCount).toBe(25);
  });

  it('should not modify the original override object', () => {
    const overrides = { filter: 'test' };
    createIdentitySecurityLogGetListInput(overrides);

    expect(overrides).toEqual({ filter: 'test' });
  });
});
