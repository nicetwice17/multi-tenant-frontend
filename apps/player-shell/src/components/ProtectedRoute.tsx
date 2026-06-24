import { Navigate } from 'react-router-dom'

interface IProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: IProtectedRouteProps) {
  const token = localStorage.getItem('auth_token')
  if (!token) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}
