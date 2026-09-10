import {
  useEffect,
  useState,
} from 'react'

import type {
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

interface BoardSizePickerProps {
  api: ExcalidrawImperativeAPI | null
}

const MIN_SIZE = 1
const MAX_SIZE = 30
const STEP = 1

function BoardSizePicker({
  api,
}: BoardSizePickerProps) {
  const [size, setSize] = useState(2)

  useEffect(() => {
    if (!api) {
      return
    }

    const currentWidth =
      api.getAppState()
        .currentItemStrokeWidth

    if (
      typeof currentWidth === 'number' &&
      currentWidth >= MIN_SIZE &&
      currentWidth <= MAX_SIZE
    ) {
      setSize(currentWidth)
    }
  }, [api])

  const updateSize = (
    nextSize: number,
  ) => {
    if (!api) {
      return
    }

    const clampedSize =
      Math.min(
        MAX_SIZE,
        Math.max(
          MIN_SIZE,
          nextSize,
        ),
      )

    setSize(clampedSize)

    api.updateScene({
      appState: {
        currentItemStrokeWidth:
          clampedSize,
      },
    })
  }

  const handleDecrease = () => {
    updateSize(size - STEP)
  }

  const handleIncrease = () => {
    updateSize(size + STEP)
  }

  return (
    <div className="flex h-9 w-59 items-center overflow-hidden rounded-lg border border-[#2A2F3A] bg-[#171B24] shadow-sm">
      <span className="px-3 text-xs font-medium text-[#CBD5E1]">
        Stroke Size
      </span>

      <button
        type="button"
        title="Decrease stroke size"
        aria-label="Decrease stroke size"
        disabled={size <= MIN_SIZE}
        onClick={handleDecrease}
        className="flex h-full w-9 items-center justify-center text-sm text-[#CBD5E1] transition hover:bg-[#6D28D9] hover:text-white disabled:cursor-not-allowed disabled:text-[#64748B] disabled:hover:bg-transparent disabled:hover:text-[#64748B]"
      >
        −
      </button>

      <div className="flex h-full min-w-[58px] items-center justify-center border-x border-[#2A2F3A] px-2 text-xs font-semibold tabular-nums text-[#F8FAFC]">
        {size}
      </div>

      <button
        type="button"
        title="Increase stroke size"
        aria-label="Increase stroke size"
        disabled={size >= MAX_SIZE}
        onClick={handleIncrease}
        className="flex h-full w-9 items-center justify-center text-sm text-[#CBD5E1] transition hover:bg-[#6D28D9] hover:text-white disabled:cursor-not-allowed disabled:text-[#64748B] disabled:hover:bg-transparent disabled:hover:text-[#64748B]"
      >
        +
      </button>
    </div>
  )
}

export default BoardSizePicker