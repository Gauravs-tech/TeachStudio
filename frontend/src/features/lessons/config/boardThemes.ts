import type {
  BoardTheme,
  BoardThemeConfig,
} from '../types/board'

export const BOARD_THEMES: Record<
  BoardTheme,
  BoardThemeConfig
> = {
  WHITEBOARD: {
    id: 'WHITEBOARD',
    name: 'Whiteboard',
    backgroundColor: '#ffffff',
    previewClass: 'bg-white border-gray-300',
  },

  BLACKBOARD: {
    id: 'BLACKBOARD',
    name: 'Blackboard',
    backgroundColor: '#1f2937',
    previewClass: 'bg-gray-900 border-gray-700',
  },

  GREENBOARD: {
    id: 'GREENBOARD',
    name: 'Greenboard',
    backgroundColor: '#166534',
    previewClass: 'bg-green-800 border-green-900',
  },
}