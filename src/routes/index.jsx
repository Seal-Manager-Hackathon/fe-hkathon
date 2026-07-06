import { lazy, Suspense } from 'react'
import StudentLayout from '../layouts/StudentLayout'

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 items-center justify-center rounded-md bg-[#064f5d] px-3 text-base font-extrabold text-white">
            SEAL
          </div>
          <span className="text-xl font-bold text-[#064f5d]">Hackathon</span>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

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

