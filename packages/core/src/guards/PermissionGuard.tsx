import React, { ReactNode } from 'react';
import { usePermission } from '../hooks/usePermission';

export interface PermissionGuardProps {
  children: ReactNode;
  policy: string;
  fallback?: ReactNode;
}

/**
 * Guard component that protects content requiring specific permissions
 */
export function PermissionGuard({ children, policy, fallback = null }: PermissionGuardProps) {
  const hasPermission = usePermission(policy);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version of PermissionGuard
 */
export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  policy: string,
  fallback?: ReactNode
) {
  return function PermissionGuardedComponent(props: P) {
    return (
      <PermissionGuard policy={policy} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}
