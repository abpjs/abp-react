import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRoutes, selectConfig } from '../slices/config.slice';
import { eLayoutType } from '../enums';
import { ABP } from '../models';

export interface DynamicLayoutProps {
  children: React.ReactNode;
}

/**
 * Component that dynamically selects layout based on current route
 * Equivalent to Angular's DynamicLayoutComponent
 */
export function DynamicLayout({ children }: DynamicLayoutProps) {
  const location = useLocation();
  const config = useSelector(selectConfig);
  const routes = useSelector(selectRoutes);

  const LayoutComponent = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const layout = findLayout(segments, routes);

    const layouts = config.requirements.layouts;
    if (!layouts || !layouts.length) {
      return null;
    }

    // Find matching layout component
    const matchedLayout = layouts.find((l) => {
      if (!l) return false;
      // Check if component name contains layout type
      const componentName = l.displayName || l.name || '';
      return componentName.toLowerCase().includes(layout);
    });

    return matchedLayout || null;
  }, [location.pathname, routes, config.requirements.layouts]);

  if (LayoutComponent) {
    return <LayoutComponent>{children}</LayoutComponent>;
  }

  return <>{children}</>;
}

function findLayout(segments: string[], routes: ABP.FullRoute[]): eLayoutType {
  let layout: eLayoutType = eLayoutType.empty;

  // Flatten wrapper routes
  const flatRoutes = routes.reduce<ABP.FullRoute[]>((acc, val) => {
    if (val.wrapper && val.children) {
      return [...acc, ...val.children];
    }
    return [...acc, val];
  }, []);

  const route = flatRoutes.find((r) => r.path === segments[0]);

  if (route) {
    if (route.layout) {
      layout = route.layout;
    }

    if (route.children && route.children.length && segments[1]) {
      const child = route.children.find((c) => c.path === segments[1]);
      if (child?.layout) {
        layout = child.layout;
      }
    }
  }

  return layout;
}
