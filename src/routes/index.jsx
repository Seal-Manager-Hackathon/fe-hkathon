import { lazy, Suspense } from 'react'
import StudentLayout from '../layouts/StudentLayout'
import RouteFallback from '../components/RouteFallback'

const HomePage = lazy(() => import('../pages/student/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const HackathonManagement = lazy(() => import('../pages/admin/HackathonManagement'))
const HackathonDetail = lazy(() => import('../pages/admin/HackathonDetail'))
const HackathonCreate = lazy(() => import('../pages/admin/HackathonCreate'))
const HackathonEdit = lazy(() => import('../pages/admin/HackathonEdit'))
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'))
const UsersCreate = lazy(() => import('../pages/admin/UsersCreate'))
const UserDetail = lazy(() => import('../pages/admin/UserDetail'))
const UserEdit = lazy(() => import('../pages/admin/UserEdit'))
const NotificationsManagement = lazy(() => import('../pages/admin/NotificationsManagement'))
const NotificationsCreate = lazy(() => import('../pages/admin/NotificationsCreate'))
const NotificationDetail = lazy(() => import('../pages/admin/NotificationDetail'))
const NotificationEdit = lazy(() => import('../pages/admin/NotificationEdit'))
const MyNotifications = lazy(() => import('../pages/admin/MyNotifications'))
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'))
const AdminProfileEdit = lazy(() => import('../pages/admin/AdminProfileEdit'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const routes = [
  { path: '/', element: <StudentLayout />, children: [
    { index: true, element: <Suspense fallback={<RouteFallback />}><HomePage /></Suspense> },
  ]},
  { path: '/admin', element: <Suspense fallback={<RouteFallback />}><AdminLayout /></Suspense>, children: [
    { index: true, element: <Suspense fallback={<RouteFallback />}><AdminDashboard /></Suspense> },
    { path: 'hackathons', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><HackathonManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><HackathonCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><HackathonEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><HackathonDetail /></Suspense> },
    ]},
    { path: 'users', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><UsersManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><UsersCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><UserEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><UserDetail /></Suspense> },
    ]},
    { path: 'notifications', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><NotificationsManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><NotificationsCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><NotificationEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><NotificationDetail /></Suspense> },
    ]},
    { path: 'my-notifications', element: <Suspense fallback={<RouteFallback />}><MyNotifications /></Suspense> },
    { path: 'profile', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><AdminProfile /></Suspense> },
      { path: 'edit', element: <Suspense fallback={<RouteFallback />}><AdminProfileEdit /></Suspense> },
    ]},
  ]},
  { path: '/login', element: <Suspense fallback={<RouteFallback />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<RouteFallback />}><RegisterPage /></Suspense> },
  { path: '/verify-email', element: <Suspense fallback={<RouteFallback />}><VerifyEmailPage /></Suspense> },
  { path: '*', element: <Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense> },
]
