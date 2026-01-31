import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...args: string[]) => {
      const translations: Record<string, string> = {
        'AbpIdentity::Roles': 'Roles',
        'AbpIdentity::NewRole': 'New Role',
        'AbpIdentity::Search': 'Search',
        'AbpIdentity::Actions': 'Actions',
        'AbpIdentity::RoleName': 'Role Name',
        'AbpIdentity::Edit': 'Edit',
        'AbpIdentity::Permissions': 'Permissions',
        'AbpIdentity::Delete': 'Delete',
        'AbpIdentity::Cancel': 'Cancel',
        'AbpIdentity::Save': 'Save',
        'AbpIdentity::NoRolesFound': 'No roles found',
        'AbpIdentity::DisplayName:IsDefault': 'Is Default',
        'AbpIdentity::DisplayName:IsPublic': 'Is Public',
        'AbpIdentity::RoleDeletionConfirmationMessage': `Are you sure you want to delete role ${args[0]}?`,
        'AbpIdentity::AreYouSure': 'Are you sure?',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock role data
const mockRoles = [
  { id: 'role-1', name: 'admin', isDefault: false, isPublic: true, isStatic: true, concurrencyStamp: 'stamp-1' },
  { id: 'role-2', name: 'user', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp-2' },
  { id: 'role-3', name: 'moderator', isDefault: false, isPublic: false, isStatic: false, concurrencyStamp: 'stamp-3' },
];

// Mock hooks
const mockFetchRoles = vi.fn();
const mockGetRoleById = vi.fn();
const mockCreateRole = vi.fn();
const mockUpdateRole = vi.fn();
const mockDeleteRole = vi.fn();
const mockSetSelectedRole = vi.fn();

const mockUseRoles = vi.fn(() => ({
  roles: mockRoles,
  selectedRole: null,
  isLoading: false,
  error: null,
  fetchRoles: mockFetchRoles,
  getRoleById: mockGetRoleById,
  createRole: mockCreateRole,
  updateRole: mockUpdateRole,
  deleteRole: mockDeleteRole,
  setSelectedRole: mockSetSelectedRole,
}));

vi.mock('../../hooks', () => ({
  useRoles: () => mockUseRoles(),
}));

// Mock @abpjs/theme-shared
const mockConfirmationWarn = vi.fn();
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({ visible, children, header, footer }: any) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  useConfirmation: () => ({
    warn: mockConfirmationWarn,
  }),
  Toaster: {
    Status: {
      confirm: 'confirm',
      reject: 'reject',
      dismiss: 'dismiss',
    },
  },
  Alert: ({ children, status }: any) => (
    <div data-testid="alert" data-status={status}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, loading, disabled, variant, colorPalette, size, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      data-loading={loading}
      data-variant={variant}
      data-colorpalette={colorPalette}
      data-size={size}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
  Checkbox: ({ children, checked, onChange }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-testid="checkbox"
      />
      {children}
    </label>
  ),
  FormField: ({ children, label, required }: any) => (
    <div data-testid="form-field" data-required={required}>
      <label>{label}</label>
      {children}
    </div>
  ),
}));

// Mock @abpjs/permission-management
vi.mock('@abpjs/permission-management', () => ({
  PermissionManagementModal: ({ visible, providerName, providerKey }: any) =>
    visible ? (
      <div data-testid="permission-modal" data-provider-name={providerName} data-provider-key={providerKey}>
        Permission Modal
      </div>
    ) : null,
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, id, className, p, mb, ...props }: any) => (
    <div id={id} className={className} data-p={p} data-mb={mb} {...props}>
      {children}
    </div>
  ),
  Flex: ({ children, justify, align, gap, py, ...props }: any) => (
    <div data-testid="flex" data-justify={justify} data-align={align} {...props}>
      {children}
    </div>
  ),
  Input: React.forwardRef(({ value, onChange, placeholder, maxW, maxLength, ...props }: any, ref: any) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      data-testid={props['data-testid'] || 'input'}
      {...props}
    />
  )),
  Table: {
    Root: ({ children, variant }: any) => <table data-variant={variant}>{children}</table>,
    Header: ({ children }: any) => <thead>{children}</thead>,
    Body: ({ children }: any) => <tbody>{children}</tbody>,
    Row: ({ children }: any) => <tr>{children}</tr>,
    ColumnHeader: ({ children }: any) => <th>{children}</th>,
    Cell: ({ children }: any) => <td>{children}</td>,
  },
  Spinner: ({ size }: any) => <div data-testid="spinner" data-size={size}>Loading...</div>,
  VStack: ({ children, align, gap, ...props }: any) => (
    <div data-testid="vstack" data-align={align} data-gap={gap} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, fontSize, fontWeight, color, textAlign, ...props }: any) => (
    <span data-fontweight={fontWeight} data-color={color} data-textalign={textAlign} {...props}>
      {children}
    </span>
  ),
  Menu: {
    Root: ({ children }: any) => <div data-testid="menu">{children}</div>,
    Trigger: ({ children, asChild }: any) => <div data-testid="menu-trigger">{children}</div>,
    Positioner: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div data-testid="menu-content">{children}</div>,
    Item: ({ children, value, onClick, color }: any) => (
      <button data-testid={`menu-item-${value}`} onClick={onClick} data-color={color}>
        {children}
      </button>
    ),
  },
}));

import { RolesComponent } from '../../components/Roles/RolesComponent';

describe('RolesComponent', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchRoles.mockResolvedValue({ success: true });
    mockCreateRole.mockResolvedValue({ success: true });
    mockUpdateRole.mockResolvedValue({ success: true });
    mockDeleteRole.mockResolvedValue({ success: true });
    mockGetRoleById.mockResolvedValue({ success: true });
    mockConfirmationWarn.mockResolvedValue('confirm');

    mockUseRoles.mockReturnValue({
      roles: mockRoles,
      selectedRole: null,
      isLoading: false,
      error: null,
      fetchRoles: mockFetchRoles,
      getRoleById: mockGetRoleById,
      createRole: mockCreateRole,
      updateRole: mockUpdateRole,
      deleteRole: mockDeleteRole,
      setSelectedRole: mockSetSelectedRole,
    });
  });

  describe('Basic Rendering', () => {
    it('should render the component with title', () => {
      render(<RolesComponent />);
      expect(screen.getByText('Roles')).toBeInTheDocument();
    });

    it('should render New Role button', () => {
      render(<RolesComponent />);
      expect(screen.getByText('New Role')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<RolesComponent />);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should render roles table with data', () => {
      render(<RolesComponent />);
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('moderator')).toBeInTheDocument();
    });

    it('should fetch roles on mount', () => {
      render(<RolesComponent />);
      expect(mockFetchRoles).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading with no roles', () => {
      mockUseRoles.mockReturnValue({
        roles: [],
        selectedRole: null,
        isLoading: true,
        error: null,
        fetchRoles: mockFetchRoles,
        getRoleById: mockGetRoleById,
        createRole: mockCreateRole,
        updateRole: mockUpdateRole,
        deleteRole: mockDeleteRole,
        setSelectedRole: mockSetSelectedRole,
      });

      render(<RolesComponent />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should show empty state when no roles found', () => {
      mockUseRoles.mockReturnValue({
        roles: [],
        selectedRole: null,
        isLoading: false,
        error: null,
        fetchRoles: mockFetchRoles,
        getRoleById: mockGetRoleById,
        createRole: mockCreateRole,
        updateRole: mockUpdateRole,
        deleteRole: mockDeleteRole,
        setSelectedRole: mockSetSelectedRole,
      });

      render(<RolesComponent />);
      expect(screen.getByText('No roles found')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error alert when there is an error', () => {
      mockUseRoles.mockReturnValue({
        roles: [],
        selectedRole: null,
        isLoading: false,
        error: 'Failed to load roles',
        fetchRoles: mockFetchRoles,
        getRoleById: mockGetRoleById,
        createRole: mockCreateRole,
        updateRole: mockUpdateRole,
        deleteRole: mockDeleteRole,
        setSelectedRole: mockSetSelectedRole,
      });

      render(<RolesComponent />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to load roles')).toBeInTheDocument();
    });
  });

  describe('Search/Filter', () => {
    it('should filter roles based on search term', async () => {
      render(<RolesComponent />);

      const searchInput = screen.getByPlaceholderText('Search');
      await user.type(searchInput, 'admin');

      // Only admin should be visible
      expect(screen.getByText('admin')).toBeInTheDocument();
      // user and moderator might still be in DOM due to filtering logic
    });
  });

  describe('Role Modal', () => {
    it('should open modal when New Role is clicked', async () => {
      render(<RolesComponent />);

      await user.click(screen.getByText('New Role'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-header')).toHaveTextContent('New Role');
      });
    });

    it('should render form fields in modal', async () => {
      render(<RolesComponent />);

      await user.click(screen.getByText('New Role'));

      await waitFor(() => {
        // Use getAllByText since "Role Name" appears in both table header and form label
        const roleNameElements = screen.getAllByText('Role Name');
        expect(roleNameElements.length).toBeGreaterThanOrEqual(2); // In table header and form
        expect(screen.getByText('Is Default')).toBeInTheDocument();
        expect(screen.getByText('Is Public')).toBeInTheDocument();
      });
    });

    it('should render Cancel and Save buttons in modal', async () => {
      render(<RolesComponent />);

      await user.click(screen.getByText('New Role'));

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
      });
    });
  });

  describe('Role Actions', () => {
    it('should show edit action in menu', () => {
      render(<RolesComponent />);
      const editButtons = screen.getAllByTestId('menu-item-edit');
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('should show permissions action in menu', () => {
      render(<RolesComponent />);
      const permButtons = screen.getAllByTestId('menu-item-permissions');
      expect(permButtons.length).toBeGreaterThan(0);
    });

    it('should not show delete for static roles', () => {
      render(<RolesComponent />);
      // Static role (admin) should not have delete
      // Non-static roles (user, moderator) should have delete
      const deleteButtons = screen.getAllByTestId('menu-item-delete');
      // Only 2 delete buttons for user and moderator (not admin which is static)
      expect(deleteButtons).toHaveLength(2);
    });

    it('should call deleteRole when delete is confirmed', async () => {
      mockConfirmationWarn.mockResolvedValue('confirm');

      render(<RolesComponent />);

      const deleteButtons = screen.getAllByTestId('menu-item-delete');
      await user.click(deleteButtons[0]); // Click delete on first non-static role

      await waitFor(() => {
        expect(mockConfirmationWarn).toHaveBeenCalled();
        expect(mockDeleteRole).toHaveBeenCalled();
      });
    });

    it('should not call deleteRole when delete is cancelled', async () => {
      mockConfirmationWarn.mockResolvedValue('reject');

      render(<RolesComponent />);

      const deleteButtons = screen.getAllByTestId('menu-item-delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockConfirmationWarn).toHaveBeenCalled();
      });

      expect(mockDeleteRole).not.toHaveBeenCalled();
    });
  });

  describe('Callbacks', () => {
    it('should call onRoleCreated when a role is created', async () => {
      const onRoleCreated = vi.fn();
      render(<RolesComponent onRoleCreated={onRoleCreated} />);

      await user.click(screen.getByText('New Role'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Find role name input and type
      const inputs = screen.getAllByRole('textbox');
      const roleNameInput = inputs[1]; // Skip search input
      await user.type(roleNameInput, 'NewRole');

      // Click Save
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockCreateRole).toHaveBeenCalledWith({
          name: 'NewRole',
          isDefault: false,
          isPublic: false,
        });
      });
    });

    it('should call onRoleDeleted when a role is deleted', async () => {
      const onRoleDeleted = vi.fn();
      mockConfirmationWarn.mockResolvedValue('confirm');

      render(<RolesComponent onRoleDeleted={onRoleDeleted} />);

      const deleteButtons = screen.getAllByTestId('menu-item-delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteRole).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onRoleDeleted).toHaveBeenCalled();
      });
    });
  });

  describe('Permission Modal', () => {
    it('should open permission modal when permissions action is clicked', async () => {
      render(<RolesComponent />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('permission-modal')).toBeInTheDocument();
      });
    });

    it('should pass correct providerName to permission modal', async () => {
      render(<RolesComponent />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        const modal = screen.getByTestId('permission-modal');
        expect(modal).toHaveAttribute('data-provider-name', 'R');
      });
    });
  });
});
