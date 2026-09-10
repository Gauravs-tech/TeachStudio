import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Excalidraw,
  type ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

import '@excalidraw/excalidraw/index.css'

import ZoomControls from './ZoomControls'
import TeachingToolbar from './TeachingToolbar'
import UndoRedoControls from './UndoRedoControls'
import ClearBoardButton from './ClearBoardButton'
import SlideNavigation from './SlideNavigation'
import DownloadSlidesButton from './DownloadSlidesButton'

import { useSlideScene } from '../hooks/useSlideScene'
import { useSlideKeyboardNavigation } from '../hooks/useSlideKeyboardNavigation'
import { usePartialEraser } from '../hooks/usePartialEraser'
import { useTemporaryHighlighter } from '../hooks/useTemporaryHighlighter'

import { BOARD_THEMES } from '../config/boardThemes'
import { useBoardStore } from '../stores/board.store'

interface WhiteboardProps {
  onBoardChange: () => void
}

function Whiteboard({
  onBoardChange,
}: WhiteboardProps) {
  const theme = useBoardStore(
    (state) => state.theme,
  )

  const activeTool = useBoardStore(
    (state) => state.activeTool,
  )

  const [
    excalidrawAPI,
    setExcalidrawAPI,
  ] =
    useState<ExcalidrawImperativeAPI | null>(
      null,
    )

  const boardTheme =
    BOARD_THEMES[theme]

  const initialData = useMemo(
    () => ({
      elements: [],

      appState: {
        viewBackgroundColor:
          boardTheme.backgroundColor,

        theme: 'light' as const,
      },

      /*
       * Do not automatically move the
       * viewport to content.
       *
       * The slide itself controls the
       * scene and navigation.
       */
      scrollToContent: false,
    }),
    [
      boardTheme.backgroundColor,
    ],
  )

  /*
   * Slide keyboard navigation.
   */
  useSlideKeyboardNavigation()

  /*
   * Custom TeachStudio partial eraser.
   *
   * We intentionally do NOT use
   * Excalidraw's native eraser.
   */
  usePartialEraser({
    api: excalidrawAPI,

    active:
      activeTool === 'eraser',
  })

  /*
   * Temporary highlighter.
   */
  useTemporaryHighlighter({
    api: excalidrawAPI,

    active:
      activeTool === 'highlight',
  })

  /*
   * Connect Excalidraw with
   * the currently selected slide.
   */
  useSlideScene({
    api: excalidrawAPI,

    onBoardChange,
  })

  /*
   * Keep the selected board theme
   * synchronized with Excalidraw.
   */
  useEffect(() => {
    if (!excalidrawAPI) {
      return
    }

    excalidrawAPI.updateScene({
      appState: {
        viewBackgroundColor:
          boardTheme.backgroundColor,
      },
    })
  }, [
    excalidrawAPI,
    boardTheme.backgroundColor,
  ])

  /*
   * Completely disable wheel-based
   * scrolling/panning inside the board.
   *
   * Capture phase is important here.
   * It intercepts the event before
   * Excalidraw receives it.
   */
  useEffect(() => {
    if (!excalidrawAPI) {
      return
    }

    const board =
      document.querySelector(
        '.teachstudio-board',
      )

    if (!board) {
      return
    }

    const preventBoardScroll = (
      event: WheelEvent,
    ) => {
      event.preventDefault()
      event.stopPropagation()
    }

    board.addEventListener(
      'wheel',
      preventBoardScroll,
      {
        passive: false,
        capture: true,
      },
    )

    return () => {
      board.removeEventListener(
        'wheel',
        preventBoardScroll,
        {
          capture: true,
        },
      )
    }
  }, [excalidrawAPI])

  return (
    <div
      className={`teachstudio-board board-${theme.toLowerCase()} h-full w-full overflow-hidden`}
    >
      {/* Download + Clear controls */}
      <div className="absolute right-4 top-4 z-[1000] flex items-center gap-2">
        <DownloadSlidesButton
          appState={
            excalidrawAPI?.getAppState() ??
            null
          }
          files={
            excalidrawAPI?.getFiles() ??
            {}
          }
        />

        <ClearBoardButton
          api={excalidrawAPI}
          onBoardChange={
            onBoardChange
          }
        />
      </div>

      {/* Excalidraw workspace */}
      <div className="relative h-full w-full overflow-hidden">
        <Excalidraw
          excalidrawAPI={
            setExcalidrawAPI
          }
          initialData={initialData}
          theme="light"
          onChange={() => {
            onBoardChange()
          }}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor:
                false,

              clearCanvas:
                false,

              export:
                false,

              loadScene:
                false,

              saveToActiveFile:
                false,

              saveAsImage:
                false,

              toggleTheme:
                false,
            },

            tools: {
              image: false,
            },
          }}
        />

        {/* TeachStudio drawing toolbar */}
        <div className="absolute left-4 top-4 z-[1000]">
          <TeachingToolbar
            api={excalidrawAPI}
          />
        </div>

        {/* TeachStudio bottom controls */}
        <div className="absolute bottom-4 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-3">
          {/* Undo / Redo */}
          <UndoRedoControls
            api={excalidrawAPI}
          />

          {/* Zoom */}
          <ZoomControls
            api={excalidrawAPI}
          />

          {/* Slide navigation */}
          <SlideNavigation />
        </div>
      </div>
    </div>
  )
}

export default Whiteboard