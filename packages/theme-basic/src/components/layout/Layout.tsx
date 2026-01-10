import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Collapse,
  Container,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
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
  const { isOpen, onToggle } = useDisclosure();

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
            as={RouterLink}
            to={brandLink}
            fontWeight="bold"
            fontSize="lg"
            color="white"
            _hover={{ textDecoration: 'none' }}
          >
            {brandName}
          </Box>

          {/* Mobile Toggle Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            color="white"
            aria-label="Toggle Navigation"
            aria-expanded={isOpen}
            _hover={{ bg: 'gray.700' }}
          />

          {/* Navigation Content - Collapsible on mobile */}
          <Collapse in={isOpen} animateOpacity>
            <Box
              display={{ base: 'block', md: 'none' }}
              pb={4}
              w="full"
            >
              {children}
            </Box>
          </Collapse>

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
