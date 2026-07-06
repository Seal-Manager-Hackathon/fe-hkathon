import { lazy, Suspense } from 'react'
import StudentLayout from '../layouts/StudentLayout'
import RouteFallback from '../components/RouteFallback'

const HomePage = lazy(() => import('../pages/student/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const routes = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]

