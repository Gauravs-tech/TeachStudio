import { useEffect, useState } from 'react'

import type {
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

interface ZoomControlsProps {
  api: ExcalidrawImperativeAPI | null
}

function ZoomOutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ZoomControls({
  api,
}: ZoomControlsProps) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateZoom = () => {
      const zoomState =
        api.getAppState().zoom

      setZoom(
        typeof zoomState.value === 'number'
          ? zoomState.value
          : 1,
      )
    }

    updateZoom()

    const unsubscribe =
      api.onChange(() => {
        updateZoom()
      })

    return unsubscribe
  }, [api])

  const handleZoomIn = () => {
    if (!api) {
      return
    }

    const currentZoom =
      api.getAppState().zoom.value

    const nextZoom = Math.min(
      currentZoom * 1.2,
      4,
    )

    api.updateScene({
      appState: {
        zoom: {
          value: nextZoom,
        },
      },
    })
  }

  const handleZoomOut = () => {
    if (!api) {
      return
    }

    const currentZoom =
      api.getAppState().zoom.value

    const nextZoom = Math.max(
      currentZoom / 1.2,
      0.1,
    )

    api.updateScene({
      appState: {
        zoom: {
          value: nextZoom,
        },
      },
    })
  }

  const handleResetZoom = () => {
    if (!api) {
      return
    }

    api.updateScene({
      appState: {
        zoom: {
          value: 1,
        },
      },
    })
  }

  const handleZoomToFit = () => {
    if (!api) {
      return
    }

    const elements =
      api.getSceneElements()

    if (elements.length === 0) {
      handleResetZoom()
      return
    }

    api.scrollToContent(elements, {
      fitToContent: true,
      animate: true,
      duration: 200,
    })
  }

  const zoomPercentage =
    Math.round(zoom * 100)

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/95 p-1 shadow-md backdrop-blur-sm">
      <button
        type="button"
        title="Zoom out"
        aria-label="Zoom out"
        onClick={handleZoomOut}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
      >
        <ZoomOutIcon />
      </button>

      <button
        type="button"
        title="Reset zoom to 100%"
        aria-label="Reset zoom to 100%"
        onClick={handleResetZoom}
        className="min-w-[52px] rounded-md px-2 py-1.5 text-xs font-semibold tabular-nums text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
      >
        {zoomPercentage}%
      </button>

      <button
        type="button"
        title="Zoom in"
        aria-label="Zoom in"
        onClick={handleZoomIn}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
      >
        <ZoomInIcon />
      </button>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      <button
        type="button"
        title="Fit board to screen"
        aria-label="Fit board to screen"
        onClick={handleZoomToFit}
        className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
      >
        Fit
      </button>
    </div>
  )
}

export default ZoomControls