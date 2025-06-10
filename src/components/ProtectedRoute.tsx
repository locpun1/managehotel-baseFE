import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTE_PATH } from '@/constants/routes';
import { useAppSelector } from '@/store';
import { PATH_STAFF_WITH_ROOM } from '@/views/Auth/Login';

interface Props {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const ProtectedRoute = ({ children, requiredRoles, requiredPermissions }: Props) => {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth);
  const role = profile?.role;
  // const permissions = profile?.permissions;

  const location = useLocation();
  const path = localStorage.getItem(PATH_STAFF_WITH_ROOM)

  if (!isAuthenticated) {
    if(location.pathname === '/staff/home'){
        return (
        <Navigate to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`} state={location.pathname} replace />
      );
    }else{
      return (
        <Navigate to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`} state={location.pathname} replace />
      );
    }
  }

  if (requiredRoles && role && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace />;
  }

  if (location.pathname === '/' || location.pathname === '') {
    if (role === 'manager') {
      return <Navigate to={`/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`} replace />;
    } 
    if (role === 'staff') {
      return <Navigate to={`${path}`} replace />;
    } 
  }

  // if (
  //   requiredPermissions &&
  //   permissions &&
  //   requiredPermissions.length > 0 &&
  //   !requiredPermissions?.some((permission) => permissions.includes(permission))
  // ) {
  //   return <Navigate to={ROUTE_PATH.PERMISSION_DENIED} replace />;
  // }

  return children;
};

export default ProtectedRoute;
