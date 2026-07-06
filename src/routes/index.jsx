import { lazy, Suspense } from 'react'
import RootLayout from '../layouts/RootLayout.jsx'

// ---------------------------------------------------------------------------
// Lazy-loaded pages — enables automatic code splitting per route
// ---------------------------------------------------------------------------
const HomePage = lazy(() => import('../pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))

// ---------------------------------------------------------------------------
// Route-level fallback — shown while the lazy chunk loads
// ---------------------------------------------------------------------------
function RouteFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: 48 }}>
      Loading…
    </div>
  )
}

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------
export const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteFallback />}>
            <HomePage />
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
    ],
  },
]
