import { useEffect } from 'react'

import { useSlideStore } from '../stores/slide.store'

export function useSlideKeyboardNavigation() {
  const goToPreviousSlide =
    useSlideStore(
      (state) =>
        state.goToPreviousSlide,
    )

  const goToNextSlide =
    useSlideStore(
      (state) =>
        state.goToNextSlide,
    )

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as HTMLElement | null

      /*
       * Don't change slides while
       * the teacher is typing in an
       * input, textarea, or editable
       * element.
       */
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }

      /*
       * Avoid interfering with
       * browser navigation when
       * modifier keys are pressed.
       */
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return
      }

      if (
        event.key === 'ArrowLeft'
      ) {
        event.preventDefault()

        goToPreviousSlide()
      }

      if (
        event.key === 'ArrowRight'
      ) {
        event.preventDefault()

        goToNextSlide()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    goToPreviousSlide,
    goToNextSlide,
  ])
}