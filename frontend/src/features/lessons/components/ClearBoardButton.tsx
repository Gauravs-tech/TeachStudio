import { useState } from 'react'

import {
  CaptureUpdateAction,
  type ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

interface ClearBoardButtonProps {
  api: ExcalidrawImperativeAPI | null
  onBoardChange: () => void
}

function ClearBoardButton({
  api,
  onBoardChange,
}: ClearBoardButtonProps) {
  const [isConfirming, setIsConfirming] =
    useState(false)

  const handleClearBoard = () => {
    if (!api) {
      return
    }

    const elements =
      api.getSceneElements()

    if (elements.length === 0) {
      setIsConfirming(false)
      return
    }

    /*
     * Mark all current elements as deleted
     * instead of permanently removing them.
     *
     * This keeps the operation compatible
     * with TeachStudio's custom undo/redo.
     */
    const clearedElements =
      elements.map((element) => ({
        ...element,
        isDeleted: true,
      }))

    api.updateScene({
      elements: clearedElements,
      captureUpdate:
        CaptureUpdateAction.IMMEDIATELY,
    })

    setIsConfirming(false)

    onBoardChange()
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 px-2 py-1.5 shadow-md backdrop-blur-sm">
        <span className="text-xs text-gray-500">
          Clear entire board?
        </span>

        <button
          type="button"
          onClick={() =>
            setIsConfirming(false)
          }
          className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleClearBoard}
          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
        >
          Clear Board
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      title="Clear board"
      aria-label="Clear board"
      onClick={() =>
        setIsConfirming(true)
      }
      className="rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs font-medium text-gray-600 shadow-md backdrop-blur-sm transition hover:bg-gray-100 hover:text-gray-900"
    >
      Clear
    </button>
  )
}

export default ClearBoardButton