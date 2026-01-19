import type { ContainerProps } from '@chakra-ui/react'
import { CloseButton, Container, Drawer, HStack, IconButton, Portal } from '@chakra-ui/react'
import { LuAlignLeft, LuAlignRight } from 'react-icons/lu'
import { useDirection } from '@abpjs/core'
import { Logo } from './logo'
import { Sidebar, SidebarProps } from './sidebar'

export interface NavbarProps extends ContainerProps {
  /** Props to pass to the Sidebar component in the drawer */
  sidebarProps?: Omit<SidebarProps, 'hideBelow' | 'hideFrom'>
}

export const Navbar = ({ sidebarProps, ...props }: NavbarProps) => {
  const { isRtl } = useDirection()

  return (
    <Container py="2.5" background="bg.panel" borderBottomWidth="1px" {...props}>
      <HStack justify="space-between">
        <Logo />
        <Drawer.Root placement={isRtl ? 'end' : 'start'}>
          <Drawer.Trigger asChild>
            <IconButton aria-label="Open Menu" variant="ghost" colorPalette="gray">
              {isRtl ? <LuAlignLeft /> : <LuAlignRight />}
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" colorPalette="gray" />
                </Drawer.CloseTrigger>
                <Sidebar {...sidebarProps} />
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </HStack>
    </Container>
  )
}
