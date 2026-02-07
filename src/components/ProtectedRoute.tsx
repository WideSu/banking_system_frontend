import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute({ bypass }: { bypass: boolean }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If not authenticated AND not in dev mode, redirect to login
  if (!isAuthenticated && !bypass) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access (in dev mode or if actually logged in)
  return <Outlet />;
}