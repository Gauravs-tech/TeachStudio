import { useEffect, useRef } from 'react'

import {
  CaptureUpdateAction,
  type ExcalidrawImperativeAPI,
  viewportCoordsToSceneCoords,
} from '@excalidraw/excalidraw'

import { ERASER_SIZES } from '../config/eraserSizes'
import { useBoardStore } from '../stores/board.store'

interface Point {
  x: number
  y: number
}

interface UsePartialEraserOptions {
  api: ExcalidrawImperativeAPI | null
  active: boolean
}

type FreeDrawElement = Extract<
  ReturnType<ExcalidrawImperativeAPI['getSceneElements']>[number],
  { type: 'freedraw' }
>

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

function segmentsIntersect(
  a: Point,
  b: Point,
  c: Point,
  d: Point,
) {
  const orientation = (
    p: Point,
    q: Point,
    r: Point,
  ) => {
    const value =
      (q.y - p.y) *
        (r.x - q.x) -
      (q.x - p.x) *
        (r.y - q.y)

    if (Math.abs(value) < 0.00001) {
      return 0
    }

    return value > 0 ? 1 : 2
  }

  const o1 = orientation(a, b, c)
  const o2 = orientation(a, b, d)
  const o3 = orientation(c, d, a)
  const o4 = orientation(c, d, b)

  if (
    o1 !== o2 &&
    o3 !== o4
  ) {
    return true
  }

  return false
}

function distanceBetweenSegments(
  a: Point,
  b: Point,
  c: Point,
  d: Point,
) {
  if (
    segmentsIntersect(
      a,
      b,
      c,
      d,
    )
  ) {
    return 0
  }

  return Math.min(
    distanceToSegment(a, c, d),
    distanceToSegment(b, c, d),
    distanceToSegment(c, a, b),
    distanceToSegment(d, a, b),
  )
}

function getEraserRadius(
  api: ExcalidrawImperativeAPI,
) {
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

  const zoom =
    api.getAppState().zoom.value

  return radius / zoom
}

function createFragment(
  element: FreeDrawElement,
  points: [number, number][],
  pressures: number[],
  index: number,
) {
  if (points.length < 2) {
    return null
  }

  const worldPoints = points.map(
    ([x, y]) => ({
      x: element.x + x,
      y: element.y + y,
    }),
  )

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const point of worldPoints) {
    minX = Math.min(
      minX,
      point.x,
    )

    minY = Math.min(
      minY,
      point.y,
    )

    maxX = Math.max(
      maxX,
      point.x,
    )

    maxY = Math.max(
      maxY,
      point.y,
    )
  }

  const localPoints =
    worldPoints.map(
      (point) =>
        [
          point.x - minX,
          point.y - minY,
        ] as [number, number],
    )

  return {
    ...element,

    id:
      index === 0
        ? element.id
        : crypto.randomUUID(),

    x: minX,
    y: minY,

    width: Math.max(
      maxX - minX,
      0.0001,
    ),

    height: Math.max(
      maxY - minY,
      0.0001,
    ),

    points: localPoints,

    pressures:
      pressures.length ===
      points.length
        ? pressures
        : [],

    lastCommittedPoint: null,

    version:
      element.version + 1,

    versionNonce:
      Math.floor(
        Math.random() *
          2147483647,
      ),

    seed:
      Math.floor(
        Math.random() *
          2147483647,
      ),
  }
}

function splitFreedrawElement(
  element: FreeDrawElement,
  eraseStart: Point,
  eraseEnd: Point,
  radius: number,
) {
  const points =
    element.points

  if (points.length < 2) {
    return {
      changed: false,
      fragments: [element],
    }
  }

  const fragments: {
    points: [number, number][]
    pressures: number[]
  }[] = []

  let currentPoints:
    [number, number][] = []

  let currentPressures:
    number[] = []

  const flushCurrent = () => {
    if (currentPoints.length >= 2) {
      fragments.push({
        points: currentPoints,
        pressures:
          currentPressures,
      })
    }

    currentPoints = []
    currentPressures = []
  }

  for (
    let index = 0;
    index < points.length;
    index++
  ) {
    const point = points[index]

    const worldPoint = {
      x: element.x + point[0],
      y: element.y + point[1],
    }

    const previousPoint =
      index > 0
        ? {
            x:
              element.x +
              points[index - 1][0],
            y:
              element.y +
              points[index - 1][1],
          }
        : null

    const touched =
      distanceToSegment(
        worldPoint,
        eraseStart,
        eraseEnd,
      ) <= radius

    const segmentTouched =
      previousPoint &&
      distanceBetweenSegments(
        previousPoint,
        worldPoint,
        eraseStart,
        eraseEnd,
      ) <= radius

    if (
      touched ||
      segmentTouched
    ) {
      flushCurrent()
      continue
    }

    currentPoints.push([
      point[0],
      point[1],
    ])

    if (
      element.pressures &&
      element.pressures.length ===
        points.length
    ) {
      currentPressures.push(
        element.pressures[index],
      )
    }
  }

  flushCurrent()

  const changed =
    fragments.length !== 1 ||
    fragments[0]?.points.length !==
      points.length

  if (!changed) {
    return {
      changed: false,
      fragments: [element],
    }
  }

  const createdFragments =
    fragments
      .map(
        (fragment, index) =>
          createFragment(
            element,
            fragment.points,
            fragment.pressures,
            index,
          ),
      )
      .filter(
        (
          fragment,
        ): fragment is NonNullable<
          typeof fragment
        > => fragment !== null,
      )

  return {
    changed: true,
    fragments: createdFragments,
  }
}

function eraseBetweenPoints(
  api: ExcalidrawImperativeAPI,
  start: Point,
  end: Point,
) {
  const elements =
    api.getSceneElements()

  const radius =
    getEraserRadius(api)

  let changed = false

  const nextElements =
    elements.flatMap(
      (element) => {
        if (
          element.type !==
          'freedraw'
        ) {
          return [element]
        }

        const result =
          splitFreedrawElement(
            element,
            start,
            end,
            radius,
          )

        if (!result.changed) {
          return [element]
        }

        changed = true

        return result.fragments
      },
    )

  if (!changed) {
    return
  }

  api.updateScene({
    elements: nextElements,
    captureUpdate:
      CaptureUpdateAction.IMMEDIATELY,
  })
}

export function usePartialEraser({
  api,
  active,
}: UsePartialEraserOptions) {
  const isDraggingRef =
    useRef(false)

  const lastPointRef =
    useRef<Point | null>(null)

  useEffect(() => {
    if (!api || !active) {
      return
    }

    const isExcalidrawTarget = (
      target: EventTarget | null,
    ) => {
      if (
        !(target instanceof Element)
      ) {
        return false
      }

      return Boolean(
        target.closest(
          '.excalidraw',
        ),
      )
    }

    const getScenePoint = (
      event: PointerEvent,
    ): Point => {
      const point =
        viewportCoordsToSceneCoords(
          {
            clientX:
              event.clientX,
            clientY:
              event.clientY,
          },
          api.getAppState(),
        )

      return {
        x: point.x,
        y: point.y,
      }
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        !isExcalidrawTarget(
          event.target,
        )
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const point =
        getScenePoint(event)

      isDraggingRef.current =
        true

      lastPointRef.current =
        point

      eraseBetweenPoints(
        api,
        point,
        point,
      )
    }

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (
        !isDraggingRef.current
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const events =
        typeof event.getCoalescedEvents ===
        'function'
          ? event.getCoalescedEvents()
          : [event]

      for (const currentEvent of events) {
        const currentPoint =
          getScenePoint(
            currentEvent,
          )

        const previousPoint =
          lastPointRef.current

        if (!previousPoint) {
          lastPointRef.current =
            currentPoint

          continue
        }

        if (
          previousPoint.x ===
            currentPoint.x &&
          previousPoint.y ===
            currentPoint.y
        ) {
          continue
        }

        eraseBetweenPoints(
          api,
          previousPoint,
          currentPoint,
        )

        lastPointRef.current =
          currentPoint
      }
    }

    const handlePointerUp = (
      event: PointerEvent,
    ) => {
      if (
        !isDraggingRef.current
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      isDraggingRef.current =
        false

      lastPointRef.current =
        null
    }

    window.addEventListener(
      'pointerdown',
      handlePointerDown,
      true,
    )

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      true,
    )

    window.addEventListener(
      'pointerup',
      handlePointerUp,
      true,
    )

    window.addEventListener(
      'pointercancel',
      handlePointerUp,
      true,
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        handlePointerDown,
        true,
      )

      window.removeEventListener(
        'pointermove',
        handlePointerMove,
        true,
      )

      window.removeEventListener(
        'pointerup',
        handlePointerUp,
        true,
      )

      window.removeEventListener(
        'pointercancel',
        handlePointerUp,
        true,
      )

      isDraggingRef.current =
        false

      lastPointRef.current =
        null
    }
  }, [api, active])
}