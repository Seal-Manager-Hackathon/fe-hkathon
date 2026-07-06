import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes/index.jsx'

// ---------------------------------------------------------------------------
// One-time router instance created outside the component tree.
// Prevents re-creation on every render and keeps HMR stable.
// ---------------------------------------------------------------------------
const router = createBrowserRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}

