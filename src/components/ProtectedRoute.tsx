import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks/reduxHooks';

// Protected Route cho User (USER hoặc ADMIN)
export const ProtectedUserRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'USER' && role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

// Protected Route cho Admin (chỉ ADMIN)
export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    // Nếu chưa đăng nhập, điều hướng về trang login
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== 'ADMIN') {
    // Nếu không phải ADMIN, điều hướng về unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

// Route công khai (không yêu cầu đăng nhập)
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};
