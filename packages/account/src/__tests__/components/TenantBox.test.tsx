import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, className, style, ...props }: any) => (
    <div className={className || props.class || 'tenant-switch-box'} style={style}>
      {children}
    </div>
  ),
  Text: ({ children, as: As = 'span', ...props }: any) => {
    const Tag = As || 'span';
    return <Tag {...props}>{children}</Tag>;
  },
  Link: ({ children, onClick, ...props }: any) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(e); }} {...props}>
      {children}
    </a>
  ),
  Input: React.forwardRef(({ ...props }: any, ref: any) => <input ref={ref} {...props} />),
  VStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock toaster
const mockToaster = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

// Mock account service
const mockAccountService = {
  findTenant: vi.fn(),
  register: vi.fn(),
};

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: vi.fn(() => ({
    t: (key: string, ...args: string[]) => {
      const translations: Record<string, string> = {
        'AbpUiMultiTenancy::Tenant': 'Tenant',
        'AbpUiMultiTenancy::NotSelected': 'Not selected',
        'AbpUiMultiTenancy::Switch': 'Switch',
        'AbpUiMultiTenancy::SwitchTenant': 'Switch Tenant',
        'AbpUiMultiTenancy::Name': 'Name',
        'AbpUiMultiTenancy::SwitchTenantHint': 'Leave empty to switch to the host.',
        'AbpUiMultiTenancy::GivenTenantIsNotAvailable': `Tenant "${args[0]}" is not available`,
        'AbpTenantManagement::Cancel': 'Cancel',
        'AbpTenantManagement::Save': 'Save',
        'AbpUi::Error': 'Error',
        'AbpUi::DefaultErrorMessage': 'An error occurred',
      };
      return translations[key] || key;
    },
  })),
  useDispatch: vi.fn(() => vi.fn()),
  sessionActions: {
    setTenant: vi.fn((tenant) => ({ type: 'session/setTenant', payload: tenant })),
  },
  selectTenant: (state: any) => state.session?.tenant || { id: '', name: '' },
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ visible, children, header, footer }: any) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  Button: ({ children, onClick, loading, ...props }: any) => (
    <button onClick={onClick} disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  ),
  useToaster: () => mockToaster,
}));

// Mock useAccountService
vi.mock('../../hooks/useAccountService', () => ({
  useAccountService: () => mockAccountService,
}));

import { TenantBox } from '../../components/TenantBox/TenantBox';

// Create mock store
const createMockStore = (tenant = { id: '', name: '' }) => {
  const sessionReducer = (
    state = { language: 'en', tenant },
    action: { type: string; payload?: any }
  ) => {
    if (action.type === 'session/setTenant') {
      return { ...state, tenant: action.payload };
    }
    return state;
  };

  return configureStore({
    reducer: combineReducers({
      session: sessionReducer,
    }),
  });
};

describe('TenantBox', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccountService.findTenant.mockReset();
  });

  const renderTenantBox = (tenant = { id: '', name: '' }, props = {}) => {
    const store = createMockStore(tenant);
    return {
      store,
      ...render(
        <Provider store={store}>
          <TenantBox {...props} />
        </Provider>
      ),
    };
  };

  it('should render tenant box with "Not selected" when no tenant', () => {
    renderTenantBox();

    expect(screen.getByText('Tenant:')).toBeInTheDocument();
    expect(screen.getByText('Not selected')).toBeInTheDocument();
    expect(screen.getByText('Switch')).toBeInTheDocument();
  });

  it('should render tenant name when tenant is selected', () => {
    renderTenantBox({ id: 'tenant-123', name: 'Test Tenant' });

    expect(screen.getByText('Test Tenant')).toBeInTheDocument();
  });

  it('should open modal when Switch is clicked', async () => {
    renderTenantBox();

    await user.click(screen.getByText('Switch'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toHaveTextContent('Switch Tenant');
  });

  it('should show hint text in modal', async () => {
    renderTenantBox();

    await user.click(screen.getByText('Switch'));

    expect(screen.getByText('Leave empty to switch to the host.')).toBeInTheDocument();
  });

  it('should have input field in modal', async () => {
    renderTenantBox();

    await user.click(screen.getByText('Switch'));

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should update input value when typing', async () => {
    renderTenantBox();

    await user.click(screen.getByText('Switch'));

    const input = screen.getByRole('textbox');
    await user.type(input, 'new-tenant');

    expect(input).toHaveValue('new-tenant');
  });

  it('should call findTenant when saving with tenant name', async () => {
    mockAccountService.findTenant.mockResolvedValue({
      success: true,
      tenantId: 'tenant-456',
    });

    renderTenantBox();

    await user.click(screen.getByText('Switch'));
    await user.type(screen.getByRole('textbox'), 'new-tenant');

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await user.click(saveButton);

    expect(mockAccountService.findTenant).toHaveBeenCalledWith('new-tenant');
  });

  it('should show error toast when tenant not found', async () => {
    mockAccountService.findTenant.mockResolvedValue({
      success: false,
      tenantId: '',
    });

    renderTenantBox();

    await user.click(screen.getByText('Switch'));
    await user.type(screen.getByRole('textbox'), 'invalid-tenant');

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalled();
    });
  });

  it('should clear tenant when saving with empty name', async () => {
    renderTenantBox({ id: 'tenant-123', name: 'Test' });

    await user.click(screen.getByText('Switch'));

    const input = screen.getByRole('textbox');
    await user.clear(input);

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await user.click(saveButton);

    // findTenant should not be called for empty tenant
    expect(mockAccountService.findTenant).not.toHaveBeenCalled();
  });

  it('should pre-fill input with current tenant name', async () => {
    renderTenantBox({ id: 'tenant-123', name: 'Current Tenant' });

    await user.click(screen.getByText('Switch'));

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Current Tenant');
  });

  it('should handle API error during tenant lookup', async () => {
    mockAccountService.findTenant.mockRejectedValue({
      error: { error: { message: 'Server error' } },
    });

    renderTenantBox();

    await user.click(screen.getByText('Switch'));
    await user.type(screen.getByRole('textbox'), 'test-tenant');

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToaster.error).toHaveBeenCalled();
    });
  });

  it('should submit form on Enter key', async () => {
    mockAccountService.findTenant.mockResolvedValue({
      success: true,
      tenantId: 'tenant-789',
    });

    renderTenantBox();

    await user.click(screen.getByText('Switch'));

    const input = screen.getByRole('textbox');
    await user.type(input, 'test-tenant');
    await user.type(input, '{enter}');

    await waitFor(() => {
      expect(mockAccountService.findTenant).toHaveBeenCalledWith('test-tenant');
    });
  });

  // v2.7.0: Component key tests
  describe('v2.7.0 - Component key', () => {
    it('should have componentKey static property', () => {
      expect(TenantBox.componentKey).toBeDefined();
    });

    it('should have componentKey matching eAccountComponents.TenantBox', () => {
      expect(TenantBox.componentKey).toBe('Account.TenantBoxComponent');
    });
  });

  // v2.7.0: TenantIdResponse.name property tests
  describe('v2.7.0 - TenantIdResponse.name support', () => {
    it('should use name from API response when available', async () => {
      mockAccountService.findTenant.mockResolvedValue({
        success: true,
        tenantId: 'tenant-123',
        name: 'Proper Tenant Name', // v2.7.0: API returns the proper name
      });

      const { store } = renderTenantBox();

      await user.click(screen.getByText('Switch'));
      await user.type(screen.getByRole('textbox'), 'proper-tenant');

      const saveButton = screen.getByRole('button', { name: /Save/i });
      await user.click(saveButton);

      await waitFor(() => {
        const state = store.getState();
        // Should use the name from API response
        expect(state.session.tenant.name).toBe('Proper Tenant Name');
      });
    });

    it('should fall back to input name when API response name is not provided', async () => {
      mockAccountService.findTenant.mockResolvedValue({
        success: true,
        tenantId: 'tenant-456',
        // name not provided in response (backward compatible)
      });

      const { store } = renderTenantBox();

      await user.click(screen.getByText('Switch'));
      await user.type(screen.getByRole('textbox'), 'input-tenant-name');

      const saveButton = screen.getByRole('button', { name: /Save/i });
      await user.click(saveButton);

      await waitFor(() => {
        const state = store.getState();
        // Should use the input name as fallback
        expect(state.session.tenant.name).toBe('input-tenant-name');
      });
    });

    it('should handle response with empty name string', async () => {
      mockAccountService.findTenant.mockResolvedValue({
        success: true,
        tenantId: 'tenant-789',
        name: '', // Empty string
      });

      const { store } = renderTenantBox();

      await user.click(screen.getByText('Switch'));
      await user.type(screen.getByRole('textbox'), 'fallback-name');

      const saveButton = screen.getByRole('button', { name: /Save/i });
      await user.click(saveButton);

      await waitFor(() => {
        const state = store.getState();
        // Should use input name when API returns empty string
        expect(state.session.tenant.name).toBe('fallback-name');
      });
    });
  });
});
