import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useSession();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Replace instead of push to prevent going back
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
