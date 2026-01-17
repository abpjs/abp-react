import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { eLayoutType } from '@abpjs/core';

export interface LayoutEmptyProps {
  /** Custom children to render instead of Outlet */
  children?: ReactNode;
}

/**
 * Empty layout component for pages that don't need a navbar.
 * Translated from Angular LayoutEmptyComponent.
 *
 * Provides a minimal layout with just the router outlet.
 * Useful for error pages, landing pages, or custom layouts.
 *
 * @example
 * ```tsx
 * <LayoutEmpty />
 * ```
 */
export function LayoutEmpty({ children }: LayoutEmptyProps): React.ReactElement {
  return (
    <Box minH="100vh">
      {children || <Outlet />}
    </Box>
  );
}

// Static type property for layout system
LayoutEmpty.type = eLayoutType.empty;

export default LayoutEmpty;
