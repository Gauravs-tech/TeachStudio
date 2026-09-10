import { create } from 'zustand'

import type {
  BoardTheme,
  HighlightMode,
} from '../types/board'

import type {
  EraserSize,
} from '../config/eraserSizes'

export type BoardTool =
  | 'selection'
  | 'freedraw'
  | 'text'
  | 'line'
  | 'arrow'
  | 'rectangle'
  | 'ellipse'
  | 'highlight'
  | 'eraser'

interface BoardState {
  theme: BoardTheme

  activeTool: BoardTool

  eraserSize: EraserSize

  highlightMode: HighlightMode

  setTheme: (
    theme: BoardTheme,
  ) => void

  setActiveTool: (
    tool: BoardTool,
  ) => void

  setEraserSize: (
    size: EraserSize,
  ) => void

  setHighlightMode: (
    mode: HighlightMode,
  ) => void
}

export const useBoardStore =
  create<BoardState>((set) => ({
    theme: 'WHITEBOARD',

    activeTool: 'selection',

    eraserSize: 'medium',

    highlightMode: 'PERMANENT',

    setTheme: (theme) => {
      set({ theme })
    },

    setActiveTool: (activeTool) => {
      set({ activeTool })
    },

    setEraserSize: (eraserSize) => {
      set({ eraserSize })
    },

    setHighlightMode: (
      highlightMode,
    ) => {
      set({ highlightMode })
    },
  }))