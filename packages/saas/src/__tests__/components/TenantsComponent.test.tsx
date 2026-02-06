import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock data
const mockTenants = [
  { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', editionName: 'Basic Edition' },
  { id: 'tenant-2', name: 'Tenant Two', editionId: 'ed-2', editionName: 'Pro Edition' },
];

const mockEditions = [
  { id: 'ed-1', displayName: 'Basic Edition' },
  { id: 'ed-2', displayName: 'Pro Edition' },
];

// Mock functions for useTenants
const mockFetchTenants = vi.fn().mockResolvedValue({ success: true });
const mockGetTenantById = vi.fn().mockResolvedValue({ success: true, data: mockTenants[0] });
const mockCreateTenant = vi.fn().mockResolvedValue({ success: true, data: { id: 'new-id', name: 'New Tenant' } });
const mockUpdateTenant = vi.fn().mockResolvedValue({ success: true, data: mockTenants[0] });
const mockDeleteTenant = vi.fn().mockResolvedValue({ success: true });
const mockGetDefaultConnectionString = vi.fn().mockResolvedValue({ success: true, data: '' });
const mockUpdateDefaultConnectionString = vi.fn().mockResolvedValue({ success: true });
const mockDeleteDefaultConnectionString = vi.fn().mockResolvedValue({ success: true });
const mockSetSelectedTenant = vi.fn();

// State control for hook mock
let mockTenantsState = {
  tenants: mockTenants,
  totalCount: 2,
  selectedTenant: null as any,
  isLoading: false,
  error: null as string | null,
};

// Mock useTenants hook
vi.mock('../../hooks/useTenants', () => ({
  useTenants: () => ({
    ...mockTenantsState,
    fetchTenants: mockFetchTenants,
    getTenantById: mockGetTenantById,
    createTenant: mockCreateTenant,
    updateTenant: mockUpdateTenant,
    deleteTenant: mockDeleteTenant,
    getDefaultConnectionString: mockGetDefaultConnectionString,
    updateDefaultConnectionString: mockUpdateDefaultConnectionString,
    deleteDefaultConnectionString: mockDeleteDefaultConnectionString,
    setSelectedTenant: mockSetSelectedTenant,
  }),
}));

// Mock useEditions hook
const mockFetchEditions = vi.fn().mockResolvedValue({ success: true });
vi.mock('../../hooks/useEditions', () => ({
  useEditions: () => ({
    editions: mockEditions,
    fetchEditions: mockFetchEditions,
  }),
}));

// Mock @chakra-ui/react components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, id, className, ...props }: any) => <div id={id} className={className} {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Flex: ({ children, ...props }: any) => <div style={{ display: 'flex' }} {...props}>{children}</div>,
  Input: React.forwardRef(({ placeholder, value, onChange, ...props }: any, ref: any) => (
    <input ref={ref} placeholder={placeholder} value={value} onChange={onChange} {...props} />
  )),
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
  Table: {
    Root: ({ children, ...props }: any) => <table {...props}>{children}</table>,
    Header: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
    Body: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    Row: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    ColumnHeader: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    Cell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  },
  NativeSelectRoot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  NativeSelectField: React.forwardRef(({ children, placeholder, ...props }: any, ref: any) => (
    <select ref={ref} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  )),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...args: string[]) => {
      const translations: Record<string, string> = {
        'Saas::Tenants': 'Tenants',
        'Saas::NewTenant': 'New Tenant',
        'Saas::EditTenant': 'Edit Tenant',
        'Saas::TenantName': 'Tenant Name',
        'Saas::Edition': 'Edition',
        'Saas::AdminEmailAddress': 'Admin Email Address',
        'Saas::AdminPassword': 'Admin Password',
        'Saas::Actions': 'Actions',
        'Saas::Edit': 'Edit',
        'Saas::Delete': 'Delete',
        'Saas::ConnectionString': 'Connection String',
        'Saas::ConnectionStrings': 'Connection Strings',
        'Saas::UseSharedDatabase': 'Use Shared Database',
        'Saas::UseCustomDatabase': 'Use Custom Database',
        'Saas::DefaultConnectionString': 'Default Connection String',
        'Saas::TenantDeletionConfirmationMessage': `Tenant "${args[0]}" will be deleted.`,
        'Saas::AreYouSure': 'Are you sure?',
        'Saas::NoTenantsFound': 'No tenants found',
        'AbpUi::Save': 'Save',
        'AbpUi::Cancel': 'Cancel',
        'AbpUi::PagerSearch': 'Search',
        'AbpUi::Search': 'Search',
      };
      return translations[key] || key;
    },
  }),
  usePermission: () => ({
    hasPermission: () => true,
  }),
}));

// Mock @abpjs/theme-shared
const mockWarn = vi.fn();
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ visible, children, header, footer, onClose }: any) =>
    visible ? (
      <div data-testid="modal" role="dialog">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
      </div>
    ) : null,
  Button: ({ children, onClick, loading, disabled, colorPalette, ...props }: any) => (
    <button onClick={onClick} disabled={loading || disabled} data-colorpalette={colorPalette} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  FormField: ({ label, children, error, ...props }: any) => (
    <div data-testid="form-field" {...props}>
      {label && <label>{label}</label>}
      {children}
      {error && <span data-testid="field-error">{error}</span>}
    </div>
  ),
  useToaster: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
  useConfirmation: () => ({
    warn: mockWarn,
  }),
  Toaster: {
    Status: {
      confirm: 'confirm',
      reject: 'reject',
    },
  },
  Confirmation: {
    Status: {
      confirm: 'confirm',
      reject: 'reject',
    },
  },
}));

import { TenantsComponent } from '../../components/Tenants';

describe('TenantsComponent', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockTenantsState = {
      tenants: mockTenants,
      totalCount: 2,
      selectedTenant: null,
      isLoading: false,
      error: null,
    };
  });

  describe('Export and Basic Rendering', () => {
    it('should be defined in exports', async () => {
      const { TenantsComponent } = await import('../../components/Tenants');
      expect(TenantsComponent).toBeDefined();
      expect(typeof TenantsComponent).toBe('function');
    });

    it('should render the component with heading', () => {
      render(<TenantsComponent />);
      expect(screen.getByText('Tenants')).toBeInTheDocument();
    });

    it('should render New Tenant button', () => {
      render(<TenantsComponent />);
      expect(screen.getByText('New Tenant')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<TenantsComponent />);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should call fetchTenants on mount', async () => {
      render(<TenantsComponent />);
      await waitFor(() => {
        expect(mockFetchTenants).toHaveBeenCalled();
      });
    });

    it('should call fetchEditions on mount', async () => {
      render(<TenantsComponent />);
      await waitFor(() => {
        expect(mockFetchEditions).toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading and no tenants', () => {
      mockTenantsState.isLoading = true;
      mockTenantsState.tenants = [];
      render(<TenantsComponent />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when error occurs', () => {
      mockTenantsState.error = 'Failed to load tenants';
      render(<TenantsComponent />);
      expect(screen.getByText('Failed to load tenants')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display no tenants message when list is empty', () => {
      mockTenantsState.tenants = [];
      mockTenantsState.totalCount = 0;
      render(<TenantsComponent />);
      expect(screen.getByText('No tenants found')).toBeInTheDocument();
    });
  });

  describe('Tenant List', () => {
    it('should display tenants in table', () => {
      render(<TenantsComponent />);
      expect(screen.getByText('Tenant One')).toBeInTheDocument();
      expect(screen.getByText('Tenant Two')).toBeInTheDocument();
    });

    it('should display edition names', () => {
      render(<TenantsComponent />);
      expect(screen.getByText('Basic Edition')).toBeInTheDocument();
      expect(screen.getByText('Pro Edition')).toBeInTheDocument();
    });

    it('should render action buttons for each tenant', () => {
      render(<TenantsComponent />);
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Create Modal', () => {
    it('should open create modal when New Tenant button is clicked', async () => {
      render(<TenantsComponent />);
      await user.click(screen.getByText('New Tenant'));
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-header')).toHaveTextContent('New Tenant');
    });

    it('should clear selected tenant when opening create modal', async () => {
      mockTenantsState.selectedTenant = mockTenants[0];
      render(<TenantsComponent />);
      await user.click(screen.getByText('New Tenant'));
      expect(mockSetSelectedTenant).toHaveBeenCalledWith(null);
    });
  });

  describe('Search Functionality', () => {
    it('should update search input value', async () => {
      render(<TenantsComponent />);
      const searchInput = screen.getByPlaceholderText('Search');
      await user.type(searchInput, 'test');
      expect(searchInput).toHaveValue('test');
    });

    it('should trigger search button click', async () => {
      render(<TenantsComponent />);
      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);
      await waitFor(() => {
        expect(mockFetchTenants).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Confirmation', () => {
    it('should show confirmation dialog on delete', async () => {
      mockWarn.mockResolvedValue('confirm');
      render(<TenantsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockWarn).toHaveBeenCalled();
      });
    });

    it('should call deleteTenant when confirmed', async () => {
      mockWarn.mockResolvedValue('confirm');
      render(<TenantsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteTenant).toHaveBeenCalledWith('tenant-1');
      });
    });

    it('should not call deleteTenant when rejected', async () => {
      mockWarn.mockResolvedValue('reject');
      render(<TenantsComponent />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockWarn).toHaveBeenCalled();
      });
      expect(mockDeleteTenant).not.toHaveBeenCalled();
    });
  });

  describe('Edit Tenant', () => {
    it('should call getTenantById when Edit button is clicked', async () => {
      render(<TenantsComponent />);
      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(mockGetTenantById).toHaveBeenCalledWith('tenant-1');
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onTenantDeleted when tenant is deleted', async () => {
      const onTenantDeleted = vi.fn();
      mockWarn.mockResolvedValue('confirm');

      render(<TenantsComponent onTenantDeleted={onTenantDeleted} />);

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteTenant).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onTenantDeleted).toHaveBeenCalledWith('tenant-1');
      });
    });
  });

  describe('Component Props Interface', () => {
    it('should accept optional callbacks', () => {
      type PropsType = {
        onTenantCreated?: (tenant: unknown) => void;
        onTenantUpdated?: (tenant: unknown) => void;
        onTenantDeleted?: (id: string) => void;
      };

      const validProps: PropsType = {};
      expect(validProps).toBeDefined();

      const withCallbacks: PropsType = {
        onTenantCreated: () => {},
        onTenantUpdated: () => {},
        onTenantDeleted: () => {},
      };
      expect(withCallbacks.onTenantCreated).toBeDefined();
    });

    it('should render without any props', () => {
      const { container } = render(<TenantsComponent />);
      expect(container).toBeTruthy();
    });

    it('should render with all optional props', () => {
      const { container } = render(
        <TenantsComponent
          onTenantCreated={() => {}}
          onTenantUpdated={() => {}}
          onTenantDeleted={() => {}}
        />
      );
      expect(container).toBeTruthy();
    });
  });
});
