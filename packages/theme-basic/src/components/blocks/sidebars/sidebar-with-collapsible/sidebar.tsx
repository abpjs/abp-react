import { Box, Stack, type StackProps, StackSeparator } from '@chakra-ui/react'
import { LuCircleHelp, LuSettings } from 'react-icons/lu'
import { ReactNode } from 'react'
import { Logo } from './logo'
import { SearchField } from './search-field'
import { SidebarLink } from './sidebar-link'
import { UserProfile, UserProfileProps } from './user-profile'
import { NavLinks } from './nav-links'
import { LanguageSelector } from './language-selector'
import { SearchProvider } from './search-context'

export interface SidebarProps extends StackProps {
  /** Show search field */
  showSearch?: boolean
  /** Show language selector */
  showLanguageSelector?: boolean
  /** Show help center link */
  showHelpCenter?: boolean
  /** Help center URL */
  helpCenterUrl?: string
  /** Show settings link */
  showSettings?: boolean
  /** Settings URL */
  settingsUrl?: string
  /** Default icon for routes without specific icons (icons are defined on routes via the `icon` property) */
  defaultIcon?: ReactNode
  /** User profile callbacks */
  userProfileProps?: UserProfileProps
  /** Additional content to render at the top of the sidebar (after logo) */
  headerContent?: ReactNode
  /** Additional content to render before the user profile */
  footerContent?: ReactNode
}

export const Sidebar = ({
  showSearch = true,
  showLanguageSelector = true,
  showHelpCenter = false,
  helpCenterUrl,
  showSettings = false,
  settingsUrl,
  defaultIcon,
  userProfileProps,
  headerContent,
  footerContent,
  ...props
}: SidebarProps) => {
  return (
    <SearchProvider>
      <Stack
        flex="1"
        p={{ base: '4', md: '6' }}
        bg="bg.panel"
        borderInlineEndWidth="1px"
        justifyContent="space-between"
        maxW="xs"
        {...props}
      >
        <Stack gap="6">
          <Logo style={{ alignSelf: 'start' }} />
          {headerContent}
          {showSearch && <SearchField />}
          <NavLinks defaultIcon={defaultIcon} />
        </Stack>
        <Stack gap="4" separator={<StackSeparator />}>
          <Box />
          <Stack gap="1">
            {showLanguageSelector && <LanguageSelector />}
            {showHelpCenter && (
              <SidebarLink href={helpCenterUrl}>
                <LuCircleHelp /> Help Center
              </SidebarLink>
            )}
            {showSettings && (
              <SidebarLink href={settingsUrl}>
                <LuSettings /> Settings
              </SidebarLink>
            )}
            {footerContent}
          </Stack>
          <UserProfile {...userProfileProps} />
        </Stack>
      </Stack>
    </SearchProvider>
  )
}
