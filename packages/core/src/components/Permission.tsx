import React, { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';

export interface PermissionProps {
  children: ReactNode;
  condition: string;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on permission
 * Equivalent to Angular's [abpPermission] directive
 */
export function Permission({ children, condition, fallback = null }: PermissionProps) {
  const hasPermission = usePermission(condition);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook version for more flexibility
 */
export function usePermissionCheck(condition: string): {
  hasPermission: boolean;
  PermissionWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }>;
} {
  const hasPermission = usePermission(condition);

  const PermissionWrapper: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
    children,
    fallback = null,
  }) => {
    if (!hasPermission) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  };

  return { hasPermission, PermissionWrapper };
}
