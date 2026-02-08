/**
 * Tests for components barrel exports
 * @abpjs/audit-logging v4.0.0
 */
import { describe, it, expect } from 'vitest';

// Mock dependencies before importing components
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string) => key }),
  useRestService: () => ({ request: vi.fn() }),
}));

vi.mock('@abpjs/theme-shared', () => ({
  Modal: () => null,
  Alert: () => null,
  Button: () => null,
  FormField: ({ children }: { children: unknown }) => children,
}));

vi.mock('@chakra-ui/react', () => ({
  Box: ({ children }: { children: unknown }) => children,
  Flex: ({ children }: { children: unknown }) => children,
  VStack: ({ children }: { children: unknown }) => children,
  Input: () => null,
  Text: ({ children }: { children: unknown }) => children,
  Spinner: () => null,
  Badge: ({ children }: { children: unknown }) => children,
  Table: {
    Root: ({ children }: { children: unknown }) => children,
    Header: ({ children }: { children: unknown }) => children,
    Body: ({ children }: { children: unknown }) => children,
    Row: ({ children }: { children: unknown }) => children,
    Cell: ({ children }: { children: unknown }) => children,
    ColumnHeader: ({ children }: { children: unknown }) => children,
  },
  Tabs: {
    Root: ({ children }: { children: unknown }) => children,
    List: ({ children }: { children: unknown }) => children,
    Trigger: ({ children }: { children: unknown }) => children,
    Content: ({ children }: { children: unknown }) => children,
  },
  NativeSelectRoot: ({ children }: { children: unknown }) => children,
  NativeSelectField: ({ children }: { children: unknown }) => children,
}));

import { vi } from 'vitest';
import * as ComponentsExports from '../../components';
import * as AuditLogsExports from '../../components/AuditLogs';

describe('components/index barrel exports', () => {
  it('should export AuditLogsComponent', () => {
    expect(ComponentsExports.AuditLogsComponent).toBeDefined();
    expect(typeof ComponentsExports.AuditLogsComponent).toBe('function');
  });

  it('should export AuditLogsComponent from AuditLogs sub-barrel', () => {
    expect(AuditLogsExports.AuditLogsComponent).toBeDefined();
    expect(typeof AuditLogsExports.AuditLogsComponent).toBe('function');
  });

  it('should export the same component from both paths', () => {
    expect(ComponentsExports.AuditLogsComponent).toBe(AuditLogsExports.AuditLogsComponent);
  });
});
