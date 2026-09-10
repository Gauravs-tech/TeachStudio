import type { RecordingStatus } from '../types/recording'

interface RecordingControlsProps {
  status: RecordingStatus
  duration: number
  error: string | null
  onStart: () => void
  onStop: () => void
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

  const seconds = totalSeconds % 60

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(2, '0'),
    )
    .join(':')
}

function RecordingControls({
  status,
  duration,
  error,
  onStart,
  onStop,
}: RecordingControlsProps) {
  const isRecording =
    status === 'recording'

  const isRequesting =
    status ===
    'requesting-permission'

  return (
    <div className="flex items-center gap-3">
      {isRecording && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

          <span className="font-mono text-sm font-medium text-red-700">
            {formatDuration(duration)}
          </span>
        </div>
      )}

      {error && (
        <span className="max-w-xs text-xs text-red-600">
          {error}
        </span>
      )}

      {!isRecording && (
        <button
          type="button"
          onClick={onStart}
          disabled={isRequesting}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

          {isRequesting
            ? 'Preparing...'
            : 'Record'}
        </button>
      )}

      {isRecording && (
        <button
          type="button"
          onClick={onStop}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          <span className="h-3 w-3 rounded-sm bg-white" />

          Stop
        </button>
      )}
    </div>
  )
}

export default RecordingControls