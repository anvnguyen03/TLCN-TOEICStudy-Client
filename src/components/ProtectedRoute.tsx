import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface ProtectedRouteProps {
  allowedRoles: string[]
  redirectIfAuthenticated?: string // Trang mà người dùng sẽ được điều hướng đến nếu đã đăng nhập
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectIfAuthenticated  }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth)

  if (isAuthenticated && redirectIfAuthenticated) {
    return <Navigate to={redirectIfAuthenticated} replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
