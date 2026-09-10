import { StateNode } from 'tldraw'

import { ERASER_SIZES } from '../config/eraserSizes'
import { useBoardStore } from '../stores/board.store'
import { eraseStrokes } from '../utils/excalidrawEraser'

export class PartialEraserTool extends StateNode {
  static override id = 'partial-eraser'

  private eraserPath: Array<{
    x: number
    y: number
  }> = []

  override onEnter() {
    this.editor.setCursor({
      type: 'cross',
      rotation: 0,
    })

    this.eraserPath = []
  }

  override onExit() {
    this.editor.setCursor({
      type: 'default',
      rotation: 0,
    })

    this.eraserPath = []
  }

  override onPointerDown() {
    const point =
      this.editor.inputs.getCurrentPagePoint()

    this.eraserPath = [
      {
        x: point.x,
        y: point.y,
      },
    ]
  }

  override onPointerMove() {
    if (
      !this.editor.inputs.getIsDragging()
    ) {
      return
    }

    const point =
      this.editor.inputs.getCurrentPagePoint()

    const previous =
      this.eraserPath.at(-1)

    if (
      previous &&
      previous.x === point.x &&
      previous.y === point.y
    ) {
      return
    }

    this.eraserPath.push({
      x: point.x,
      y: point.y,
    })
  }

  override onPointerUp() {
    const eraserSize =
      useBoardStore.getState()
        .eraserSize

    const selectedSize =
      ERASER_SIZES.find(
        (size) =>
          size.id === eraserSize,
      )

    const radius =
      selectedSize?.radius ?? 14

    if (this.eraserPath.length > 0) {
      eraseStrokes(
        this.editor,
        this.eraserPath,
        radius,
      )
    }

    this.eraserPath = []

    if (
      this.editor
        .getInstanceState()
        .isToolLocked
    ) {
      return
    }

    this.editor.setCurrentTool(
      'select',
    )
  }

  override onCancel() {
    this.eraserPath = []

    this.editor.setCurrentTool(
      'select',
    )
  }
}