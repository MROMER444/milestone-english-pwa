import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
