import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TenantBox } from '../components/TenantBox';

const mockFindTenant = vi.fn();
const mockDispatch = vi.fn();
const mockToasterError = vi.fn();

vi.mock('../hooks/useAccountProService', () => ({
  useAccountProService: () => ({ findTenant: mockFindTenant }),
}));

vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({ t: (key: string, ...args: any[]) => args.length > 0 ? `${key}:${args[0]}` : key }),
  sessionActions: { setTenant: vi.fn((tenant) => ({ type: 'SET_TENANT', payload: tenant })) },
  selectTenant: () => ({ id: '', name: '' }),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => selector(),
}));

vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ children, visible, onVisibleChange, header, footer }: any) => {
    if (!visible) return null;
    return (
      <div role="dialog" data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    );
  },
  Button: ({ children, loading, onClick, ...props }: any) => (
    <button onClick={onClick} disabled={loading} {...props}>{loading ? 'Loading...' : children}</button>
  ),
  useToaster: () => ({ success: vi.fn(), error: mockToasterError }),
}));

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

describe('TenantBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tenant box with not selected', () => {
    renderWithRouter(<TenantBox />);
    expect(screen.getByText(/AbpUiMultiTenancy::Tenant/)).toBeInTheDocument();
    expect(screen.getByText('AbpUiMultiTenancy::NotSelected')).toBeInTheDocument();
    expect(screen.getByText('AbpUiMultiTenancy::Switch')).toBeInTheDocument();
  });

  it('should open modal when switch is clicked', async () => {
    renderWithRouter(<TenantBox />);
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  it('should close modal when cancel is clicked', async () => {
    renderWithRouter(<TenantBox />);
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('AbpTenantManagement::Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should display modal header when opened', async () => {
    renderWithRouter(<TenantBox />);

    // Open modal
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-header')).toHaveTextContent('AbpUiMultiTenancy::SwitchTenant');
    });
  });

  it('should have form elements in the modal', async () => {
    renderWithRouter(<TenantBox />);

    // Open modal
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check for form elements
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('AbpTenantManagement::Save')).toBeInTheDocument();
    expect(screen.getByText('AbpTenantManagement::Cancel')).toBeInTheDocument();
  });

  it('should clear tenant when name is empty', async () => {
    renderWithRouter(<TenantBox />);

    // Open modal
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Click save with empty name
    const saveButton = screen.getByText('AbpTenantManagement::Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('should render save button with correct text', async () => {
    renderWithRouter(<TenantBox />);

    // Open modal
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check for footer buttons
    const saveButton = screen.getByText('AbpTenantManagement::Save');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton.tagName.toLowerCase()).toBe('button');
  });

  it('should show tenant name input with id', async () => {
    renderWithRouter(<TenantBox />);

    // Open modal
    const switchLink = screen.getByText('AbpUiMultiTenancy::Switch');
    fireEvent.click(switchLink);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check for input
    const input = document.getElementById('tenant-name');
    expect(input).toBeInTheDocument();
    expect(input?.tagName.toLowerCase()).toBe('input');
  });
});
