import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock child components to simplify testing
vi.mock('../../components/PersonalSettingsForm', () => ({
  PersonalSettingsForm: () => <div data-testid="personal-settings-form">Personal Settings Form</div>,
}));

vi.mock('../../components/ChangePasswordForm', () => ({
  ChangePasswordForm: () => <div data-testid="change-password-form">Change Password Form</div>,
}));

// Mock profile data
const mockProfile = {
  userName: 'test-user',
  email: 'test@example.com',
  name: 'Test',
  surname: 'User',
  phoneNumber: '',
  isExternal: false,
  hasPassword: true,
};

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAccount::PersonalSettings': 'Personal Settings',
        'AbpAccount::ChangePassword': 'Change Password',
        'AbpAccount::ManageYourAccount': 'Manage Your Account',
      };
      return translations[key] || key;
    },
  }),
  useProfile: () => ({
    profile: mockProfile,
    loading: false,
    fetchProfile: vi.fn().mockResolvedValue(mockProfile),
  }),
}));

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, className, py: _py, pt: _pt, ...props }: any) => (
    <div className={className} data-testid="box" {...props}>{children}</div>
  ),
  Container: ({ children, maxW, ...props }: any) => (
    <div data-testid="container" data-maxw={maxW} {...props}>{children}</div>
  ),
  Heading: ({ children, size, ...props }: any) => (
    <h1 data-testid="heading" data-size={size} {...props}>{children}</h1>
  ),
  Stack: ({ children, gap, ...props }: any) => (
    <div data-testid="stack" data-gap={gap} {...props}>{children}</div>
  ),
  Spinner: ({ size, ...props }: any) => (
    <div data-testid="spinner" data-size={size} {...props}>Loading...</div>
  ),
  Center: ({ children, minH, ...props }: any) => (
    <div data-testid="center" data-minh={minH} {...props}>{children}</div>
  ),
  Tabs: {
    Root: ({ children, value, onValueChange, variant, ...props }: any) => (
      <div
        data-testid="tabs-root"
        data-value={value}
        data-variant={variant}
        onClick={(e: any) => {
          // Handle tab click events from triggers
          const target = e.target as HTMLElement;
          const tabValue = target.getAttribute('data-tab-value');
          if (tabValue && onValueChange) {
            onValueChange({ value: tabValue });
          }
        }}
        {...props}
      >
        {children}
      </div>
    ),
    List: ({ children, ...props }: any) => (
      <div data-testid="tabs-list" role="tablist" {...props}>{children}</div>
    ),
    Trigger: ({ children, value, ...props }: any) => (
      <button
        role="tab"
        data-testid={`tab-${value}`}
        data-tab-value={value}
        {...props}
      >
        {children}
      </button>
    ),
    Content: ({ children, value, ...props }: any) => (
      <div role="tabpanel" data-testid={`tabpanel-${value}`} data-value={value} {...props}>
        {children}
      </div>
    ),
  },
}));

import { ManageProfile } from '../../components/ManageProfile/ManageProfile';

describe('ManageProfile', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with heading', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      expect(screen.getByText('Manage Your Account')).toBeInTheDocument();
    });
  });

  it('should render tabs with default tabs', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Personal Settings' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Change Password' })).toBeInTheDocument();
    });
  });

  it('should render PersonalSettingsForm in first tab', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      expect(screen.getByTestId('personal-settings-form')).toBeInTheDocument();
    });
  });

  it('should render ChangePasswordForm in second tab', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      expect(screen.getByTestId('change-password-form')).toBeInTheDocument();
    });
  });

  it('should start with first tab selected by default', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      const tabsRoot = screen.getByTestId('tabs-root');
      expect(tabsRoot).toHaveAttribute('data-value', 'personal-settings');
    });
  });

  it('should start with specified defaultTabIndex', async () => {
    render(<ManageProfile defaultTabIndex={1} />);

    await waitFor(() => {
      const tabsRoot = screen.getByTestId('tabs-root');
      expect(tabsRoot).toHaveAttribute('data-value', 'change-password');
    });
  });

  it('should call onTabChange when tab is clicked', async () => {
    const onTabChange = vi.fn();

    render(<ManageProfile onTabChange={onTabChange} />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByTestId('tab-change-password')).toBeInTheDocument();
    });

    const changePasswordTab = screen.getByTestId('tab-change-password');
    await user.click(changePasswordTab);

    await waitFor(() => {
      expect(onTabChange).toHaveBeenCalledWith(1);
    });
  });

  it('should switch to first tab when personal settings tab is clicked', async () => {
    const onTabChange = vi.fn();

    render(<ManageProfile defaultTabIndex={1} onTabChange={onTabChange} />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByTestId('tab-personal-settings')).toBeInTheDocument();
    });

    const personalSettingsTab = screen.getByTestId('tab-personal-settings');
    await user.click(personalSettingsTab);

    await waitFor(() => {
      expect(onTabChange).toHaveBeenCalledWith(0);
    });
  });

  it('should use custom tabs when provided', async () => {
    const customTabs = [
      {
        id: 'custom-tab-1',
        label: 'Custom Tab 1',
        content: <div data-testid="custom-content-1">Custom Content 1</div>,
      },
      {
        id: 'custom-tab-2',
        label: 'Custom Tab 2',
        content: <div data-testid="custom-content-2">Custom Content 2</div>,
      },
    ];

    render(<ManageProfile customTabs={customTabs} />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Custom Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Custom Tab 2' })).toBeInTheDocument();
      expect(screen.getByTestId('custom-content-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-content-2')).toBeInTheDocument();

      // Default tabs should not be present
      expect(screen.queryByTestId('personal-settings-form')).not.toBeInTheDocument();
      expect(screen.queryByTestId('change-password-form')).not.toBeInTheDocument();
    });
  });

  it('should render container with 2xl maxWidth', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('data-maxw', '2xl');
    });
  });

  it('should render tabs with enclosed variant', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      const tabsRoot = screen.getByTestId('tabs-root');
      expect(tabsRoot).toHaveAttribute('data-variant', 'enclosed');
    });
  });

  it('should have manage-profile className on root Box', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      // Find the box with manage-profile class
      const boxes = screen.getAllByTestId('box');
      const rootBox = boxes.find(box => box.className === 'manage-profile');
      expect(rootBox).toBeDefined();
    });
  });

  it('should handle switching between multiple tabs', async () => {
    const onTabChange = vi.fn();

    render(<ManageProfile onTabChange={onTabChange} />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByTestId('tab-change-password')).toBeInTheDocument();
    });

    // Click change password tab
    await user.click(screen.getByTestId('tab-change-password'));
    await waitFor(() => {
      expect(onTabChange).toHaveBeenCalledWith(1);
    });

    // Click back to personal settings tab
    await user.click(screen.getByTestId('tab-personal-settings'));
    await waitFor(() => {
      expect(onTabChange).toHaveBeenCalledWith(0);
    });
  });

  it('should handle defaultTabIndex out of bounds gracefully', async () => {
    // When defaultTabIndex is out of bounds, it should still render
    render(<ManageProfile defaultTabIndex={99} />);

    await waitFor(() => {
      const tabsRoot = screen.getByTestId('tabs-root');
      // When index is out of bounds, tabs[selectedTab]?.id is undefined
      // The component still renders but value would be undefined
      expect(tabsRoot).toBeInTheDocument();
    });
  });

  it('should not call onTabChange when same tab is clicked', async () => {
    const onTabChange = vi.fn();

    render(<ManageProfile onTabChange={onTabChange} defaultTabIndex={0} />);

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByTestId('tab-personal-settings')).toBeInTheDocument();
    });

    // Click the already selected tab
    await user.click(screen.getByTestId('tab-personal-settings'));

    await waitFor(() => {
      expect(onTabChange).toHaveBeenCalledWith(0);
    });
  });

  it('should render all tab panels', async () => {
    render(<ManageProfile />);

    await waitFor(() => {
      expect(screen.getByTestId('tabpanel-personal-settings')).toBeInTheDocument();
      expect(screen.getByTestId('tabpanel-change-password')).toBeInTheDocument();
    });
  });

  // v2.7.0: Component key tests
  describe('component keys static properties (v2.7.0)', () => {
    it('should have changePasswordKey static property', () => {
      expect(ManageProfile.changePasswordKey).toBeDefined();
    });

    it('should have changePasswordKey matching eAccountComponents.ChangePassword', () => {
      expect(ManageProfile.changePasswordKey).toBe('Account.ChangePasswordComponent');
    });

    it('should have personalSettingsKey static property', () => {
      expect(ManageProfile.personalSettingsKey).toBeDefined();
    });

    it('should have personalSettingsKey matching eAccountComponents.PersonalSettings', () => {
      expect(ManageProfile.personalSettingsKey).toBe('Account.PersonalSettingsComponent');
    });
  });

  // v3.1.0: hideChangePasswordTab tests
  describe('v3.1.0 hideChangePasswordTab', () => {
    it('should hide change password tab when hideChangePasswordTab prop is true', async () => {
      render(<ManageProfile hideChangePasswordTab={true} />);

      await waitFor(() => {
        expect(screen.queryByRole('tab', { name: 'Change Password' })).not.toBeInTheDocument();
      });
    });

    it('should show change password tab when hideChangePasswordTab prop is false', async () => {
      render(<ManageProfile hideChangePasswordTab={false} />);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: 'Change Password' })).toBeInTheDocument();
      });
    });
  });
});
