import BoardThemeSelector from './BoardThemeSelector'
import Whiteboard from './Whiteboard'

interface TldrawWorkspaceProps {
  onBoardChange: () => void
}

function TldrawWorkspace({
  onBoardChange,
}: TldrawWorkspaceProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Board
          </p>
        </div>

        <BoardThemeSelector />
      </div>

      <div className="min-h-0 flex-1">
        <Whiteboard
          onBoardChange={onBoardChange}
        />
      </div>
    </div>
  )
}

export default TldrawWorkspace