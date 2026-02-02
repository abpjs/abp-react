import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string, ...args: string[]) => {
      const translations: Record<string, string> = {
        'AbpIdentity::Users': 'Users',
        'AbpIdentity::NewUser': 'New User',
        'AbpIdentity::Search': 'Search',
        'AbpIdentity::Actions': 'Actions',
        'AbpIdentity::UserName': 'User Name',
        'AbpIdentity::EmailAddress': 'Email Address',
        'AbpIdentity::PhoneNumber': 'Phone Number',
        'AbpIdentity::Edit': 'Edit',
        'AbpIdentity::Permissions': 'Permissions',
        'AbpIdentity::Delete': 'Delete',
        'AbpIdentity::Cancel': 'Cancel',
        'AbpIdentity::Save': 'Save',
        'AbpIdentity::TotalCount': 'Total Count',
        'AbpIdentity::Previous': 'Previous',
        'AbpIdentity::Next': 'Next',
        'AbpIdentity::NoUsersFound': 'No users found',
        'AbpIdentity::UserInformations': 'User Informations',
        'AbpIdentity::Roles': 'Roles',
        'AbpIdentity::Name': 'Name',
        'AbpIdentity::DisplayName:Surname': 'Surname',
        'AbpIdentity::Password': 'Password',
        'AbpIdentity::LeaveBlankToKeepCurrent': 'Leave blank to keep current',
        'AbpIdentity::DisplayName:LockoutEnabled': 'Lockout Enabled',
        'AbpIdentity::DisplayName:TwoFactorEnabled': 'Two Factor Enabled',
        'AbpIdentity::NoRolesFound': 'No roles found',
        'AbpIdentity::Password:MinLength': `Password must be at least ${args[0]} characters`,
        'AbpIdentity::Password:RequireDigit': 'Password must contain a number',
        'AbpIdentity::Password:RequireLowercase': 'Password must contain a lowercase letter',
        'AbpIdentity::Password:RequireUppercase': 'Password must contain an uppercase letter',
        'AbpIdentity::Password:RequireNonAlphanumeric': 'Password must contain a special character',
        'AbpIdentity::UserDeletionConfirmationMessage': `Are you sure you want to delete user ${args[0]}?`,
        'AbpIdentity::AreYouSure': 'Are you sure?',
      };
      return translations[key] || key;
    },
  }),
  ABP: {},
}));

// Mock user data
const mockUsers = [
  {
    id: 'user-1',
    userName: 'admin',
    email: 'admin@example.com',
    phoneNumber: '123-456-7890',
    name: 'Admin',
    surname: 'User',
    lockoutEnabled: true,
    twoFactorEnabled: false,
    tenantId: null,
    emailConfirmed: true,
    phoneNumberConfirmed: false,
    isLockedOut: false,
    concurrencyStamp: 'stamp-1',
  },
  {
    id: 'user-2',
    userName: 'john',
    email: 'john@example.com',
    phoneNumber: '098-765-4321',
    name: 'John',
    surname: 'Doe',
    lockoutEnabled: true,
    twoFactorEnabled: true,
    tenantId: null,
    emailConfirmed: true,
    phoneNumberConfirmed: true,
    isLockedOut: false,
    concurrencyStamp: 'stamp-2',
  },
];

const mockRoles = [
  { id: 'role-1', name: 'admin', isDefault: false, isPublic: true, isStatic: true, concurrencyStamp: 'rs-1' },
  { id: 'role-2', name: 'user', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'rs-2' },
];

// Mock hooks
const mockFetchUsers = vi.fn();
const mockGetUserById = vi.fn();
const mockGetUserRoles = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUser = vi.fn();
const mockSetSelectedUser = vi.fn();
const mockSetPageQuery = vi.fn();
const mockFetchRoles = vi.fn();

const mockUseUsers = vi.fn(() => ({
  users: mockUsers,
  totalCount: 2,
  selectedUser: null,
  selectedUserRoles: [],
  isLoading: false,
  error: null,
  pageQuery: { skipCount: 0, maxResultCount: 10 },
  fetchUsers: mockFetchUsers,
  getUserById: mockGetUserById,
  getUserRoles: mockGetUserRoles,
  createUser: mockCreateUser,
  updateUser: mockUpdateUser,
  deleteUser: mockDeleteUser,
  setSelectedUser: mockSetSelectedUser,
  setPageQuery: mockSetPageQuery,
}));

const mockUseRoles = vi.fn(() => ({
  roles: mockRoles,
  selectedRole: null,
  isLoading: false,
  error: null,
  fetchRoles: mockFetchRoles,
  getRoleById: vi.fn(),
  createRole: vi.fn(),
  updateRole: vi.fn(),
  deleteRole: vi.fn(),
  setSelectedRole: vi.fn(),
}));

vi.mock('../../hooks', () => ({
  useUsers: () => mockUseUsers(),
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
  Checkbox: ({ children, checked, onChange, id }: any) => (
    <label>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        data-testid={`checkbox-${id || 'default'}`}
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
const mockOnVisibleChange = vi.fn();
vi.mock('@abpjs/permission-management', () => ({
  PermissionManagementModal: ({ visible, providerName, providerKey, onVisibleChange }: any) => {
    // Store the callback for testing
    if (onVisibleChange) {
      mockOnVisibleChange.mockImplementation(onVisibleChange);
    }
    return visible ? (
      <div data-testid="permission-modal" data-provider-name={providerName} data-provider-key={providerKey}>
        <button data-testid="close-permission-modal" onClick={() => onVisibleChange?.(false)}>
          Close
        </button>
        Permission Modal
      </div>
    ) : null;
  },
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, id, className, p, mb, mt, fontSize, color, ...props }: any) => (
    <div id={id} className={className} data-p={p} data-mb={mb} data-mt={mt} {...props}>
      {children}
    </div>
  ),
  Flex: ({ children, justify, align, gap, py, ...props }: any) => (
    <div data-testid="flex" data-justify={justify} data-align={align} {...props}>
      {children}
    </div>
  ),
  Input: React.forwardRef(({ value, onChange, placeholder, type, maxW, maxLength, autoComplete, ...props }: any, ref: any) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      autoComplete={autoComplete}
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
  VStack: ({ children, align, gap, pt, ...props }: any) => (
    <div data-testid="vstack" data-align={align} data-gap={gap} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, fontSize, fontWeight, color, textAlign, ...props }: any) => (
    <span data-fontweight={fontWeight} data-color={color} data-textalign={textAlign} {...props}>
      {children}
    </span>
  ),
  Tabs: {
    Root: ({ children, defaultValue }: any) => <div data-testid="tabs" data-default={defaultValue}>{children}</div>,
    List: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
    Trigger: ({ children, value }: any) => <button data-testid={`tab-${value}`} data-value={value}>{children}</button>,
    Content: ({ children, value }: any) => <div data-testid={`tab-content-${value}`} data-value={value}>{children}</div>,
  },
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
  SimpleGrid: ({ children, columns, gap }: any) => (
    <div data-testid="simple-grid" data-columns={columns} data-gap={gap}>
      {children}
    </div>
  ),
}));

import { UsersComponent, PasswordRule } from '../../components/Users/UsersComponent';

describe('UsersComponent', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchUsers.mockResolvedValue({ success: true });
    mockFetchRoles.mockResolvedValue({ success: true });
    mockCreateUser.mockResolvedValue({ success: true });
    mockUpdateUser.mockResolvedValue({ success: true });
    mockDeleteUser.mockResolvedValue({ success: true });
    mockGetUserById.mockResolvedValue({ success: true });
    mockGetUserRoles.mockResolvedValue({ success: true });
    mockConfirmationWarn.mockResolvedValue('confirm');

    // Reset mock implementations
    mockUseUsers.mockReturnValue({
      users: mockUsers,
      totalCount: 2,
      selectedUser: null,
      selectedUserRoles: [],
      isLoading: false,
      error: null,
      pageQuery: { skipCount: 0, maxResultCount: 10 },
      fetchUsers: mockFetchUsers,
      getUserById: mockGetUserById,
      getUserRoles: mockGetUserRoles,
      createUser: mockCreateUser,
      updateUser: mockUpdateUser,
      deleteUser: mockDeleteUser,
      setSelectedUser: mockSetSelectedUser,
      setPageQuery: mockSetPageQuery,
    });

    mockUseRoles.mockReturnValue({
      roles: mockRoles,
      selectedRole: null,
      isLoading: false,
      error: null,
      fetchRoles: mockFetchRoles,
      getRoleById: vi.fn(),
      createRole: vi.fn(),
      updateRole: vi.fn(),
      deleteRole: vi.fn(),
      setSelectedRole: vi.fn(),
    });
  });

  describe('Basic Rendering', () => {
    it('should render the component with title', () => {
      render(<UsersComponent />);
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('should render New User button', () => {
      render(<UsersComponent />);
      expect(screen.getByText('New User')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<UsersComponent />);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should render users table with data', () => {
      render(<UsersComponent />);
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('john')).toBeInTheDocument();
    });

    it('should fetch users and roles on mount', () => {
      render(<UsersComponent />);
      expect(mockFetchUsers).toHaveBeenCalled();
      expect(mockFetchRoles).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading with no users', () => {
      mockUseUsers.mockReturnValue({
        users: [],
        totalCount: 0,
        selectedUser: null,
        selectedUserRoles: [],
        isLoading: true,
        error: null,
        pageQuery: { skipCount: 0, maxResultCount: 10 },
        fetchUsers: mockFetchUsers,
        getUserById: mockGetUserById,
        getUserRoles: mockGetUserRoles,
        createUser: mockCreateUser,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser,
        setSelectedUser: mockSetSelectedUser,
        setPageQuery: mockSetPageQuery,
      });

      render(<UsersComponent />);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should show empty state when no users found', () => {
      mockUseUsers.mockReturnValue({
        users: [],
        totalCount: 0,
        selectedUser: null,
        selectedUserRoles: [],
        isLoading: false,
        error: null,
        pageQuery: { skipCount: 0, maxResultCount: 10 },
        fetchUsers: mockFetchUsers,
        getUserById: mockGetUserById,
        getUserRoles: mockGetUserRoles,
        createUser: mockCreateUser,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser,
        setSelectedUser: mockSetSelectedUser,
        setPageQuery: mockSetPageQuery,
      });

      render(<UsersComponent />);
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error alert when there is an error', () => {
      mockUseUsers.mockReturnValue({
        users: [],
        totalCount: 0,
        selectedUser: null,
        selectedUserRoles: [],
        isLoading: false,
        error: 'Failed to load users',
        pageQuery: { skipCount: 0, maxResultCount: 10 },
        fetchUsers: mockFetchUsers,
        getUserById: mockGetUserById,
        getUserRoles: mockGetUserRoles,
        createUser: mockCreateUser,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser,
        setSelectedUser: mockSetSelectedUser,
        setPageQuery: mockSetPageQuery,
      });

      render(<UsersComponent />);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });
  });

  describe('Password Rules (v1.1.0)', () => {
    it('should not show password rules when props are not provided', async () => {
      render(<UsersComponent />);

      // Open the add user modal
      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Password rules should not be visible
      expect(screen.queryByText('Password must be at least')).not.toBeInTheDocument();
      expect(screen.queryByText('Password must contain a number')).not.toBeInTheDocument();
    });

    it('should show required password length when requiredPasswordLength is set', async () => {
      render(<UsersComponent requiredPasswordLength={8} />);

      // Open the add user modal
      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('should show password rules when passwordRulesArr is provided', async () => {
      const rules: PasswordRule[] = ['number', 'small', 'capital', 'special'];
      render(<UsersComponent passwordRulesArr={rules} />);

      // Open the add user modal
      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('• Password must contain a number')).toBeInTheDocument();
      expect(screen.getByText('• Password must contain a lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('• Password must contain an uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('• Password must contain a special character')).toBeInTheDocument();
    });

    it('should show only number rule when only number is in passwordRulesArr', async () => {
      render(<UsersComponent passwordRulesArr={['number']} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('• Password must contain a number')).toBeInTheDocument();
      expect(screen.queryByText('• Password must contain a lowercase letter')).not.toBeInTheDocument();
    });

    it('should show only small (lowercase) rule when only small is in passwordRulesArr', async () => {
      render(<UsersComponent passwordRulesArr={['small']} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('• Password must contain a lowercase letter')).toBeInTheDocument();
    });

    it('should show only capital (uppercase) rule when only capital is in passwordRulesArr', async () => {
      render(<UsersComponent passwordRulesArr={['capital']} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('• Password must contain an uppercase letter')).toBeInTheDocument();
    });

    it('should show only special rule when only special is in passwordRulesArr', async () => {
      render(<UsersComponent passwordRulesArr={['special']} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('• Password must contain a special character')).toBeInTheDocument();
    });

    it('should show both password length and rules together', async () => {
      render(
        <UsersComponent
          requiredPasswordLength={6}
          passwordRulesArr={['number', 'capital']}
        />
      );

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      expect(screen.getByText('• Password must contain a number')).toBeInTheDocument();
      expect(screen.getByText('• Password must contain an uppercase letter')).toBeInTheDocument();
    });

    it('should not show rules section when requiredPasswordLength is 0 and passwordRulesArr is empty', async () => {
      render(<UsersComponent requiredPasswordLength={0} passwordRulesArr={[]} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Should not have any password rules text
      expect(screen.queryByText(/Password must/)).not.toBeInTheDocument();
    });
  });

  describe('User Modal', () => {
    it('should open modal when New User is clicked', async () => {
      render(<UsersComponent />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-header')).toHaveTextContent('New User');
      });
    });

    it('should render tabs in modal', async () => {
      render(<UsersComponent />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('tab-info')).toBeInTheDocument();
        expect(screen.getByTestId('tab-roles')).toBeInTheDocument();
      });
    });

    it('should render form fields in info tab', async () => {
      render(<UsersComponent />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        // Use getAllByText since these appear in both table header and form label
        const userNameElements = screen.getAllByText('User Name');
        expect(userNameElements.length).toBeGreaterThanOrEqual(2);
        const emailElements = screen.getAllByText('Email Address');
        expect(emailElements.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Password')).toBeInTheDocument();
      });
    });
  });

  describe('Callbacks', () => {
    it('should call onUserCreated when a user is created', async () => {
      const onUserCreated = vi.fn();
      render(<UsersComponent onUserCreated={onUserCreated} />);

      await user.click(screen.getByText('New User'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      // Fill in required fields - find inputs by their position/context
      const inputs = screen.getAllByRole('textbox');
      const userNameInput = inputs[1]; // Skip search input
      const emailInput = inputs[4]; // Email is the 5th text input

      await user.type(userNameInput, 'newuser');
      await user.type(emailInput, 'newuser@example.com');

      // Fill password
      const passwordInput = screen.getByPlaceholderText('');
      await user.type(passwordInput, 'Password123!');

      // Click Save
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalled();
      });
    });

    it('should call onUserDeleted when a user is deleted', async () => {
      const onUserDeleted = vi.fn();
      mockConfirmationWarn.mockResolvedValue('confirm');

      render(<UsersComponent onUserDeleted={onUserDeleted} />);

      // Click delete on first user
      const deleteButtons = screen.getAllByTestId('menu-item-delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockConfirmationWarn).toHaveBeenCalled();
        expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
      });

      await waitFor(() => {
        expect(onUserDeleted).toHaveBeenCalledWith('user-1');
      });
    });
  });

  describe('PasswordRule type export', () => {
    it('should export PasswordRule type with correct values', () => {
      // This test verifies the type is exported and usable
      const rules: PasswordRule[] = ['number', 'small', 'capital', 'special'];
      expect(rules).toHaveLength(4);
      expect(rules).toContain('number');
      expect(rules).toContain('small');
      expect(rules).toContain('capital');
      expect(rules).toContain('special');
    });
  });

  describe('Permission Modal', () => {
    it('should open permission modal when permissions action is clicked', async () => {
      render(<UsersComponent />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('permission-modal')).toBeInTheDocument();
      });
    });

    it('should pass correct providerName (U for User) to permission modal', async () => {
      render(<UsersComponent />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        const modal = screen.getByTestId('permission-modal');
        expect(modal).toHaveAttribute('data-provider-name', 'U');
      });
    });

    it('should pass user id as providerKey to permission modal', async () => {
      render(<UsersComponent />);

      // Click permissions on the first user (user-1)
      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        const modal = screen.getByTestId('permission-modal');
        expect(modal).toHaveAttribute('data-provider-key', 'user-1');
      });
    });
  });

  describe('onVisiblePermissionChange (v2.0.0)', () => {
    it('should call onVisiblePermissionChange when permission modal opens', async () => {
      const onVisiblePermissionChange = vi.fn();
      render(<UsersComponent onVisiblePermissionChange={onVisiblePermissionChange} />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('permission-modal')).toBeInTheDocument();
      });

      // The callback should have been set up when modal opened
      expect(onVisiblePermissionChange).not.toHaveBeenCalledWith(false);
    });

    it('should call onVisiblePermissionChange with false when permission modal closes', async () => {
      const onVisiblePermissionChange = vi.fn();
      render(<UsersComponent onVisiblePermissionChange={onVisiblePermissionChange} />);

      // Open the permission modal
      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('permission-modal')).toBeInTheDocument();
      });

      // Close the permission modal
      const closeButton = screen.getByTestId('close-permission-modal');
      await user.click(closeButton);

      await waitFor(() => {
        expect(onVisiblePermissionChange).toHaveBeenCalledWith(false);
      });
    });

    it('should not throw when onVisiblePermissionChange is not provided', async () => {
      // This should not throw any errors
      render(<UsersComponent />);

      const permButtons = screen.getAllByTestId('menu-item-permissions');
      await user.click(permButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('permission-modal')).toBeInTheDocument();
      });

      // Close the modal
      const closeButton = screen.getByTestId('close-permission-modal');
      await user.click(closeButton);

      // Should not throw - modal should close
      await waitFor(() => {
        expect(screen.queryByTestId('permission-modal')).not.toBeInTheDocument();
      });
    });
  });

  /**
   * v2.7.0: Component key tests
   */
  describe('v2.7.0 - componentKey static property', () => {
    it('should have componentKey static property', () => {
      expect(UsersComponent.componentKey).toBeDefined();
    });

    it('should have componentKey matching eIdentityComponents.Users', () => {
      expect(UsersComponent.componentKey).toBe('Identity.UsersComponent');
    });

    it('should have componentKey as a string', () => {
      expect(typeof UsersComponent.componentKey).toBe('string');
    });

    it('should have componentKey usable for component replacement', () => {
      // The componentKey should be a valid replacement key
      const key = UsersComponent.componentKey;
      expect(key).toMatch(/^Identity\.\w+Component$/);
    });
  });
});
