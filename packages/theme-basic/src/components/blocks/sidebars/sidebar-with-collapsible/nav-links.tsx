'use client'
import { Badge, Button, Collapsible, HStack, Icon, Spacer, Stack, chakra }  from '@chakra-ui/react'
import { LuChevronDown } from 'react-icons/lu'
import { SidebarLink } from './sidebar-link'
import { useConfig, ABP, useDirection } from '@abpjs/core'
import { useMemo, useState, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useSearch } from './search-context'

/**
 * Get visible routes (filter out invisible ones)
 */
function getVisibleRoutes(routes: ABP.FullRoute[]): ABP.FullRoute[] {
  return routes.reduce<ABP.FullRoute[]>((acc, val) => {
    if (val.invisible) {
      return acc
    }

    const route = { ...val }
    if (route.children && route.children.length) {
      route.children = getVisibleRoutes(route.children)
    }

    return [...acc, route]
  }, [])
}

/**
 * Filter routes based on search query.
 * A route is included if its name matches, or if any of its children match.
 */
function filterRoutesBySearch(routes: ABP.FullRoute[], searchQuery: string): ABP.FullRoute[] {
  if (!searchQuery.trim()) {
    return routes
  }

  const query = searchQuery.toLowerCase().trim()

  return routes.reduce<ABP.FullRoute[]>((acc, route) => {
    const nameMatches = route.name?.toLowerCase().includes(query)

    // Check if any children match
    let matchingChildren: ABP.FullRoute[] = []
    if (route.children && route.children.length) {
      matchingChildren = filterRoutesBySearch(route.children, searchQuery)
    }

    // Include route if name matches or has matching children
    if (nameMatches || matchingChildren.length > 0) {
      const filteredRoute = { ...route }
      if (matchingChildren.length > 0) {
        filteredRoute.children = matchingChildren
      }
      return [...acc, filteredRoute]
    }

    return acc
  }, [])
}

interface CollapsibleNavLinkProps {
  route: ABP.FullRoute
}

/**
 * Collapsible navigation link for routes with children
 */
const CollapsibleNavLink = ({ route }: CollapsibleNavLinkProps) => {
  const location = useLocation()
  const { direction } = useDirection()

  // Check if any child is active
  const isChildActive = useMemo(() => {
    const checkActive = (routes: ABP.FullRoute[]): boolean => {
      return routes.some((r) => {
        const path = r.url || r.path || ''
        if (path && location.pathname.startsWith(path)) {
          return true
        }
        if (r.children?.length) {
          return checkActive(r.children)
        }
        return false
      })
    }
    return route.children ? checkActive(route.children) : false
  }, [route.children, location.pathname])

  // Track open state to determine highlight behavior
  const [isOpen, setIsOpen] = useState(isChildActive)

  // Only highlight parent when collapsed AND has active child
  const showHighlight = !isOpen && isChildActive

  return (
    <Collapsible.Root defaultOpen={isChildActive} onOpenChange={(details) => setIsOpen(details.open)}>
      <Collapsible.Trigger asChild>
        <Button
          variant="ghost"
          width="full"
          justifyContent="start"
          color={showHighlight ? 'colorPalette.fg' : 'fg.muted'}
          bg={showHighlight ? 'colorPalette.subtle' : undefined}
          dir={direction}
          _hover={{
            bg: 'colorPalette.subtle',
            color: 'colorPalette.fg',
          }}
        >
          <HStack justifyContent="space-between" width="full">
            <HStack gap="3">
              {route.icon}
              {route.name}
            </HStack>
            <HStack gap="2">
              {route.badge !== undefined && (
                <Badge size="sm" colorPalette={route.badgeColorPalette || 'gray'} variant="solid">
                  {route.badge}
                </Badge>
              )}
              <Collapsible.Context>
                {(context) => (
                  <chakra.span
                    aria-hidden
                    transition="transform 0.2s"
                    transformOrigin="center"
                    transform={context.open ? 'rotate(180deg)' : undefined}>

                      <LuChevronDown />
                  </chakra.span>
                )}
              </Collapsible.Context>
            </HStack>
          </HStack>
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack gap="1" py="1">
          {route.children?.map((child) => {
            const childRoute = child as ABP.FullRoute
            return (
              <SidebarLink
                key={child.name}
                href={childRoute.url || child.path}
                ps="12"
                badge={child.badge}
                badgeColorPalette={child.badgeColorPalette}
              >
                {child.icon}
                {child.name}
              </SidebarLink>
            )
          })}
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

interface NavLinksProps {
  /** Default icon for routes without specific icons */
  defaultIcon?: ReactNode
}

/**
 * Navigation links component that renders routes from ABP config.
 * Icons are taken from the route's `icon` property.
 * Routes are filtered based on sidebar search query.
 */
export const NavLinks = ({ defaultIcon }: NavLinksProps) => {
  const { routes } = useConfig()
  const { searchQuery } = useSearch()

  const visibleRoutes = useMemo(() => {
    const visible = getVisibleRoutes(routes || [])
    return filterRoutesBySearch(visible, searchQuery)
  }, [routes, searchQuery])

  return (
    <Stack gap="1">
      {visibleRoutes.map((route) => {
        const icon = route.icon || defaultIcon
        const hasChildren = route.children && route.children.length > 0

        if (hasChildren) {
          return <CollapsibleNavLink key={route.name} route={route} />
        }

        return (
          <SidebarLink
            key={route.name}
            href={route.url || route.path}
            badge={route.badge}
            badgeColorPalette={route.badgeColorPalette}
          >
            {icon}
            {route.name}
          </SidebarLink>
        )
      })}
    </Stack>
  )
}
