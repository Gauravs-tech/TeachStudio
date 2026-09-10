import { BOARD_THEMES } from '../config/boardThemes'
import { useBoardStore } from '../stores/board.store'

function BoardThemeSelector() {
  const theme = useBoardStore((state) => state.theme)
  const setTheme = useBoardStore((state) => state.setTheme)

  return (
    <div className="flex items-center gap-2">
      {Object.values(BOARD_THEMES).map((boardTheme) => {
        const isActive = theme === boardTheme.id

        return (
          <button
            key={boardTheme.id}
            type="button"
            onClick={() => setTheme(boardTheme.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              isActive
                ? 'border-gray-900 bg-gray-100 text-gray-900'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full border ${boardTheme.previewClass}`}
            />

            {boardTheme.name}
          </button>
        )
      })}
    </div>
  )
}

export default BoardThemeSelector