import type { TLDefaultSizeStyle } from 'tldraw'

export interface BoardSizeOption {
  id: TLDefaultSizeStyle
  name: string
  previewClass: string
}

export const BOARD_SIZES: BoardSizeOption[] = [
  {
    id: 's',
    name: 'Thin',
    previewClass: 'h-0.5 w-5',
  },
  {
    id: 'm',
    name: 'Medium',
    previewClass: 'h-1 w-5',
  },
  {
    id: 'l',
    name: 'Thick',
    previewClass: 'h-1.5 w-5',
  },
  {
    id: 'xl',
    name: 'Extra Thick',
    previewClass: 'h-2 w-5',
  },
]