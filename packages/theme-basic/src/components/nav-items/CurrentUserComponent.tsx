/**
 * CurrentUserComponent
 * Translated from @abp/ng.theme.basic/lib/components/nav-items/current-user.component.ts v4.0.0
 *
 * Public API component for displaying the current user nav item.
 * Can be replaced using the component replacement system with eThemeBasicComponents.CurrentUser.
 *
 * @since 3.0.0
 */

import React, { useCallback, useMemo } from 'react';
import {
  Avatar,
  Box,
  HStack,
  Menu,
  Portal,
  Text,
  Button,
  type SystemStyleObject,
} from '@chakra-ui/react';
import { LuEllipsisVertical, LuKey, LuLogOut, LuUser, LuLogIn } from 'react-icons/lu';
import { useConfig, useAuth, useDirection, useLocalization } from '@abpjs/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

/**
 * Props for the CurrentUserComponent.
 * @since 3.0.0
 */
export interface CurrentUserComponentProps {
  /** Whether to display in small screen (mobile) mode */
  smallScreen?: boolean;
  /** URL to redirect to for login (default: /account/login) */
  loginUrl?: string;
  /** URL to redirect to for profile (default: /account/manage) */
  profileUrl?: string;
  /** URL to redirect to for change password (default: /account/manage) */
  changePasswordUrl?: string;
  /** Custom styles for the container */
  containerStyle?: SystemStyleObject;
  /** Z-index for the dropdown menu */
  menuZIndex?: number;
}

/**
 * Public API component for the current user nav item.
 * Displays user avatar, name, and dropdown menu with profile options.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.CurrentUser.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CurrentUserComponent />
 *
 * // With custom URLs
 * <CurrentUserComponent
 *   loginUrl="/login"
 *   profileUrl="/profile"
 *   changePasswordUrl="/change-password"
 * />
 * ```
 */
export function CurrentUserComponent({
  smallScreen: _smallScreen = false,
  loginUrl = '/account/login',
  profileUrl = '/account/manage',
  changePasswordUrl = '/account/manage',
  containerStyle,
  menuZIndex = 1400,
}: CurrentUserComponentProps): React.ReactElement {
  const { currentUser } = useConfig();
  const { isAuthenticated, logout: authLogout } = useAuth();
  const { endSide } = useDirection();
  const { t } = useLocalization();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = useCallback(() => {
    authLogout();
  }, [authLogout]);

  // Handle profile navigation
  const handleProfile = useCallback(() => {
    navigate(profileUrl);
  }, [navigate, profileUrl]);

  // Handle change password navigation
  const handleChangePassword = useCallback(() => {
    navigate(changePasswordUrl);
  }, [navigate, changePasswordUrl]);

  // Get initials for avatar fallback from userName
  const initials = useMemo(() => {
    const userName = currentUser?.userName || '';
    return userName.slice(0, 2).toUpperCase();
  }, [currentUser?.userName]);

  if (!isAuthenticated || !currentUser) {
    return (
      <Button asChild variant="outline" width="full">
        <RouterLink to={loginUrl}>
          <LuLogIn />
          {t('AbpAccount::Login')}
        </RouterLink>
      </Button>
    );
  }

  return (
    <HStack gap="3" justify="space-between" css={containerStyle}>
      <HStack gap="3">
        <Avatar.Root size="sm">
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
        <Box>
          <Text textStyle="sm" fontWeight="medium">
            {currentUser.userName}
          </Text>
        </Box>
      </HStack>
      <Menu.Root positioning={{ placement: `${endSide}-start` }}>
        <Menu.Trigger asChild>
          <Box
            as="button"
            p="2"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: 'colorPalette.subtle' }}
            aria-label="User menu"
          >
            <LuEllipsisVertical />
          </Box>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner style={{ zIndex: menuZIndex }}>
            <Menu.Content>
              <Menu.Item value="profile" onClick={handleProfile}>
                <LuUser />
                {t('AbpUi::PersonalInfo')}
              </Menu.Item>
              <Menu.Item value="change-password" onClick={handleChangePassword}>
                <LuKey />
                {t('AbpUi::ChangePassword')}
              </Menu.Item>
              <Menu.Item value="logout" onClick={handleLogout} color="red.500">
                <LuLogOut />
                {t('AbpUi::Logout')}
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </HStack>
  );
}

export default CurrentUserComponent;
