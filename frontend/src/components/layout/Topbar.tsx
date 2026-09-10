function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <p className="text-sm text-gray-500">
          Teaching Workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          🔔
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            T
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              Teacher
            </p>

            <p className="text-xs text-gray-500">
              Instructor
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar