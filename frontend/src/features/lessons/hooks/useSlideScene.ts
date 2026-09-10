import {
  useEffect,
  useRef,
} from 'react'

import {
  CaptureUpdateAction,
  type ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

import { useSlideStore } from '../stores/slide.store'

interface UseSlideSceneOptions {
  api: ExcalidrawImperativeAPI | null
  onBoardChange: () => void
}

export function useSlideScene({
  api,
  onBoardChange,
}: UseSlideSceneOptions) {
  const activeSlideId =
    useSlideStore(
      (state) => state.activeSlideId,
    )

  const updateSlideElements =
    useSlideStore(
      (state) =>
        state.updateSlideElements,
    )

  const activeSlideIdRef =
    useRef(activeSlideId)

  const initializedRef =
    useRef(false)

  const switchingRef =
    useRef(false)

  const onBoardChangeRef =
    useRef(onBoardChange)

  /*
   * Keep the latest callback without
   * making the Excalidraw subscription
   * restart on every parent render.
   */
  useEffect(() => {
    onBoardChangeRef.current =
      onBoardChange
  }, [onBoardChange])

  /*
   * Connect to Excalidraw once.
   *
   * Every drawing change is saved
   * into the currently active slide.
   */
  useEffect(() => {
    if (!api) {
      return
    }

    const unsubscribe =
      api.onChange(
        (elements) => {
          if (
            !initializedRef.current ||
            switchingRef.current
          ) {
            return
          }

          const slideId =
            activeSlideIdRef.current

          updateSlideElements(
            slideId,
            elements,
          )

          onBoardChangeRef.current()
        },
      )

    return unsubscribe
  }, [
    api,
    updateSlideElements,
  ])

  /*
   * Initialize Excalidraw with
   * the currently active slide.
   */
  useEffect(() => {
    if (
      !api ||
      initializedRef.current
    ) {
      return
    }

    const {
      slides,
      activeSlideId:
        currentSlideId,
    } =
      useSlideStore.getState()

    const activeSlide =
      slides.find(
        (slide) =>
          slide.id ===
          currentSlideId,
      )

    if (!activeSlide) {
      return
    }

    switchingRef.current =
      true

    api.updateScene({
      elements:
        activeSlide.elements,

      captureUpdate:
        CaptureUpdateAction.NEVER,
    })

    activeSlideIdRef.current =
      currentSlideId

    initializedRef.current =
      true

    switchingRef.current =
      false
  }, [api])

  /*
   * Switch the Excalidraw scene
   * whenever the active slide changes.
   *
   * IMPORTANT:
   * We intentionally do NOT subscribe
   * to the entire slides array here.
   *
   * This prevents:
   *
   * Excalidraw change
   *      ↓
   * update slide
   *      ↓
   * slides changes
   *      ↓
   * effect runs
   *      ↓
   * update slide
   *      ↓
   * infinite loop
   */
  useEffect(() => {
    if (
      !api ||
      !initializedRef.current
    ) {
      return
    }

    const previousSlideId =
      activeSlideIdRef.current

    if (
      previousSlideId ===
      activeSlideId
    ) {
      return
    }

    const {
      slides,
    } =
      useSlideStore.getState()

    const previousElements =
      api.getSceneElements()

    const nextSlide =
      slides.find(
        (slide) =>
          slide.id ===
          activeSlideId,
      )

    if (!nextSlide) {
      return
    }

    switchingRef.current =
      true

    /*
     * Save the slide we are
     * leaving.
     */
    updateSlideElements(
      previousSlideId,
      previousElements,
    )

    /*
     * Load the selected slide.
     */
    api.updateScene({
      elements:
        nextSlide.elements,

      captureUpdate:
        CaptureUpdateAction.NEVER,
    })

    activeSlideIdRef.current =
      activeSlideId

    switchingRef.current =
      false
  }, [
    api,
    activeSlideId,
    updateSlideElements,
  ])
}