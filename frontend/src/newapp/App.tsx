import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuthStore } from './store/authStore'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const TasksPage = lazy(() => import('./pages/TasksPage'))

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.accessToken)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
          path="/tasks"
        />
        <Route element={<Navigate replace to="/login" />} path="*" />
      </Routes>
    </Suspense>
  )
}
