import {
  useState,
} from 'react'

import type {
  RecordingResult,
} from '../types/recording'

import {
  saveRecording,
} from '../services/recording.service'

interface RecordingPreviewProps {
  recording: RecordingResult

  onDiscard: () => void

  onSave: () => void
}

function formatDuration(
  totalSeconds: number,
) {
  const hours = Math.floor(
    totalSeconds / 3600,
  )

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  )

  const seconds =
    totalSeconds % 60

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        '0',
      ),
    )
    .join(':')
}

function RecordingPreview({
  recording,
  onDiscard,
  onSave,
}: RecordingPreviewProps) {
  const [
    isSaving,
    setIsSaving,
  ] = useState(false)

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null,
  )

  const handleSave = async () => {
    if (isSaving) {
      return
    }

    try {
      setSaveError(null)

      setIsSaving(true)

      await saveRecording(
        recording,
      )

      /*
       * Tell the parent that the
       * recording has been saved.
       */
      onSave()
    } catch (error) {
      /*
       * User cancelling the native
       * Save As dialog throws an
       * AbortError.
       *
       * This is not a real error.
       */
      if (
        error instanceof
          DOMException &&
        error.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Failed to save recording:',
        error,
      )

      setSaveError(
        'Unable to save the recording. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Recording Preview
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Review your teaching session
              before saving it.
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs font-medium text-gray-600">
            {formatDuration(
              recording.duration,
            )}
          </div>
        </div>

        {/* Video */}
        <div className="bg-black">
          <video
            src={recording.url}
            controls
            playsInline
            className="mx-auto max-h-[65vh] w-full object-contain"
          />
        </div>

        {/* Save error */}
        {saveError && (
          <div className="border-t border-red-100 bg-red-50 px-5 py-3">
            <p className="text-sm text-red-600">
              {saveError}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? 'Saving...'
              : 'Save Recording'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecordingPreview