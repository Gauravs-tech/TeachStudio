import {
  exportToCanvas,
} from '@excalidraw/excalidraw'

import type {
  AppState,
  BinaryFiles,
} from '@excalidraw/excalidraw/types'

import { jsPDF } from 'jspdf'

import { SLIDE_CONFIG } from '../config/slideConfig'

import type { Slide } from '../types/slide'

const PDF_WIDTH =
  SLIDE_CONFIG.width

const PDF_HEIGHT =
  SLIDE_CONFIG.height

const EXPORT_MARGIN = 100

function createBlankSlideCanvas(
  backgroundColor: string,
): HTMLCanvasElement {
  const canvas =
    document.createElement('canvas')

  canvas.width = PDF_WIDTH
  canvas.height = PDF_HEIGHT

  const context =
    canvas.getContext('2d')

  if (!context) {
    throw new Error(
      'Unable to create slide canvas.',
    )
  }

  context.fillStyle =
    backgroundColor

  context.fillRect(
    0,
    0,
    PDF_WIDTH,
    PDF_HEIGHT,
  )

  return canvas
}

async function renderSlide(
  slide: Slide,
  appState: AppState,
  files: BinaryFiles,
): Promise<HTMLCanvasElement> {
  const elements =
    slide.elements.filter(
      (element) =>
        !element.isDeleted,
    )

  const backgroundColor =
    appState.viewBackgroundColor ??
    '#ffffff'

  if (elements.length === 0) {
    return createBlankSlideCanvas(
      backgroundColor,
    )
  }

  /*
   * Export only the actual Excalidraw
   * content first.
   */
  const contentCanvas =
    await exportToCanvas({
      elements,

      appState: {
        ...appState,

        exportBackground:
          false,

        exportWithDarkMode:
          false,

        viewBackgroundColor:
          backgroundColor,
      },

      files,

      /*
       * Give Excalidraw a small amount of
       * breathing room around the content.
       */
      exportPadding:
        EXPORT_MARGIN,
    })

  /*
   * Create the fixed 16:9 slide.
   */
  const slideCanvas =
    createBlankSlideCanvas(
      backgroundColor,
    )

  const context =
    slideCanvas.getContext('2d')

  if (!context) {
    throw new Error(
      'Unable to create slide canvas.',
    )
  }

  const contentWidth =
    contentCanvas.width

  const contentHeight =
    contentCanvas.height

  if (
    contentWidth <= 0 ||
    contentHeight <= 0
  ) {
    return slideCanvas
  }

  /*
   * Available area inside the slide.
   */
  const availableWidth =
    PDF_WIDTH -
    EXPORT_MARGIN * 2

  const availableHeight =
    PDF_HEIGHT -
    EXPORT_MARGIN * 2

  /*
   * Scale content proportionally so
   * nothing gets cropped.
   */
  const scale =
    Math.min(
      availableWidth / contentWidth,
      availableHeight / contentHeight,
      1,
    )

  const renderedWidth =
    contentWidth * scale

  const renderedHeight =
    contentHeight * scale

  /*
   * Center the exported content.
   */
  const offsetX =
    (PDF_WIDTH - renderedWidth) / 2

  const offsetY =
    (PDF_HEIGHT - renderedHeight) / 2

  context.imageSmoothingEnabled =
    true

  context.imageSmoothingQuality =
    'high'

  context.drawImage(
    contentCanvas,
    offsetX,
    offsetY,
    renderedWidth,
    renderedHeight,
  )

  return slideCanvas
}

function downloadBlob(
  blob: Blob,
  filename: string,
) {
  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url

  link.download = filename

  document.body.appendChild(link)

  link.click()

  link.remove()

  URL.revokeObjectURL(url)
}

export async function downloadSlidesAsPdf(
  slides: Slide[],
  appState: AppState,
  files: BinaryFiles,
  filename = 'teachstudio-slides.pdf',
): Promise<void> {
  if (slides.length === 0) {
    return
  }

  const pdf =
    new jsPDF({
      orientation: 'landscape',

      unit: 'px',

      format: [
        PDF_WIDTH,
        PDF_HEIGHT,
      ],

      compress: true,
    })

  for (
    let index = 0;
    index < slides.length;
    index += 1
  ) {
    const slide =
      slides[index]

    const canvas =
      await renderSlide(
        slide,
        appState,
        files,
      )

    const imageData =
      canvas.toDataURL(
        'image/png',
        1,
      )

    if (index > 0) {
      pdf.addPage([
        PDF_WIDTH,
        PDF_HEIGHT,
      ])
    }

    pdf.addImage(
      imageData,
      'PNG',
      0,
      0,
      PDF_WIDTH,
      PDF_HEIGHT,
      undefined,
      'FAST',
    )
  }

  const blob =
    pdf.output('blob')

  downloadBlob(
    blob,
    filename,
  )
}