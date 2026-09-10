import {
  useState,
} from 'react'

import type {
  AppState,
  BinaryFiles,
} from '@excalidraw/excalidraw/types'

import { useSlideStore } from '../stores/slide.store'

import {
  downloadSlidesAsPdf,
} from '../services/slideExport.service'

interface DownloadSlidesButtonProps {
  appState: AppState | null

  files: BinaryFiles
}

function DownloadSlidesButton({
  appState,
  files,
}: DownloadSlidesButtonProps) {
  const slides =
    useSlideStore(
      (state) => state.slides,
    )

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false)

  const handleDownload =
    async () => {
      if (
        !appState ||
        isDownloading ||
        slides.length === 0
      ) {
        return
      }

      try {
        setIsDownloading(true)

        await downloadSlidesAsPdf(
          slides,
          appState,
          files,
          'teachstudio-slides.pdf',
        )
      } catch (error) {
        console.error(
          'Failed to download slides:',
          error,
        )
      } finally {
        setIsDownloading(false)
      }
    }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={
        isDownloading ||
        !appState ||
        slides.length === 0
      }
      className="rounded-lg border border-[#2A2F3A] bg-[#171B24] px-4 py-2 text-sm font-medium text-[#CBD5E1] transition hover:border-[#6D28D9] hover:bg-[#2A2F3A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDownloading
        ? 'Downloading...'
        : 'Download Slides'}
    </button>
  )
}

export default DownloadSlidesButton