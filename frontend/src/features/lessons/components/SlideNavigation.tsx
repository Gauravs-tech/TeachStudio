import type { SVGProps } from 'react'

import { useSlideStore } from '../stores/slide.store'

function ArrowLeftIcon(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 19L5 12L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightIcon(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 5L19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SlideNavigation() {
  const slides =
    useSlideStore(
      (state) => state.slides,
    )

  const activeSlideId =
    useSlideStore(
      (state) =>
        state.activeSlideId,
    )

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

  const currentIndex =
    slides.findIndex(
      (slide) =>
        slide.id ===
        activeSlideId,
    )

  const currentSlideNumber =
    currentIndex === -1
      ? 1
      : currentIndex + 1

  const canGoPrevious =
    currentIndex > 0

  const canGoNext =
    currentIndex >= 0 &&
    currentIndex <
      slides.length - 1

  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#2A2F3A] bg-[#171B24]/95 p-1 shadow-lg shadow-black/20 backdrop-blur-sm">
      <button
        type="button"
        title="Previous slide"
        aria-label="Previous slide"
        disabled={!canGoPrevious}
        onClick={
          goToPreviousSlide
        }
        className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#CBD5E1] transition hover:bg-[#2A2F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ArrowLeftIcon />

        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      <div className="mx-1 h-5 w-px bg-[#2A2F3A]" />

      <div
        className="min-w-[52px] text-center text-xs font-semibold tabular-nums text-[#CBD5E1]"
        aria-label={`Slide ${currentSlideNumber} of ${slides.length}`}
      >
        {currentSlideNumber} /{' '}
        {slides.length}
      </div>

      <div className="mx-1 h-5 w-px bg-[#2A2F3A]" />

      <button
        type="button"
        title="Next slide"
        aria-label="Next slide"
        disabled={!canGoNext}
        onClick={
          goToNextSlide
        }
        className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#CBD5E1] transition hover:bg-[#2A2F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ArrowRightIcon />
      </button>
    </div>
  )
}

export default SlideNavigation