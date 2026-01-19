import { Badge, Button, HStack, Spacer, type ButtonProps } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface SidebarLinkProps extends Omit<ButtonProps, 'children'> {
  /** Link destination path */
  href?: string
  /** Whether to use exact path matching for active state */
  exact?: boolean
  /** Content to display */
  children?: ReactNode
  /** Badge content (number or text) to display at end of link */
  badge?: ReactNode
  /** Badge color palette (default: 'gray') */
  badgeColorPalette?: string
}

export const SidebarLink = (props: SidebarLinkProps) => {
  const { children, href, exact = false, badge, badgeColorPalette = 'gray', ...buttonProps } = props
  const location = useLocation()

  // Determine if this link is active
  // For root path '/' or empty string, always use exact matching
  const isRootPath = !href || href === '/'
  const isActive = href !== undefined
    ? isRootPath || exact
      ? location.pathname === href || location.pathname === '/' + href
      : location.pathname.startsWith(href)
    : false

  const content = badge ? (
    <HStack width="full">
      <HStack gap="3">{children}</HStack>
      <Spacer />
      <Badge size="sm" colorPalette={badgeColorPalette} variant="solid">
        {badge}
      </Badge>
    </HStack>
  ) : (
    children
  )

  return (
    <Button
      variant="ghost"
      width="full"
      justifyContent="start"
      gap="3"
      color={isActive ? 'colorPalette.fg' : 'fg.muted'}
      bg={isActive ? 'colorPalette.subtle' : undefined}
      _hover={{
        bg: 'colorPalette.subtle',
        color: 'colorPalette.fg',
      }}
      asChild={!!href}
      {...buttonProps}
    >
      {href ? (
        <NavLink to={href}>{content}</NavLink>
      ) : (
        <span>{content}</span>
      )}
    </Button>
  )
}
