import React, { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loginPath?: string;
}

/**
 * Guard component that protects routes requiring authentication
 */
export function AuthGuard({
  children,
  fallback = null,
  loginPath = '/account/login',
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(loginPath, {
        state: { redirectUrl: location.pathname + location.search },
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, location, loginPath]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version of AuthGuard
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
