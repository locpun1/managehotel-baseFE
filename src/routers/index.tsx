// Pages
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import Customers from './Customers';
import Loadable from '@/components/Loadable';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';

import AuthLayout from '@/layouts/Auth/AuthLayout';
import DashboardLayout from '@/layouts/Dashboard';
import ChangePassword from '@/views/Auth/ChangePassword';
import ForgotPassword from '@/views/Auth/ForgotPassword';
import Login from '@/views/Auth/Login';
import Registration from '@/views/Auth/Registration';
import Manager from './Manager';

// Home
const Home = Loadable(lazy(() => import('@/views/Home')));
const DisplayRemote = Loadable(lazy(() => import('@/views/DisplayRemote')));

// Error
const NotFound = Loadable(lazy(() => import('@/views/Errors/NotFound')));
const PermissionDenied = Loadable(lazy(() => import('@/views/Errors/PermissionDenied')));

// Auth

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Home /> }, Manager, Customers],
  },
  {
    path: 'auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { index: true, element: <Navigate to={'login'} replace /> },
      { path: 'login', element: <Login /> },
      { path: 'registration', element: <Registration /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'change-password', element: <ChangePassword /> },
    ],
  },
  {
    path: '/display-remote/room/:roomId',
    element: <DisplayRemote />,
  },
  {
    path: '*',
    element: <Outlet />,
    children: [
      { index: true, element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/403',
    element: <PermissionDenied />,
  },
];

const Routers = () => {
  const element = useRoutes(routes);
  
  return element;
};

export default Routers;
