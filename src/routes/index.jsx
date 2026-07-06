import { lazy, Suspense } from 'react'
import StudentLayout from '../layouts/StudentLayout'
import RouteFallback from '../components/RouteFallback'

const HomePage = lazy(() => import('../pages/student/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const HackathonManagement = lazy(() => import('../pages/admin/HackathonManagement'))
const HackathonDetail = lazy(() => import('../pages/admin/HackathonDetail'))
const HackathonCreate = lazy(() => import('../pages/admin/HackathonCreate'))
const HackathonEdit = lazy(() => import('../pages/admin/HackathonEdit'))
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'))
const UsersCreate = lazy(() => import('../pages/admin/UsersCreate'))
const NotificationsManagement = lazy(() => import('../pages/admin/NotificationsManagement'))
const NotificationsCreate = lazy(() => import('../pages/admin/NotificationsCreate'))
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
      {
        path: 'hackathons',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <HackathonManagement />
              </Suspense>
            ),
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<RouteFallback />}>
                <HackathonCreate />
              </Suspense>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <Suspense fallback={<RouteFallback />}>
                <HackathonEdit />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<RouteFallback />}>
                <HackathonDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <UsersManagement />
              </Suspense>
            ),
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<RouteFallback />}>
                <UsersCreate />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'notifications',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<RouteFallback />}>
                <NotificationsManagement />
              </Suspense>
            ),
          },
          {
            path: 'create',
            element: (
              <Suspense fallback={<RouteFallback />}>
                <NotificationsCreate />
              </Suspense>
            ),
          },
        ],
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
