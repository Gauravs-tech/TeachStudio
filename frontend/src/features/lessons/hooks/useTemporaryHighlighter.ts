import {
  useEffect,
  useRef,
} from 'react'

import {
  CaptureUpdateAction,
  type ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

import { useBoardStore } from '../stores/board.store'

interface UseTemporaryHighlighterOptions {
  api: ExcalidrawImperativeAPI | null
  active: boolean
}

const HIGHLIGHT_DURATION = 3000
const STROKE_FINISH_DELAY = 150
const FADE_DURATION = 400
const FADE_INTERVAL = 40

export function useTemporaryHighlighter({
  api,
  active,
}: UseTemporaryHighlighterOptions) {
  const existingElementIdsRef =
    useRef<Set<string>>(new Set())

  const drawingHighlightIdsRef =
    useRef<Set<string>>(new Set())

  const isDrawingRef =
    useRef(false)

  const finishTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

  const timerIdsRef =
    useRef<
      Set<ReturnType<typeof setTimeout>>
    >(new Set())

  useEffect(() => {
    if (!api || !active) {
      return
    }

    const startDrawing = () => {
      isDrawingRef.current = true

      drawingHighlightIdsRef.current.clear()

      existingElementIdsRef.current =
        new Set(
          api
            .getSceneElements()
            .map(
              (element) =>
                element.id,
            ),
        )
    }

    const handleChange = (
      elements: readonly any[],
    ) => {
      if (!isDrawingRef.current) {
        return
      }

      for (const element of elements) {
        if (
          element.type !==
          'freedraw'
        ) {
          continue
        }

        if (
          existingElementIdsRef.current.has(
            element.id,
          )
        ) {
          continue
        }

        drawingHighlightIdsRef.current.add(
          element.id,
        )
      }
    }

    const fadeAndRemoveHighlights = (
      highlightIds: string[],
    ) => {
      if (!api) {
        return
      }

      const startTime = Date.now()

      const fade = () => {
        if (!api) {
          return
        }

        const elapsed =
          Date.now() - startTime

        const progress =
          Math.min(
            elapsed / FADE_DURATION,
            1,
          )

        const elements =
          api.getSceneElements()

        const idsToFade =
          new Set(highlightIds)

        const updatedElements =
          elements.map(
            (element) => {
              if (
                !idsToFade.has(
                  element.id,
                )
              ) {
                return element
              }

              const originalOpacity =
                element.opacity ?? 100

              return {
                ...element,
                opacity:
                  Math.round(
                    originalOpacity *
                      (1 - progress),
                  ),
              }
            },
          )

        api.updateScene({
          elements:
            updatedElements,

          captureUpdate:
            CaptureUpdateAction.NEVER,
        })

        if (progress < 1) {
          const nextTimer =
            window.setTimeout(
              fade,
              FADE_INTERVAL,
            )

          timerIdsRef.current.add(
            nextTimer,
          )
        } else {
          const elementsAfterFade =
            api.getSceneElements()

          const finalElements =
            elementsAfterFade.map(
              (element) => {
                if (
                  idsToFade.has(
                    element.id,
                  )
                ) {
                  return {
                    ...element,
                    isDeleted: true,
                  }
                }

                return element
              },
            )

          api.updateScene({
            elements:
              finalElements,

            captureUpdate:
              CaptureUpdateAction.NEVER,
          })
        }
      }

      fade()
    }

    const finishDrawing = () => {
      if (!isDrawingRef.current) {
        return
      }

      isDrawingRef.current = false

      if (
        finishTimeoutRef.current
      ) {
        window.clearTimeout(
          finishTimeoutRef.current,
        )
      }

      finishTimeoutRef.current =
        window.setTimeout(() => {
          finishTimeoutRef.current =
            null

          const highlightMode =
            useBoardStore
              .getState()
              .highlightMode

          if (
            highlightMode !==
            'TEMPORARY'
          ) {
            drawingHighlightIdsRef.current.clear()
            return
          }

          const highlightIds =
            Array.from(
              drawingHighlightIdsRef.current,
            )

          drawingHighlightIdsRef.current.clear()

          if (
            highlightIds.length === 0
          ) {
            return
          }

          const timer =
            window.setTimeout(() => {
              timerIdsRef.current.delete(
                timer,
              )

              fadeAndRemoveHighlights(
                highlightIds,
              )
            }, HIGHLIGHT_DURATION)

          timerIdsRef.current.add(
            timer,
          )
        }, STROKE_FINISH_DELAY)
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as HTMLElement | null

      if (
        !target?.closest(
          '.excalidraw',
        )
      ) {
        return
      }

      startDrawing()
    }

    const handlePointerUp = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as HTMLElement | null

      if (
        !target?.closest(
          '.excalidraw',
        )
      ) {
        return
      }

      finishDrawing()
    }

    const handlePointerCancel = () => {
      isDrawingRef.current = false
      drawingHighlightIdsRef.current.clear()
    }

    const unsubscribeChange =
      api.onChange(
        handleChange,
      )

    window.addEventListener(
      'pointerdown',
      handlePointerDown,
      true,
    )

    window.addEventListener(
      'pointerup',
      handlePointerUp,
      true,
    )

    window.addEventListener(
      'pointercancel',
      handlePointerCancel,
      true,
    )

    return () => {
      unsubscribeChange()

      window.removeEventListener(
        'pointerdown',
        handlePointerDown,
        true,
      )

      window.removeEventListener(
        'pointerup',
        handlePointerUp,
        true,
      )

      window.removeEventListener(
        'pointercancel',
        handlePointerCancel,
        true,
      )

      if (
        finishTimeoutRef.current
      ) {
        window.clearTimeout(
          finishTimeoutRef.current,
        )
      }

      for (const timer of
        timerIdsRef.current) {
        window.clearTimeout(
          timer,
        )
      }

      timerIdsRef.current.clear()

      existingElementIdsRef.current.clear()

      drawingHighlightIdsRef.current.clear()

      isDrawingRef.current = false
    }
  }, [api, active])
}