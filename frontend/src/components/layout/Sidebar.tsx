import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">
          TeachStudio
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/lessons"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          Lessons
        </NavLink>

        <NavLink
          to="/recordings"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          Recordings
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">
            Teacher
          </p>

          <p className="text-xs text-gray-500">
            TeachStudio Account
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar