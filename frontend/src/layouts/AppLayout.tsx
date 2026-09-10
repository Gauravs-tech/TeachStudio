import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--ts-bg-primary)] text-[var(--ts-text-primary)]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-[var(--ts-bg-primary)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout