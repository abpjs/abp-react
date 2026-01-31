import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PermissionManagementModal } from '../components/PermissionManagementModal/PermissionManagementModal';
import type { PermissionManagement } from '../models';

// Mock data with grantedProviders for badge testing
const mockPermissionData: PermissionManagement.Response = {
  entityDisplayName: 'Admin Role',
  groups: [
    {
      name: 'IdentityManagement',
      displayName: 'Identity Management',
      permissions: [
        {
          name: 'AbpIdentity.Users',
          displayName: 'User Management',
          isGranted: true,
          parentName: '',
          allowedProviders: ['R', 'U'],
          grantedProviders: [
            { providerName: 'R', providerKey: 'admin' },
            { providerName: 'U', providerKey: 'user123' },
          ],
        },
        {
          name: 'AbpIdentity.Users.Create',
          displayName: 'Create Users',
          isGranted: true,
          parentName: 'AbpIdentity.Users',
          allowedProviders: ['R', 'U'],
          grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
        },
        {
          name: 'AbpIdentity.Roles',
          displayName: 'Role Management',
          isGranted: false,
          parentName: '',
          allowedProviders: ['R'],
          grantedProviders: [],
        },
      ],
    },
  ],
};

// Create hook state mock
const createHookMock = (overrides = {}) => ({
  groups: mockPermissionData.groups,
  entityDisplayName: mockPermissionData.entityDisplayName,
  selectedGroup: mockPermissionData.groups[0],
  permissions: [],
  isLoading: false,
  error: null,
  selectThisTab: false,
  selectAllTab: false,
  fetchPermissions: vi.fn().mockResolvedValue({ success: true }),
  savePermissions: vi.fn().mockResolvedValue({ success: true }),
  setSelectedGroup: vi.fn(),
  togglePermission: vi.fn(),
  toggleSelectThisTab: vi.fn(),
  toggleSelectAll: vi.fn(),
  getSelectedGroupPermissions: vi.fn().mockReturnValue(
    mockPermissionData.groups[0].permissions.map((p, index) => ({
      ...p,
      margin: index === 0 ? 0 : 20,
    }))
  ),
  isGranted: vi.fn().mockImplementation((name: string) => {
    const perm = mockPermissionData.groups[0].permissions.find((p) => p.name === name);
    return perm?.isGranted ?? false;
  }),
  isGrantedByOtherProviderName: vi.fn().mockImplementation(
    (grantedProviders: PermissionManagement.GrantedProvider[], providerName: string) => {
      return grantedProviders.some((p) => p.providerName !== providerName);
    }
  ),
  isGrantedByRole: vi.fn().mockReturnValue(false),
  reset: vi.fn(),
  ...overrides,
});

let mockHookReturn = createHookMock();

// Mock usePermissionManagement hook
vi.mock('../hooks', () => ({
  usePermissionManagement: () => mockHookReturn,
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  Modal: ({
    visible,
    children,
    header,
    footer,
  }: {
    visible: boolean;
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    onVisibleChange?: (visible: boolean) => void;
    size?: string;
  }) =>
    visible ? (
      <div data-testid="modal">
        <div data-testid="modal-header">{header}</div>
        <div data-testid="modal-body">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  Alert: ({ children, status }: { children: React.ReactNode; status: string }) => (
    <div data-testid={`alert-${status}`}>{children}</div>
  ),
  Button: ({
    children,
    onClick,
    disabled,
    loading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: string;
    colorPalette?: string;
  }) => (
    <button onClick={onClick} disabled={disabled || loading}>
      {children}
    </button>
  ),
  Checkbox: ({
    children,
    checked,
    onChange,
    id,
  }: {
    children: React.ReactNode;
    checked?: boolean;
    onChange?: () => void;
    id?: string;
    ref?: React.Ref<HTMLInputElement>;
  }) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} id={id} />
      {children}
    </label>
  ),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Badge: ({ children, colorPalette, size }: { children: React.ReactNode; colorPalette?: string; size?: string }) => (
    <span data-testid="badge" data-color={colorPalette} data-size={size}>
      {children}
    </span>
  ),
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div {...props}>{children}</div>
  ),
  Flex: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div style={{ display: 'flex' }} {...props}>
      {children}
    </div>
  ),
  Heading: ({
    children,
    as,
    size,
  }: {
    children: React.ReactNode;
    as?: string;
    size?: string;
    mb?: number;
  }) => {
    const Tag = (as || 'h1') as keyof JSX.IntrinsicElements;
    return <Tag data-size={size}>{children}</Tag>;
  },
  Spinner: ({ size }: { size?: string }) => <div data-testid="spinner" data-size={size} />,
  VStack: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }} {...props}>
      {children}
    </div>
  ),
}));

describe('PermissionManagementModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHookReturn = createHookMock();
  });

  describe('basic rendering', () => {
    it('should render modal when visible is true', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should not render modal when visible is false', () => {
      render(
        <PermissionManagementModal
          visible={false}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should display entity display name in header', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      const header = screen.getByTestId('modal-header');
      expect(header).toHaveTextContent('Admin Role');
    });

    it('should display permission groups', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      // Group name appears in left panel and as heading in right panel
      const elements = screen.getAllByText('Identity Management');
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display permissions for selected group', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Create Users')).toBeInTheDocument();
    });
  });

  describe('hideBadges prop (v1.1.0)', () => {
    it('should show provider badges by default when hideBadges is not set', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="U"
          providerKey="user123"
        />
      );

      // Badge should be shown for permissions granted by other providers
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show provider badges when hideBadges is false', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="U"
          providerKey="user123"
          hideBadges={false}
        />
      );

      // Badge should be shown for permissions granted by other providers
      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should hide provider badges when hideBadges is true', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="U"
          providerKey="user123"
          hideBadges={true}
        />
      );

      // No badges should be shown
      const badges = screen.queryAllByTestId('badge');
      expect(badges.length).toBe(0);
    });

    it('should show badge with provider name when permission is granted by other provider', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="U"
          providerKey="user123"
          hideBadges={false}
        />
      );

      // Should show 'R' badge for permissions granted by role
      const badges = screen.getAllByTestId('badge');
      const badgeTexts = badges.map((badge) => badge.textContent);
      expect(badgeTexts.some((text) => text?.includes('R'))).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should show spinner when loading and no groups', () => {
      mockHookReturn = createHookMock({
        isLoading: true,
        groups: [],
      });

      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should not show spinner when loading but groups exist', () => {
      mockHookReturn = createHookMock({
        isLoading: true,
      });

      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error alert when error exists', () => {
      mockHookReturn = createHookMock({
        error: 'Failed to load permissions',
      });

      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByTestId('alert-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load permissions')).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('should call fetchPermissions on mount when visible', async () => {
      const fetchPermissions = vi.fn().mockResolvedValue({ success: true });
      mockHookReturn = createHookMock({ fetchPermissions });

      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      await waitFor(() => {
        expect(fetchPermissions).toHaveBeenCalledWith('admin', 'R');
      });
    });

    it('should call reset when modal closes', async () => {
      const reset = vi.fn();
      mockHookReturn = createHookMock({ reset });

      const { rerender } = render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      rerender(
        <PermissionManagementModal
          visible={false}
          providerName="R"
          providerKey="admin"
        />
      );

      await waitFor(() => {
        expect(reset).toHaveBeenCalled();
      });
    });
  });

  describe('select all checkboxes', () => {
    it('should render select all in all tabs checkbox', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByText('AbpPermissionManagement::SelectAllInAllTabs')).toBeInTheDocument();
    });

    it('should render select all in this tab checkbox', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByText('AbpPermissionManagement::SelectAllInThisTab')).toBeInTheDocument();
    });
  });

  describe('footer buttons', () => {
    it('should render cancel and save buttons', () => {
      render(
        <PermissionManagementModal
          visible={true}
          providerName="R"
          providerKey="admin"
        />
      );

      expect(screen.getByText('AbpIdentity::Cancel')).toBeInTheDocument();
      expect(screen.getByText('AbpIdentity::Save')).toBeInTheDocument();
    });
  });
});
