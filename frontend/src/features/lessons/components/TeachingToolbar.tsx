import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types'

import BoardColorPicker from './BoardColorPicker'
import BoardSizePicker from './BoardSizePicker'
import { useSlideStore } from '../stores/slide.store'

import { useBoardStore } from '../stores/board.store'

interface TeachingToolbarProps {
  api: ExcalidrawImperativeAPI | null
}

type TeachStudioTool =
  | 'selection'
  | 'freedraw'
  | 'text'
  | 'line'
  | 'arrow'
  | 'rectangle'
  | 'ellipse'
  | 'highlight'
  | 'eraser'

interface ToolButtonConfig {
  id: TeachStudioTool
  label: string
  shortcut: string
  icon: React.ReactNode
}

function SelectIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 3l10.5 10.5M6 3l1.5 16 4.5-5 6.5 7.5" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z" />
      <path d="M13.5 7.5l3 3" />
    </svg>
  )
}

function TextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 5h14M12 5v14M8 19h8" />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 19L19 5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 19L19 5" />
      <path d="M11 5h8v8" />
    </svg>
  )
}

function RectangleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="5"
        y="6"
        width="14"
        height="12"
        rx="1"
      />
    </svg>
  )
}

function EllipseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="7"
        ry="5"
      />
    </svg>
  )
}

function HighlightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 16L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19H5v-3z" />
      <path d="M13 8l3 3" />
      <path d="M4 21h16" />
    </svg>
  )
}

function EraserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 15l8-8a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3l-5 5H8l-3-3a2.1 2.1 0 0 1 0-3z" />
      <path d="M13 18h6" />
    </svg>
  )
}

const TOOLS: ToolButtonConfig[] = [
  {
    id: 'selection',
    label: 'Select',
    shortcut: 'V',
    icon: <SelectIcon />,
  },
  {
    id: 'freedraw',
    label: 'Pen',
    shortcut: 'P',
    icon: <PenIcon />,
  },
  {
    id: 'text',
    label: 'Text',
    shortcut: 'T',
    icon: <TextIcon />,
  },
  {
    id: 'line',
    label: 'Line',
    shortcut: 'L',
    icon: <LineIcon />,
  },
  {
    id: 'arrow',
    label: 'Arrow',
    shortcut: 'A',
    icon: <ArrowIcon />,
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    shortcut: 'R',
    icon: <RectangleIcon />,
  },
  {
    id: 'ellipse',
    label: 'Ellipse',
    shortcut: 'O',
    icon: <EllipseIcon />,
  },
  {
    id: 'highlight',
    label: 'Highlight',
    shortcut: 'H',
    icon: <HighlightIcon />,
  },
  {
    id: 'eraser',
    label: 'Eraser',
    shortcut: 'E',
    icon: <EraserIcon />,
  },
]

const TOOLS_WITH_OPTIONS: TeachStudioTool[] = [
  'freedraw',
  'line',
  'arrow',
  'rectangle',
  'ellipse',
  'highlight',
]

function TeachingToolbar({
  api,
}: TeachingToolbarProps) {
  const [activeTool, setActiveTool] =
    useState<TeachStudioTool>(
      'selection',
    )

  const [showOptions, setShowOptions] =
    useState(false)

  const highlightModeRef =
    useRef(false)

    const addSlide = useSlideStore(
  (state) => state.addSlide,
)

  /**
   * Activate TeachStudio Highlight.
   *
   * Excalidraw does not have a dedicated
   * highlighter, so Highlight uses freedraw
   * with yellow, extraBold and 45% opacity.
   */
  const activateHighlight = useCallback(() => {
    if (!api) {
      return
    }

    highlightModeRef.current = true

    api.updateScene({
      appState: {
        currentItemStrokeColor: '#facc15',
        currentItemStrokeWidth: 8,
        currentItemOpacity: 45,
      },
    })

    api.setActiveTool({
      type: 'freedraw',
    })

    setActiveTool('highlight')

    useBoardStore
      .getState()
      .setActiveTool('highlight')
  }, [api])

  /**
   * Activate TeachStudio Eraser.
   *
   * Excalidraw stays on selection because
   * the actual partial erasing is handled
   * by usePartialEraser.
   */
  const activateEraser = useCallback(() => {
    if (!api) {
      return
    }

    highlightModeRef.current = false

    api.updateScene({
      appState: {
        currentItemOpacity: 100,
      },
    })

    api.setActiveTool({
      type: 'selection',
    })

    setActiveTool('eraser')

    useBoardStore
      .getState()
      .setActiveTool('eraser')
  }, [api])

  /**
   * Keep TeachStudio toolbar state synchronized
   * with Excalidraw.
   */
  useEffect(() => {
    if (!api) {
      return
    }

    const unsubscribe =
      api.onChange(
        (_elements, appState) => {
          /*
           * Eraser is controlled by TeachStudio.
           */
          if (
            useBoardStore
              .getState()
              .activeTool === 'eraser'
          ) {
            setActiveTool('eraser')
            return
          }

          const currentTool =
            appState.activeTool.type

          /*
           * Highlight internally uses freedraw.
           */
          if (
            currentTool === 'freedraw' &&
            highlightModeRef.current
          ) {
            return
          }

          /*
           * Normal freedraw means Pen.
           */
          if (
            currentTool === 'freedraw'
          ) {
            setActiveTool('freedraw')
            return
          }

          /*
           * Any other Excalidraw tool means
           * we have exited Highlight mode.
           */
          highlightModeRef.current = false

          /*
           * Whenever the active tool is not
           * Highlight, keep opacity at 100%.
           */
          if (
            appState.currentItemOpacity !==
            100
          ) {
            api.updateScene({
              appState: {
                currentItemOpacity: 100,
              },
            })
          }

          const isTeachStudioTool =
            TOOLS.some(
              (tool) =>
                tool.id === currentTool,
            )

          if (isTeachStudioTool) {
            setActiveTool(
              currentTool as TeachStudioTool,
            )
          }
        },
      )

    return unsubscribe
  }, [api])

  /**
   * Keyboard shortcuts.
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (
          target instanceof HTMLElement &&
          target.isContentEditable
        )
      ) {
        return
      }

      const key =
        event.key.toLowerCase()

      const tool = TOOLS.find(
        (item) =>
          item.shortcut.toLowerCase() ===
          key,
      )

      if (!tool || !api) {
        return
      }

      event.preventDefault()

      if (tool.id === 'highlight') {
        activateHighlight()
      } else if (tool.id === 'eraser') {
        activateEraser()
      } else {
        highlightModeRef.current = false

        api.updateScene({
          appState: {
            currentItemOpacity: 100,
          },
        })

        api.setActiveTool({
          type: tool.id,
        })

        setActiveTool(tool.id)

        useBoardStore
          .getState()
          .setActiveTool(tool.id)
      }

      setShowOptions(
        TOOLS_WITH_OPTIONS.includes(
          tool.id,
        ),
      )
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    api,
    activateHighlight,
    activateEraser,
  ])

  /**
   * Handle toolbar button selection.
   */
  const handleToolSelect = (
    tool: TeachStudioTool,
  ) => {
    if (!api) {
      return
    }

    const isSameTool =
      activeTool === tool

    const hasOptions =
      TOOLS_WITH_OPTIONS.includes(tool)

    /*
     * Highlight gets 45% opacity.
     */
    if (tool === 'highlight') {
      activateHighlight()
    } else {
      /*
       * Every non-highlight tool gets
       * normal 100% opacity.
       */
      highlightModeRef.current = false

      api.updateScene({
        appState: {
          currentItemOpacity: 100,
        },
      })

      if (tool === 'eraser') {
        /*
         * Keep Excalidraw on selection.
         * usePartialEraser handles erasing.
         */
        api.setActiveTool({
          type: 'selection',
        })
      } else {
        api.setActiveTool({
          type: tool,
        })
      }

      setActiveTool(tool)

      useBoardStore
        .getState()
        .setActiveTool(tool)
    }

    /*
     * Clicking the currently selected tool
     * toggles its contextual options.
     */
    if (isSameTool) {
      setShowOptions(
        (current) => !current,
      )

      return
    }

    setShowOptions(hasOptions)
  }

  const highlightMode =
    useBoardStore(
      (state) => state.highlightMode,
    )

  const setHighlightMode =
    useBoardStore(
      (state) => state.setHighlightMode,
    )

  return (
    <div className="flex flex-row items-start gap-2">
      {/* Main toolbar */}
      <div className="flex flex-col items-center gap-1 rounded-xl border border-[#2A2F3A] bg-[#171B24]/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        {TOOLS.map((tool, index) => {
          const isActive =
            activeTool === tool.id

          const showDivider =
            index === 3 || index === 6

          return (
            <div
              key={tool.id}
              className="flex flex-col items-center"
            >
              {showDivider && (
                <div className="my-1 h-px w-6 bg-[#2A2F3A]" />
              )}

              <button
                type="button"
                title={`${tool.label} (${tool.shortcut})`}
                aria-label={`${tool.label} (${tool.shortcut})`}
                aria-pressed={isActive}
                onClick={() =>
                  handleToolSelect(
                    tool.id,
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_14px_rgba(139,92,246,0.45)]'
                    : 'text-[#CBD5E1] hover:bg-[#2A2F3A] hover:text-[#F8FAFC]'
                }`}
              >
                {tool.icon}
              </button>
            </div>
          )
        })}

        <div className="my-1 h-px w-full bg-[#2A2F3A]" />

<button
  type="button"
  title="Add new slide"
  aria-label="Add new slide"
  onClick={() => {
    addSlide()
  }}
  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#CBD5E1] transition hover:bg-[#2A2F3A] hover:text-white active:bg-[#6D28D9]"
>
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
</button>
      </div>

      {/* Contextual options */}
      {showOptions && (
        <div className="flex flex-col gap-2">
          <BoardColorPicker
            api={api}
          />

          <BoardSizePicker
            api={api}
          />

          

          {/* Highlight options */}
          {activeTool === 'highlight' && (
            <div className="flex flex-col items-stretch gap-1 rounded-lg border border-[#2A2F3A] bg-[#171B24]/95 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm">
              <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Highlight
              </span>

              <button
                type="button"
                onClick={() =>
                  setHighlightMode(
                    'TEMPORARY',
                  )
                }
                className={`rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium transition ${
                  highlightMode ===
                  'TEMPORARY'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'text-[#CBD5E1] hover:bg-[#2A2F3A] hover:text-[#F8FAFC]'
                }`}
              >
                Temporary
              </button>

              <button
                type="button"
                onClick={() =>
                  setHighlightMode(
                    'PERMANENT',
                  )
                }
                className={`rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium transition ${
                  highlightMode ===
                  'PERMANENT'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'text-[#CBD5E1] hover:bg-[#2A2F3A] hover:text-[#F8FAFC]'
                }`}
              >
                Permanent
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TeachingToolbar