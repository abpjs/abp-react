import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TenantManagementModal, type TenantManagementModalProps } from '../../components/TenantManagementModal/TenantManagementModal';
import type { TenantManagement } from '../../models';

// Define the hook return type for mocking
interface MockHookReturn {
  selectedTenant: TenantManagement.Item | null;
  isLoading: boolean;
  error: string | null;
  defaultConnectionString: string;
  useSharedDatabase: boolean;
  fetchTenantById: ReturnType<typeof vi.fn>;
  createTenant: ReturnType<typeof vi.fn>;
  updateTenant: ReturnType<typeof vi.fn>;
  fetchConnectionString: ReturnType<typeof vi.fn>;
  updateConnectionString: ReturnType<typeof vi.fn>;
  deleteConnectionString: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
}

// Default mock value
const createDefaultMockValue = (): MockHookReturn => ({
  selectedTenant: null,
  isLoading: false,
  error: null,
  defaultConnectionString: '',
  useSharedDatabase: true,
  fetchTenantById: vi.fn(),
  createTenant: vi.fn().mockResolvedValue({ success: true }),
  updateTenant: vi.fn().mockResolvedValue({ success: true }),
  fetchConnectionString: vi.fn(),
  updateConnectionString: vi.fn().mockResolvedValue({ success: true }),
  deleteConnectionString: vi.fn().mockResolvedValue({ success: true }),
  reset: vi.fn(),
});

// Mock useTenantManagement hook with proper typing
const mockUseTenantManagement = vi.fn<[], MockHookReturn>(createDefaultMockValue);

vi.mock('../../hooks', () => ({
  useTenantManagement: () => mockUseTenantManagement(),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @abpjs/theme-shared components
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ children, visible, header, footer }: { children: React.ReactNode; visible: boolean; header: string; footer: React.ReactNode }) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  Alert: ({ children, status }: { children: React.ReactNode; status: string }) => (
    <div data-testid={`alert-${status}`}>{children}</div>
  ),
  Button: ({ children, onClick, loading, disabled, ...props }: { children: React.ReactNode; onClick?: () => void; loading?: boolean; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled || loading} data-testid="button" {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: ({ children, checked, onChange }: { children: React.ReactNode; checked: boolean; onChange: () => void }) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} data-testid="checkbox" />
      {children}
    </label>
  ),
  FormField: ({ children, label, errorText, required }: { children: React.ReactNode; label: string; errorText?: string; required?: boolean }) => (
    <div data-testid="form-field">
      <label>
        {label} {required && '*'}
      </label>
      {children}
      {errorText && <span data-testid="error-text">{errorText}</span>}
    </div>
  ),
}));

// Mock Chakra UI
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Flex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} data-testid="input" />,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TenantManagementModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTenantManagement.mockReturnValue(createDefaultMockValue());
  });

  describe('basic rendering', () => {
    it('should render modal when visible is true', () => {
      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should not render modal when visible is false', () => {
      render(
        <TenantManagementModal
          visible={false}
          onVisibleChange={() => {}}
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should render with new tenant title when no tenantId', () => {
      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
        />
      );

      expect(screen.getByTestId('modal-header')).toHaveTextContent('AbpTenantManagement::NewTenant');
    });

    it('should render with edit title when tenantId is provided', () => {
      mockUseTenantManagement.mockReturnValue({
        ...createDefaultMockValue(),
        selectedTenant: { id: '1', name: 'Test Tenant' },
      });

      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
          tenantId="1"
        />
      );

      expect(screen.getByTestId('modal-header')).toHaveTextContent('AbpTenantManagement::Edit');
    });
  });

  describe('onVisibleFeaturesChange prop (v2.0.0)', () => {
    it('should accept onVisibleFeaturesChange prop', () => {
      const onVisibleFeaturesChange = vi.fn();

      // Should compile and render without errors
      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
          onVisibleFeaturesChange={onVisibleFeaturesChange}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should work without onVisibleFeaturesChange prop (optional)', () => {
      // Should compile and render without errors when prop is not provided
      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should have correct type signature for onVisibleFeaturesChange', () => {
      // Type check: onVisibleFeaturesChange should accept boolean parameter
      const onVisibleFeaturesChange: TenantManagementModalProps['onVisibleFeaturesChange'] = (visible: boolean) => {
        expect(typeof visible).toBe('boolean');
      };

      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
          onVisibleFeaturesChange={onVisibleFeaturesChange}
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  describe('props interface', () => {
    it('should accept all required props', () => {
      const props: TenantManagementModalProps = {
        visible: true,
        onVisibleChange: () => {},
      };

      render(<TenantManagementModal {...props} />);
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should accept all optional props', () => {
      const props: TenantManagementModalProps = {
        visible: true,
        onVisibleChange: () => {},
        tenantId: 'tenant-123',
        initialView: 'tenant',
        onSave: () => {},
        onVisibleFeaturesChange: () => {},
      };

      render(<TenantManagementModal {...props} />);
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should accept connectionString as initialView', () => {
      const props: TenantManagementModalProps = {
        visible: true,
        onVisibleChange: () => {},
        tenantId: 'tenant-123',
        initialView: 'connectionString',
      };

      render(<TenantManagementModal {...props} />);
      expect(screen.getByTestId('modal-header')).toHaveTextContent('AbpTenantManagement::ConnectionStrings');
    });
  });

  describe('error display', () => {
    it('should display error when present', () => {
      mockUseTenantManagement.mockReturnValue({
        ...createDefaultMockValue(),
        error: 'An error occurred',
      });

      render(
        <TenantManagementModal
          visible={true}
          onVisibleChange={() => {}}
        />
      );

      expect(screen.getByTestId('alert-error')).toHaveTextContent('An error occurred');
    });
  });
});
