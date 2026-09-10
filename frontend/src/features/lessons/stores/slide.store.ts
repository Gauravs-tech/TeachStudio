import { create } from 'zustand'

import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'

import { SLIDE_CONFIG } from '../config/slideConfig'

import type { Slide } from '../types/slide'

interface SlideState {
  slides: Slide[]

  activeSlideId: string

  addSlide: () => Slide

  setActiveSlide: (
    slideId: string,
  ) => void

  updateSlideElements: (
    slideId: string,
    elements: readonly ExcalidrawElement[],
  ) => void

  renameSlide: (
    slideId: string,
    title: string,
  ) => void

  deleteSlide: (
    slideId: string,
  ) => void

  goToPreviousSlide: () => void

  goToNextSlide: () => void
}

const firstSlide: Slide = {
  id: 'slide-1',

  title: 'Slide 1',

  order: 1,

  width: SLIDE_CONFIG.width,

  height: SLIDE_CONFIG.height,

  elements: [],
}

export const useSlideStore =
  create<SlideState>((set) => ({
    slides: [firstSlide],

    activeSlideId:
      firstSlide.id,

    addSlide: () => {
      let createdSlide: Slide

      set((state) => {
        const nextOrder =
          state.slides.length + 1

        createdSlide = {
          id: crypto.randomUUID(),

          title: `Slide ${nextOrder}`,

          order: nextOrder,

          width:
            SLIDE_CONFIG.width,

          height:
            SLIDE_CONFIG.height,

          elements: [],
        }

        return {
          slides: [
            ...state.slides,
            createdSlide,
          ],

          activeSlideId:
            createdSlide.id,
        }
      })

      return createdSlide!
    },

    setActiveSlide: (
      slideId,
    ) => {
      set({
        activeSlideId:
          slideId,
      })
    },

    updateSlideElements: (
      slideId,
      elements,
    ) => {
      set((state) => ({
        slides:
          state.slides.map(
            (slide) =>
              slide.id === slideId
                ? {
                    ...slide,

                    elements,
                  }
                : slide,
          ),
      }))
    },

    renameSlide: (
      slideId,
      title,
    ) => {
      const trimmedTitle =
        title.trim()

      if (!trimmedTitle) {
        return
      }

      set((state) => ({
        slides:
          state.slides.map(
            (slide) =>
              slide.id === slideId
                ? {
                    ...slide,

                    title:
                      trimmedTitle,
                  }
                : slide,
          ),
      }))
    },

    deleteSlide: (
      slideId,
    ) => {
      set((state) => {
        if (
          state.slides.length <= 1
        ) {
          return state
        }

        const slideIndex =
          state.slides.findIndex(
            (slide) =>
              slide.id === slideId,
          )

        if (slideIndex === -1) {
          return state
        }

        const remainingSlides =
          state.slides
            .filter(
              (slide) =>
                slide.id !== slideId,
            )
            .map(
              (
                slide,
                index,
              ) => ({
                ...slide,

                order: index + 1,
              }),
            )

        let nextActiveSlideId =
          state.activeSlideId

        if (
          state.activeSlideId ===
          slideId
        ) {
          const nextSlide =
            remainingSlides[
              Math.min(
                slideIndex,
                remainingSlides.length -
                  1,
              )
            ]

          nextActiveSlideId =
            nextSlide.id
        }

        return {
          slides:
            remainingSlides,

          activeSlideId:
            nextActiveSlideId,
        }
      })
    },

    goToPreviousSlide:
      () => {
        set((state) => {
          const currentIndex =
            state.slides.findIndex(
              (slide) =>
                slide.id ===
                state.activeSlideId,
            )

          if (
            currentIndex <= 0
          ) {
            return state
          }

          return {
            activeSlideId:
              state.slides[
                currentIndex - 1
              ].id,
          }
        })
      },

    goToNextSlide: () => {
      set((state) => {
        const currentIndex =
          state.slides.findIndex(
            (slide) =>
              slide.id ===
              state.activeSlideId,
          )

        if (
          currentIndex === -1 ||
          currentIndex >=
            state.slides.length - 1
        ) {
          return state
        }

        return {
          activeSlideId:
            state.slides[
              currentIndex + 1
            ].id,
        }
      })
    },
  }))