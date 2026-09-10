import type {
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

import {
  CaptureUpdateAction,
} from '@excalidraw/excalidraw'

interface Point {
  x: number
  y: number
}

function distance(
  a: Point,
  b: Point,
) {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.sqrt(
    dx * dx + dy * dy,
  )
}

function distanceToSegment(
  point: Point,
  start: Point,
  end: Point,
) {
  const dx = end.x - start.x
  const dy = end.y - start.y

  if (dx === 0 && dy === 0) {
    return distance(point, start)
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      (
        (point.x - start.x) * dx +
        (point.y - start.y) * dy
      ) /
        (dx * dx + dy * dy),
    ),
  )

  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy,
  }

  return distance(
    point,
    projection,
  )
}

function isPointNearPath(
  point: Point,
  path: Point[],
  radius: number,
) {
  if (path.length === 0) {
    return false
  }

  if (path.length === 1) {
    return (
      distance(point, path[0]) <= radius
    )
  }

  for (
    let index = 1;
    index < path.length;
    index++
  ) {
    if (
      distanceToSegment(
        point,
        path[index - 1],
        path[index],
      ) <= radius
    ) {
      return true
    }
  }

  return false
}

export function eraseElements(
  api: ExcalidrawImperativeAPI,
  path: Point[],
  radius: number,
) {
  if (path.length === 0) {
    return
  }

  const elements =
    api.getSceneElements()

  const elementsToDelete =
    elements.filter((element) => {
      const center = {
        x:
          element.x +
          element.width / 2,
        y:
          element.y +
          element.height / 2,
      }

      const elementRadius =
        Math.max(
          element.width,
          element.height,
        ) / 2

      return isPointNearPath(
        center,
        path,
        radius + elementRadius,
      )
    })

  if (
    elementsToDelete.length === 0
  ) {
    return
  }

  api.updateScene({
    elements: elements.map(
      (element) => {
        if (
          elementsToDelete.some(
            (target) =>
              target.id === element.id,
          )
        ) {
          return {
            ...element,
            isDeleted: true,
          }
        }

        return element
      },
    ),
    captureUpdate:
      CaptureUpdateAction.IMMEDIATELY,
  })
}