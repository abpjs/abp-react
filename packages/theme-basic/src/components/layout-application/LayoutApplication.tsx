import React, { useState, useCallback, ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth, eLayoutType, useDirection } from '@abpjs/core';
import { Sidebar, Navbar, SidebarProps } from '../blocks/sidebars/sidebar-with-collapsible';
import { ChangePassword } from '../change-password';
import { Profile } from '../profile';
import { eThemeBasicComponents } from '../../enums';

/** Z-index for sidebar/navbar - exported so menus can layer above it */
export const SIDEBAR_Z_INDEX = 1100;

export interface LayoutApplicationProps {
  /** @deprecated Use logo prop on ThemeBasicProvider instead */
  brandName?: string;
  /** @deprecated Use logoLink prop on ThemeBasicProvider instead */
  brandLink?: string;
  /** Whether to show the language selector */
  showLanguageSelector?: boolean;
  /** Whether to show the current user menu */
  showCurrentUser?: boolean;
  /** Whether to show search field in sidebar */
  showSearch?: boolean;
  /** Whether to show help center link */
  showHelpCenter?: boolean;
  /** Help center URL */
  helpCenterUrl?: string;
  /** Whether to show settings link */
  showSettings?: boolean;
  /** Settings URL */
  settingsUrl?: string;
  /** Default icon for routes without specific icons (icons are defined on routes via the `icon` property) */
  defaultIcon?: ReactNode;
  /** Additional content to render at the top of the sidebar (after logo) */
  headerContent?: ReactNode;
  /** Additional content to render before the user profile */
  footerContent?: ReactNode;
  /** Custom children to render in content area (overrides Outlet) */
  children?: ReactNode;
}

/**
 * Application layout component for authenticated pages.
 * Uses a sidebar-based layout with Chakra UI Pro blocks.
 *
 * Features:
 * - Responsive sidebar (drawer on mobile, fixed on desktop)
 * - Navigation menu from routes (icons defined via route's `icon` property)
 * - Language switcher
 * - Current user menu with logout, change password, profile
 * - Customizable logo via ThemeBasicProvider
 * - RTL support for Arabic, Hebrew, Persian, and other RTL languages
 *
 * @example
 * ```tsx
 * // Basic usage - icons are defined on routes
 * const routes = [
 *   { name: 'Home', path: '', icon: <LuHome /> },
 *   { name: 'Settings', path: 'settings', icon: <LuSettings /> },
 * ];
 *
 * <LayoutApplication />
 * ```
 */
export function LayoutApplication({
  showLanguageSelector = true,
  showCurrentUser = true,
  showSearch = true,
  showHelpCenter = false,
  helpCenterUrl,
  showSettings = false,
  settingsUrl,
  defaultIcon,
  headerContent,
  footerContent,
  children,
}: LayoutApplicationProps): React.ReactElement {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { direction, isRtl } = useDirection();

  /**
   * Component key references for dynamic component replacement.
   * These allow customization of sub-components in the layout.
   * @since 2.7.0
   */
  const logoComponentKey = eThemeBasicComponents.Logo;
  const routesComponentKey = eThemeBasicComponents.Routes;
  const navItemsComponentKey = eThemeBasicComponents.NavItems;

  // Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/account/login');
  }, [logout, navigate]);

  const handleChangePassword = useCallback(() => {
    setIsChangePasswordOpen(true);
  }, []);

  const handleProfile = useCallback(() => {
    setIsProfileOpen(true);
  }, []);

  // Common sidebar props
  const sidebarProps: Omit<SidebarProps, 'hideBelow' | 'hideFrom'> = {
    showSearch,
    showLanguageSelector,
    showHelpCenter,
    helpCenterUrl,
    showSettings,
    settingsUrl,
    defaultIcon,
    headerContent,
    footerContent,
    userProfileProps: showCurrentUser
      ? {
          onChangePassword: handleChangePassword,
          onProfile: handleProfile,
          onLogout: handleLogout,
        }
      : undefined,
  };

  return (
    <>
      <Flex minH="100vh" dir={direction}>
        {/* Mobile Navbar (shown below md breakpoint) */}
        <Box
          position="fixed"
          top={0}
          left={isRtl ? undefined : 0}
          right={isRtl ? 0 : undefined}
          insetInline={0}
          zIndex={SIDEBAR_Z_INDEX}
          hideFrom="md"
        >
          <Navbar sidebarProps={sidebarProps} />
        </Box>

        {/* Desktop Sidebar (shown at md breakpoint and above) */}
        <Box
          as="aside"
          position="fixed"
          top={0}
          left={isRtl ? undefined : 0}
          right={isRtl ? 0 : undefined}
          bottom={0}
          hideBelow="md"
          zIndex={SIDEBAR_Z_INDEX}
        >
          <Sidebar h="100vh" {...sidebarProps} />
        </Box>

        {/* Main Content - margin matches sidebar maxW="xs" (320px) */}
        <Box
          as="main"
          flex="1"
          ml={{ base: 0, md: isRtl ? 0 : '320px' }}
          mr={{ base: 0, md: isRtl ? '320px' : 0 }}
          mt={{ base: '60px', md: 0 }}
          p={{ base: 4, md: 6 }}
          minH="100vh"
        >
          {children || <Outlet />}
        </Box>
      </Flex>

      {/* Modals */}
      <ChangePassword
        visible={isChangePasswordOpen}
        onVisibleChange={setIsChangePasswordOpen}
      />
      <Profile visible={isProfileOpen} onVisibleChange={setIsProfileOpen} />
    </>
  );
}

// Static type property for layout system
LayoutApplication.type = eLayoutType.application;

/**
 * Component keys for dynamic replacement of sub-components.
 * @since 2.7.0
 */
LayoutApplication.logoComponentKey = eThemeBasicComponents.Logo;
LayoutApplication.routesComponentKey = eThemeBasicComponents.Routes;
LayoutApplication.navItemsComponentKey = eThemeBasicComponents.NavItems;

export default LayoutApplication;
