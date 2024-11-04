import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(role ?? '')) {
    return <Navigate to="/unauthorized" />
  }

  return <Outlet />
}

export default ProtectedRoute
