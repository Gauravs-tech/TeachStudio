function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--ts-border)] bg-[var(--ts-bg-secondary)] px-6">
      {/* Page Context */}
      <div>
        <p className="text-sm font-medium text-[var(--ts-text-secondary)]">
          Teaching Workspace
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-[var(--ts-text-muted)] transition hover:bg-[var(--ts-bg-card)] hover:text-white"
        >
          <span className="text-lg">
            🔔
          </span>

          {/* Notification indicator */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--ts-coral)] shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[var(--ts-border)]" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6D28D9] to-[#A855F7] text-sm font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]">
              T
            </div>

            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--ts-bg-secondary)] bg-[var(--ts-success)]" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[var(--ts-text-primary)]">
              Teacher
            </p>

            <p className="text-xs text-[var(--ts-text-muted)]">
              Instructor
            </p>
          </div>

          {/* Dropdown indicator */}
          <span className="hidden text-xs text-[var(--ts-text-muted)] sm:inline">
            ▼
          </span>
        </div>
      </div>
    </header>
  )
}

export default Topbar