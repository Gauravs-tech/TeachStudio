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

      scrollToContent: true,
    }),
    [
      boardTheme.backgroundColor,
    ],
  )

  /*
   * Custom TeachStudio partial eraser.
   *
   * Important:
   * We intentionally do NOT activate
   * Excalidraw's native eraser here.
   *
   * The custom hook handles:
   * - pointer tracking
   * - smooth eraser movement
   * - partial stroke removal
   * - splitting strokes
   * - zoom/pan coordinate conversion
   */
  usePartialEraser({
    api: excalidrawAPI,
    active:
      activeTool === 'eraser',
  })

  useTemporaryHighlighter({
  api: excalidrawAPI,
  active:
    activeTool === 'highlight',
})

  /*
   * Update board background
   * whenever the selected board theme changes.
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

  return (
    <div
      className={`teachstudio-board board-${theme.toLowerCase()}`}
    >
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

      {/* TeachStudio undo / redo */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <UndoRedoControls
          api={excalidrawAPI}
        />
      </div>

      {/* TeachStudio zoom controls */}
      <div className="absolute bottom-4 left-1/8 z-[1000] -translate-x-1/2">
        <ZoomControls
          api={excalidrawAPI}
        />
      </div>

      {/* TeachStudio clear board */}
<div className="absolute top-4 right-4 z-[1000]">
  <ClearBoardButton
    api={excalidrawAPI}
    onBoardChange={onBoardChange}
  />
</div>
    </div>
  )
}

export default Whiteboard