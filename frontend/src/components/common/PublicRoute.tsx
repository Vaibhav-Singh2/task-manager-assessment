import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const PublicRoute = () => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
