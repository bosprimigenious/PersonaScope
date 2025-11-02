import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, inverted = false }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // inverted模式：已登录时重定向（用于登录页）
  if (inverted && isLoggedIn) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  // 普通模式：未登录时重定向到登录页
  if (!inverted && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
