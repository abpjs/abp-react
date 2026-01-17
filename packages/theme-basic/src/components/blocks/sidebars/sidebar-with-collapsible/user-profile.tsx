import { Avatar, Box, HStack, Menu, Portal, Text } from '@chakra-ui/react'
import { LuEllipsisVertical, LuKey, LuLogOut, LuUser } from 'react-icons/lu'
import { useConfig, useAuth, useDirection, useLocalization } from '@abpjs/core'
import { SIDEBAR_Z_INDEX } from '../../../../components/layout-application/LayoutApplication'

export interface UserProfileProps {
  onChangePassword?: () => void
  onProfile?: () => void
  onLogout?: () => void
}

export const UserProfile = ({ onChangePassword, onProfile, onLogout }: UserProfileProps) => {
  const { currentUser } = useConfig()
  const { isAuthenticated } = useAuth()
  const { endSide } = useDirection()
  const { t } = useLocalization()

  if (!isAuthenticated || !currentUser) {
    return null
  }

  // Get initials for avatar fallback from userName
  const getInitials = () => {
    const userName = currentUser.userName || ''
    return userName.slice(0, 2).toUpperCase()
  }

  return (
    <HStack gap="3" justify="space-between">
      <HStack gap="3">
        <Avatar.Root size="sm">
          <Avatar.Fallback>{getInitials()}</Avatar.Fallback>
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
          <Menu.Positioner style={{ zIndex: SIDEBAR_Z_INDEX + 100 }}>
            <Menu.Content>
              {onProfile && (
                <Menu.Item value="profile" onClick={onProfile}>
                  <LuUser />
                  {t('AbpUi::PersonalInfo')}
                </Menu.Item>
              )}
              {onChangePassword && (
                <Menu.Item value="change-password" onClick={onChangePassword}>
                  <LuKey />
                  {t('AbpUi::ChangePassword')}
                </Menu.Item>
              )}
              {onLogout && (
                <Menu.Item value="logout" onClick={onLogout} color="red.500">
                  <LuLogOut />
                  {t('AbpUi::Logout')}
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </HStack>
  )
}
