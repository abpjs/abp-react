import { Button, HStack, Menu, Portal, Text } from '@chakra-ui/react'
import { LuChevronDown, LuGlobe } from 'react-icons/lu'
import { useConfig, useSession } from '@abpjs/core'
import { useMemo, useCallback } from 'react'
import { SIDEBAR_Z_INDEX } from '../../../../components/layout-application/LayoutApplication'

export interface LanguageSelectorProps {
  /** Whether to show in compact mode (icon only when collapsed) */
  compact?: boolean
}

/**
 * Language selector dropdown for the sidebar
 */
export const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
  const { localization } = useConfig()
  const { language, setLanguage } = useSession()

  const handleLanguageChange = useCallback((cultureName: string) => {
    setLanguage(cultureName)
    // Refresh the page to ensure all language strings are updated
    window.location.reload()
  }, [setLanguage])

  const languages = useMemo(() => {
    return localization?.languages || []
  }, [localization])

  const currentLanguage = useMemo(() => {
    return languages.find((lang) => lang.cultureName === language)
  }, [languages, language])

  const otherLanguages = useMemo(() => {
    return languages.filter((lang) => lang.cultureName !== language)
  }, [languages, language])

  if (languages.length <= 1) {
    return null
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
          _hover={{
            bg: 'colorPalette.subtle',
            color: 'colorPalette.fg',
          }}
        >
          <HStack justifyContent="space-between" width="full">
            <HStack gap="3">
              <LuGlobe />
              {!compact && (
                <Text>{currentLanguage?.displayName || currentLanguage?.cultureName}</Text>
              )}
            </HStack>
            <LuChevronDown />
          </HStack>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner style={{ zIndex: SIDEBAR_Z_INDEX + 100 }}>
          <Menu.Content>
            {otherLanguages.map((lang) => (
              <Menu.Item
                key={lang.cultureName}
                value={lang.cultureName}
                onClick={() => handleLanguageChange(lang.cultureName)}
              >
                {lang.displayName || lang.cultureName}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
