import React, { useEffect, useCallback, useMemo } from 'react';
import { Stack } from '@chakra-ui/react';
import { useConfig, useAuth, useSession } from '@abpjs/core';
import { useLayoutContext } from '../../contexts/layout.context';
import { Layout } from '../../models';
import { LanguageSelector } from '../blocks/sidebars/sidebar-with-collapsible/language-selector';
import { UserProfile, UserProfileProps } from '../blocks/sidebars/sidebar-with-collapsible/user-profile';
import { eNavigationElementNames } from '../../enums';

/**
 * Props for the NavItemsComponent.
 * @since 2.7.0
 */
export interface NavItemsComponentProps {
  /** Whether the screen is small (mobile) */
  smallScreen?: boolean;
  /** User profile action handlers */
  userProfileProps?: UserProfileProps;
  /** Whether to show language selector */
  showLanguageSelector?: boolean;
  /** Whether to show current user */
  showCurrentUser?: boolean;
}

/**
 * Public API component for navigation items (language selector, user menu, custom elements).
 * Handles the registration of built-in navigation elements and renders custom elements.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.NavItems.
 *
 * @since 2.7.0 - Added as public API component
 *
 * @example
 * ```tsx
 * <NavItemsComponent
 *   showLanguageSelector={true}
 *   showCurrentUser={true}
 *   userProfileProps={{
 *     onLogout: () => logout(),
 *     onChangePassword: () => openChangePassword(),
 *   }}
 * />
 * ```
 */
export function NavItemsComponent({
  smallScreen: _smallScreen = false,
  userProfileProps,
  showLanguageSelector = true,
  showCurrentUser = true,
}: NavItemsComponentProps): React.ReactElement {
  const { localization } = useConfig();
  useAuth();
  const { language, setLanguage } = useSession();
  const { state, service } = useLayoutContext();

  // Get default language display name
  const _defaultLanguage = useMemo(() => {
    const lang = localization?.languages?.find((l) => l.cultureName === language);
    return lang?.displayName || language || '';
  }, [localization, language]);

  // Get other languages for dropdown
  const _dropdownLanguages = useMemo(() => {
    return localization?.languages?.filter((l) => l.cultureName !== language) || [];
  }, [localization, language]);

  // Handle language change
  const _onChangeLang = useCallback(
    (cultureName: string) => {
      setLanguage(cultureName);
      window.location.reload();
    },
    [setLanguage]
  );

  // Handle logout
  const _logout = useCallback(() => {
    userProfileProps?.onLogout?.();
  }, [userProfileProps]);

  // Register language element
  useEffect(() => {
    if (showLanguageSelector && localization?.languages && localization.languages.length > 1) {
      service.addNavigationElement({
        name: eNavigationElementNames.Language,
        element: <LanguageSelector key="language-selector" />,
        order: 2,
      });

      return () => {
        service.removeNavigationElement(eNavigationElementNames.Language);
      };
    }
  }, [service, showLanguageSelector, localization?.languages]);

  // Register user element
  useEffect(() => {
    if (showCurrentUser) {
      service.addNavigationElement({
        name: eNavigationElementNames.User,
        element: <UserProfile key="user-profile" {...userProfileProps} />,
        order: 3,
      });

      return () => {
        service.removeNavigationElement(eNavigationElementNames.User);
      };
    }
  }, [service, showCurrentUser, userProfileProps]);

  // Get sorted navigation elements
  const navElements = state.navigationElements;

  return (
    <Stack gap={2} width="full">
      {navElements.map((element: Layout.NavigationElement) => (
        <React.Fragment key={element.name}>{element.element}</React.Fragment>
      ))}
    </Stack>
  );
}

export default NavItemsComponent;
