import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Lesson from './pages/Lesson/Lesson'

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {title}
      </h1>

      <p className="mt-2 text-gray-600">
        This section will be built in a later sprint.
      </p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/lessons"
            element={<Placeholder title="Lessons" />}
          />

          <Route
            path="/recordings"
            element={<Placeholder title="Recordings" />}
          />

          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />

          <Route
            path="/lesson/:lessonId"
            element={<Lesson />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App