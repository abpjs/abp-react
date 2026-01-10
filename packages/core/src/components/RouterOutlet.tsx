import { Outlet } from 'react-router-dom';

/**
 * Simple wrapper around react-router's Outlet
 * Equivalent to Angular's RouterOutletComponent
 */
export function RouterOutlet() {
  return <Outlet />;
}
