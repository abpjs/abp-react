/**
 * LanguagesComponent
 * Translated from @abp/ng.theme.basic/lib/components/nav-items/languages.component.ts v3.0.0
 *
 * Public API component for displaying the language selector nav item.
 * Can be replaced using the component replacement system with eThemeBasicComponents.Languages.
 *
 * @since 3.0.0
 */

import React, { useCallback, useMemo } from 'react';
import {
  Button,
  HStack,
  Menu,
  Portal,
  Text,
  type SystemStyleObject,
} from '@chakra-ui/react';
import { LuChevronDown, LuGlobe } from 'react-icons/lu';
import { useConfig, useSession, ApplicationConfiguration } from '@abpjs/core';

/**
 * Props for the LanguagesComponent.
 * @since 3.0.0
 */
export interface LanguagesComponentProps {
  /** Whether to display in small screen (mobile) mode */
  smallScreen?: boolean;
  /** Whether to show in compact mode (icon only) */
  compact?: boolean;
  /** Custom styles for the container */
  containerStyle?: SystemStyleObject;
  /** Z-index for the dropdown menu */
  menuZIndex?: number;
}

/**
 * Public API component for the language selector nav item.
 * Displays a dropdown menu to change the application language.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.Languages.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LanguagesComponent />
 *
 * // Compact mode (icon only)
 * <LanguagesComponent compact />
 *
 * // For small screens
 * <LanguagesComponent smallScreen />
 * ```
 */
export function LanguagesComponent({
  smallScreen: _smallScreen = false,
  compact = false,
  containerStyle,
  menuZIndex = 1400,
}: LanguagesComponentProps): React.ReactElement | null {
  const { localization } = useConfig();
  const { language, setLanguage } = useSession();

  // Get all available languages
  const languages = useMemo<ApplicationConfiguration.Language[]>(() => {
    return localization?.languages || [];
  }, [localization]);

  // Get the current language object
  const currentLanguage = useMemo(() => {
    return languages.find((lang) => lang.cultureName === language);
  }, [languages, language]);

  // Get the default language display name
  const defaultLanguage = useMemo(() => {
    return currentLanguage?.displayName || currentLanguage?.cultureName || '';
  }, [currentLanguage]);

  // Get languages for dropdown (exclude current)
  const dropdownLanguages = useMemo(() => {
    return languages.filter((lang) => lang.cultureName !== language);
  }, [languages, language]);

  // Get selected language culture
  const _selectedLangCulture = language || '';

  // Handle language change
  const handleChangeLang = useCallback(
    (cultureName: string) => {
      setLanguage(cultureName);
      // Refresh the page to ensure all language strings are updated
      window.location.reload();
    },
    [setLanguage]
  );

  // Don't render if only one language
  if (languages.length <= 1) {
    return null;
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          width="full"
          justifyContent="start"
          gap="3"
          color="fg.muted"
          css={containerStyle}
          _hover={{
            bg: 'colorPalette.subtle',
            color: 'colorPalette.fg',
          }}
        >
          <HStack justifyContent="space-between" width="full">
            <HStack gap="3">
              <LuGlobe />
              {!compact && <Text>{defaultLanguage}</Text>}
            </HStack>
            <LuChevronDown />
          </HStack>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner style={{ zIndex: menuZIndex }}>
          <Menu.Content>
            {dropdownLanguages.map((lang) => (
              <Menu.Item
                key={lang.cultureName}
                value={lang.cultureName}
                onClick={() => handleChangeLang(lang.cultureName)}
              >
                {lang.displayName || lang.cultureName}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default LanguagesComponent;
