import type { BoardTheme } from '../types/board'
import type { TLDefaultColorStyle } from 'tldraw'

export interface BoardColorOption {
  id: TLDefaultColorStyle
  name: string
  previewClass: string
}

export const BOARD_COLORS: Record<
  BoardTheme,
  BoardColorOption[]
> = {
  WHITEBOARD: [
    {
      id: 'black',
      name: 'Black',
      previewClass: 'bg-black',
    },
    {
      id: 'red',
      name: 'Red',
      previewClass: 'bg-red-600',
    },
    {
      id: 'blue',
      name: 'Blue',
      previewClass: 'bg-blue-600',
    },
    {
      id: 'green',
      name: 'Green',
      previewClass: 'bg-green-600',
    },
    {
      id: 'orange',
      name: 'Orange',
      previewClass: 'bg-orange-500',
    },
    {
      id: 'violet',
      name: 'Purple',
      previewClass: 'bg-violet-600',
    },
  ],

  BLACKBOARD: [
    {
      id: 'white',
      name: 'White',
      previewClass: 'bg-white',
    },
    {
      id: 'yellow',
      name: 'Yellow',
      previewClass: 'bg-yellow-300',
    },
    {
      id: 'light-red',
      name: 'Pink',
      previewClass: 'bg-pink-400',
    },
    {
      id: 'blue',
      name: 'Blue',
      previewClass: 'bg-blue-500',
    },
    {
      id: 'green',
      name: 'Green',
      previewClass: 'bg-green-500',
    },
    {
      id: 'violet',
      name: 'Purple',
      previewClass: 'bg-violet-500',
    },
  ],

  GREENBOARD: [
    {
      id: 'white',
      name: 'White',
      previewClass: 'bg-white',
    },
    {
      id: 'yellow',
      name: 'Yellow',
      previewClass: 'bg-yellow-300',
    },
    {
      id: 'blue',
      name: 'Blue',
      previewClass: 'bg-blue-400',
    },
    {
      id: 'light-red',
      name: 'Pink',
      previewClass: 'bg-pink-400',
    },
    {
      id: 'violet',
      name: 'Purple',
      previewClass: 'bg-violet-400',
    },
  ],
}