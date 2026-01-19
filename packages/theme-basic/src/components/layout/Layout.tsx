import React, { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Collapsible,
  Container,
} from '@chakra-ui/react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export interface LayoutProps {
  /** Brand name or logo to display in navbar */
  brandName?: string;
  /** Link destination for brand (defaults to "/") */
  brandLink?: string;
  /** Content to render in the navbar (typically navigation items) */
  children?: ReactNode;
  /** Whether to render the router outlet inside the layout */
  renderOutlet?: boolean;
}

/**
 * Base layout component providing navbar structure.
 * Translated from Angular LayoutComponent.
 *
 * Provides a responsive Bootstrap-style navbar with:
 * - Brand/logo area
 * - Collapsible navigation for mobile
 * - Slot for navigation content via children
 * - Container with router outlet
 *
 * @example
 * ```tsx
 * <Layout brandName="MyApp">
 *   <NavItems />
 * </Layout>
 * ```
 */
export function LayoutBase({
  brandName = 'MyProjectName',
  brandLink = '/',
  children,
  renderOutlet = true,
}: LayoutProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Main Navbar */}
      <Box
        as="nav"
        id="main-navbar"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="sticky"
        bg="gray.800"
        color="white"
        px={4}
        py={2}
      >
        <Flex
          maxW="container.xl"
          mx="auto"
          align="center"
          justify="space-between"
          wrap="wrap"
        >
          {/* Brand */}
          <Box
            asChild
            fontWeight="bold"
            fontSize="lg"
            color="white"
            _hover={{ textDecoration: 'none' }}
          >
            <RouterLink to={brandLink}>
              {brandName}
            </RouterLink>
          </Box>

          {/* Mobile Toggle Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            variant="ghost"
            color="white"
            aria-label="Toggle Navigation"
            aria-expanded={isOpen}
            _hover={{ bg: 'gray.700' }}
          >
            {isOpen ? <X size={12} /> : <MenuIcon size={20} />}
          </IconButton>

          {/* Navigation Content - Collapsible on mobile */}
          <Collapsible.Root open={isOpen}>
            <Collapsible.Content>
              <Box
                display={{ base: 'block', md: 'none' }}
                pb={4}
                w="full"
              >
                {children}
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>

          {/* Navigation Content - Always visible on desktop */}
          <Flex
            display={{ base: 'none', md: 'flex' }}
            align="center"
            flex={1}
            ml={8}
          >
            {children}
          </Flex>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Container maxW="container.xl" pt="5rem" pb={4}>
        {renderOutlet && <Outlet />}
      </Container>
    </>
  );
}

export default LayoutBase;
