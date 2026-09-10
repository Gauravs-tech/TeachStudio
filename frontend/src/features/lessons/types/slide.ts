import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'

export interface Slide {
  id: string

  title: string

  order: number

  width: number

  height: number

  elements: readonly ExcalidrawElement[]
}