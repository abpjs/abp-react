/**
 * Tests for CurrentUserComponent v4.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CurrentUserComponent } from '../components/nav-items/CurrentUserComponent';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock @abpjs/core hooks
const mockLogout = vi.fn();
const mockUseConfig = vi.fn();
const mockUseAuth = vi.fn();
const mockUseDirection = vi.fn();
const mockUseLocalization = vi.fn();

vi.mock('@abpjs/core', () => ({
  useConfig: () => mockUseConfig(),
  useAuth: () => mockUseAuth(),
  useDirection: () => mockUseDirection(),
  useLocalization: () => mockUseLocalization(),
  useSession: () => ({ language: 'en', setLanguage: vi.fn() }),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Avatar: {
    Root: ({ children, ...props }: any) => <div data-testid="avatar-root" {...props}>{children}</div>,
    Fallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
  },
  Box: ({ children, as, onClick, ...props }: any) => {
    const Component = as || 'div';
    return <Component onClick={onClick} data-testid="box" {...props}>{children}</Component>;
  },
  HStack: ({ children, ...props }: any) => <div data-testid="hstack" {...props}>{children}</div>,
  Menu: {
    Root: ({ children }: any) => <div data-testid="menu-root">{children}</div>,
    Trigger: ({ children, asChild: _asChild }: any) => <div data-testid="menu-trigger">{children}</div>,
    Positioner: ({ children }: any) => <div data-testid="menu-positioner">{children}</div>,
    Content: ({ children }: any) => <div data-testid="menu-content">{children}</div>,
    Item: ({ children, onClick, value }: any) => (
      <button data-testid={`menu-item-${value}`} onClick={onClick}>{children}</button>
    ),
  },
  Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
  Button: ({ children, asChild: _asChild, ...props }: any) => (
    <button data-testid="button" {...props}>{children}</button>
  ),
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuEllipsisVertical: () => <span data-testid="icon-ellipsis" />,
  LuKey: () => <span data-testid="icon-key" />,
  LuLogOut: () => <span data-testid="icon-logout" />,
  LuUser: () => <span data-testid="icon-user" />,
  LuLogIn: () => <span data-testid="icon-login" />,
}));

describe('CurrentUserComponent', () => {
  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <CurrentUserComponent {...props} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDirection.mockReturnValue({ endSide: 'right' });
    mockUseLocalization.mockReturnValue({ t: (key: string) => key });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseConfig.mockReturnValue({ currentUser: null });
      mockUseAuth.mockReturnValue({ isAuthenticated: false, logout: mockLogout });
    });

    it('should render login button', () => {
      renderComponent();
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('AbpAccount::Login')).toBeInTheDocument();
    });

    it('should render login icon', () => {
      renderComponent();
      expect(screen.getByTestId('icon-login')).toBeInTheDocument();
    });

    it('should use default login URL', () => {
      renderComponent();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/account/login');
    });

    it('should use custom login URL when provided', () => {
      renderComponent({ loginUrl: '/custom/login' });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/custom/login');
    });
  });

  describe('when user is authenticated but currentUser is null', () => {
    beforeEach(() => {
      mockUseConfig.mockReturnValue({ currentUser: null });
      mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout });
    });

    it('should render login button when currentUser is null', () => {
      renderComponent();
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('AbpAccount::Login')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    const mockCurrentUser = {
      userName: 'testuser',
      email: 'test@example.com',
    };

    beforeEach(() => {
      mockUseConfig.mockReturnValue({ currentUser: mockCurrentUser });
      mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout });
    });

    it('should render user avatar with initials', () => {
      renderComponent();
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('TE');
    });

    it('should render username', () => {
      renderComponent();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('should render user menu trigger', () => {
      renderComponent();
      expect(screen.getByTestId('menu-trigger')).toBeInTheDocument();
    });

    it('should render menu items', () => {
      renderComponent();
      expect(screen.getByTestId('menu-item-profile')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-change-password')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-logout')).toBeInTheDocument();
    });

    it('should render menu item labels', () => {
      renderComponent();
      expect(screen.getByText('AbpUi::PersonalInfo')).toBeInTheDocument();
      expect(screen.getByText('AbpUi::ChangePassword')).toBeInTheDocument();
      expect(screen.getByText('AbpUi::Logout')).toBeInTheDocument();
    });

    it('should call navigate when profile is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-profile'));
      expect(mockNavigate).toHaveBeenCalledWith('/account/manage');
    });

    it('should call navigate with custom profile URL', () => {
      renderComponent({ profileUrl: '/my-profile' });
      fireEvent.click(screen.getByTestId('menu-item-profile'));
      expect(mockNavigate).toHaveBeenCalledWith('/my-profile');
    });

    it('should call navigate when change password is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-change-password'));
      expect(mockNavigate).toHaveBeenCalledWith('/account/manage');
    });

    it('should call navigate with custom change password URL', () => {
      renderComponent({ changePasswordUrl: '/change-pwd' });
      fireEvent.click(screen.getByTestId('menu-item-change-password'));
      expect(mockNavigate).toHaveBeenCalledWith('/change-pwd');
    });

    it('should call logout when logout is clicked', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('menu-item-logout'));
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('initials generation', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout });
    });

    it('should generate initials from short username', () => {
      mockUseConfig.mockReturnValue({ currentUser: { userName: 'ab' } });
      renderComponent();
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AB');
    });

    it('should generate initials from single character username', () => {
      mockUseConfig.mockReturnValue({ currentUser: { userName: 'a' } });
      renderComponent();
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('A');
    });

    it('should handle empty username', () => {
      mockUseConfig.mockReturnValue({ currentUser: { userName: '' } });
      renderComponent();
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('');
    });

    it('should uppercase initials', () => {
      mockUseConfig.mockReturnValue({ currentUser: { userName: 'lowercase' } });
      renderComponent();
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('LO');
    });
  });

  describe('props', () => {
    beforeEach(() => {
      mockUseConfig.mockReturnValue({ currentUser: { userName: 'test' } });
      mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout });
    });

    it('should accept smallScreen prop', () => {
      // smallScreen is accepted but not used in current implementation (prefixed with _)
      expect(() => renderComponent({ smallScreen: true })).not.toThrow();
    });

    it('should accept containerStyle prop', () => {
      expect(() => renderComponent({ containerStyle: { marginTop: '10px' } })).not.toThrow();
    });

    it('should accept menuZIndex prop', () => {
      expect(() => renderComponent({ menuZIndex: 2000 })).not.toThrow();
    });
  });
});
