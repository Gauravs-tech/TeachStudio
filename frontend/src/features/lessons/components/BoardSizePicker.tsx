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
    <div className="flex h-9 w-59 p-5 items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      Font Size
      <button
        type="button"
        title="Decrease stroke size"
        aria-label="Decrease stroke size"
        disabled={size <= MIN_SIZE}
        onClick={handleDecrease}
        className="flex h-full w-9 items-center justify-center text-sm text-gray-600 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300"
      >
        −
      </button>

      <div className="flex h-full min-w-[58px] items-center justify-center border-x border-gray-200 px-2 text-xs font-semibold tabular-nums text-gray-700">
        {size}
      </div>

      <button
        type="button"
        title="Increase stroke size"
        aria-label="Increase stroke size"
        disabled={size >= MAX_SIZE}
        onClick={handleIncrease}
        className="flex h-full w-9 items-center justify-center text-sm text-gray-600 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300"
      >
        +
      </button>
    </div>
  )
}

export default BoardSizePicker