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
      <div className="flex items-center gap-2 rounded-xl border border-[#2A2F3A] bg-[#171B24]/95 px-2.5 py-2 shadow-lg backdrop-blur-sm">
        <span className="text-xs font-medium text-[#CBD5E1]">
          Clear entire board?
        </span>

        <button
          type="button"
          onClick={() =>
            setIsConfirming(false)
          }
          className="rounded-md border border-[#2A2F3A] bg-[#11151D] px-2.5 py-1.5 text-xs font-medium text-[#94A3B8] transition hover:border-[#8B5CF6] hover:bg-[#171B24] hover:text-[#F8FAFC]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleClearBoard}
          className="rounded-md bg-[#F43F5E] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#FB7185]"
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
      className="rounded-lg border border-[#2A2F3A] bg-[#171B24]/95 px-3.5 py-2 text-xs font-semibold text-[#CBD5E1] shadow-lg backdrop-blur-sm transition hover:border-[#8B5CF6] hover:bg-[#11151D] hover:text-[#F8FAFC]"
    >
      Clear
    </button>
  )
}

export default ClearBoardButton