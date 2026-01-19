import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { eLayoutType, useDirection } from '@abpjs/core';
import { Sidebar, Navbar, SidebarProps } from '../blocks/sidebars/sidebar-with-collapsible';

/** Z-index for sidebar/navbar - exported so menus can layer above it */
export const SIDEBAR_Z_INDEX = 1100;

export interface LayoutAccountProps {
  /** Whether to show the language selector */
  showLanguageSelector?: boolean;
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
  /** Default icon for routes without specific icons */
  defaultIcon?: ReactNode;
  /** Additional content to render at the top of the sidebar (after logo) */
  headerContent?: ReactNode;
  /** Additional content to render before the user profile */
  footerContent?: ReactNode;
  /** Custom children to render in content area (overrides Outlet) */
  children?: ReactNode;
}

/**
 * Account layout component for authentication pages (login, register, etc.).
 * Uses a sidebar-based layout similar to LayoutApplication but without
 * user-specific features (no profile, no change password, no logout).
 *
 * Features:
 * - Responsive sidebar (drawer on mobile, fixed on desktop)
 * - Navigation menu from routes
 * - Language switcher
 * - RTL support for Arabic, Hebrew, Persian, and other RTL languages
 *
 * @example
 * ```tsx
 * <LayoutAccount showLanguageSelector={true} />
 * ```
 */
export function LayoutAccount({
  showLanguageSelector = true,
  showSearch = false,
  showHelpCenter = false,
  helpCenterUrl,
  showSettings = false,
  settingsUrl,
  defaultIcon,
  headerContent,
  footerContent,
  children,
}: LayoutAccountProps): React.ReactElement {
  const { direction, isRtl } = useDirection();

  // Common sidebar props - no user profile for account layout
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
    userProfileProps: undefined, // No user profile on account pages
  };

  return (
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
  );
}

// Static type property for layout system
LayoutAccount.type = eLayoutType.account;

export default LayoutAccount;
