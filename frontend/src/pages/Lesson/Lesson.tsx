import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useLessonStore } from '../../stores/lesson.store'

import TldrawWorkspace from '../../features/lessons/components/TldrawWorkspace'
import WebcamPreview from '../../features/recording/components/WebcamPreview'

import useRecording from '../../features/recording/hooks/useRecording'
import RecordingControls from '../../features/recording/components/RecordingControls'

import RecordingPreview from '../../features/recording/components/RecordingPreview'

type SaveStatus =
  | 'saved'
  | 'unsaved'
  | 'saving'

  
function FullscreenIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 3H3V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 3H21V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 21H3V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M16 21H21V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExitFullscreenIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 3V9H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 3V9H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 21V15H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 21V15H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const lessons = useLessonStore(
    (state) => state.lessons,
  )

  const loadLessons = useLessonStore(
    (state) => state.loadLessons,
  )

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>('saved')

  const [isFullscreen, setIsFullscreen] =
    useState(false)

   const {
  status: recordingStatus,
  duration: recordingDuration,
  recording,
  error: recordingError,
  startRecording,
  stopRecording,
  resetRecording,
} = useRecording()

  /*
   * Load lessons when the store is empty.
   */
  useEffect(() => {
    if (lessons.length === 0) {
      loadLessons()
    }
  }, [lessons.length, loadLessons])

  /*
   * Keep fullscreen state synchronized
   * with the browser fullscreen API.
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement !== null,
      )
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange,
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      )
    }
  }, [])

  /*
   * Find the current lesson.
   */
  const lesson = lessons.find(
    (item) => item.id === lessonId,
  )

  /*
   * Board changes mark the lesson as unsaved.
   */
  const handleBoardChange = useCallback(() => {
    setSaveStatus('unsaved')
  }, [])

  /*
   * Save lesson.
   *
   * This is currently simulated.
   * Real persistence will be connected later.
   */
  const handleSave = useCallback(() => {
    setSaveStatus('saving')

    setTimeout(() => {
      setSaveStatus('saved')
    }, 500)
  }, [])

  /*
   * Toggle browser fullscreen mode.
   */
  const handleFullscreen = useCallback(
    async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
          return
        }

        const workspace =
          document.getElementById(
            'teachstudio-lesson-workspace',
          )

        if (!workspace) {
          return
        }

        await workspace.requestFullscreen()
      } catch (error) {
        console.error(
          'Failed to toggle fullscreen mode:',
          error,
        )
      }
    },
    [],
  )

  /*
   * TeachStudio-level keyboard shortcuts.
   *
   * Ctrl/Cmd + S
   * Ctrl/Cmd + Shift + F
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const isModifierPressed =
        event.ctrlKey || event.metaKey

      if (!isModifierPressed) {
        return
      }

      /*
       * Ctrl/Cmd + S → Save
       */
      if (
        event.key.toLowerCase() === 's'
      ) {
        event.preventDefault()

        handleSave()
        return
      }

      /*
       * Ctrl/Cmd + Shift + F
       * → Toggle fullscreen
       */
      if (
        event.shiftKey &&
        event.key.toLowerCase() === 'f'
      ) {
        event.preventDefault()

        void handleFullscreen()
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
  }, [handleSave, handleFullscreen])

  /*
   * Hooks are complete above this point.
   * Conditional rendering is safe here.
   */
  if (!lesson) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Lesson not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The lesson you're looking for
            doesn't exist.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
  id="teachstudio-lesson-workspace"
  className={`flex min-h-0 flex-col bg-white ${
    isFullscreen
      ? 'h-screen'
      : 'h-full'
  }`}
>
      {/* Workspace Header */}
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
  {/* Left Side */}
  <div className="flex min-w-0 items-center gap-3">
    <button
      type="button"
      onClick={() => navigate('/')}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      aria-label="Back to dashboard"
      title="Back to dashboard"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    <div className="min-w-0">
      <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
        {lesson.title}
      </h1>

      <p className="text-xs text-gray-500">
        Teaching Workspace
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex shrink-0 items-center gap-3">
    {/* Save Status */}
    <div className="hidden items-center gap-2 sm:flex">
      {saveStatus === 'saved' && (
        <>
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="text-xs font-medium text-gray-500">
            Saved
          </span>
        </>
      )}

      {saveStatus === 'unsaved' && (
        <>
          <span className="h-2 w-2 rounded-full bg-amber-500" />

          <span className="text-xs font-medium text-gray-500">
            Unsaved changes
          </span>
        </>
      )}

      {saveStatus === 'saving' && (
        <>
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

          <span className="text-xs font-medium text-gray-500">
            Saving...
          </span>
        </>
      )}
    </div>

    {/* Fullscreen */}
    <button
      type="button"
      onClick={handleFullscreen}
      className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
      title={
        isFullscreen
          ? 'Exit fullscreen'
          : 'Enter fullscreen'
      }
    >
      {isFullscreen ? (
        <ExitFullscreenIcon />
      ) : (
        <FullscreenIcon />
      )}

      <span className="hidden md:inline">
        {isFullscreen
          ? 'Exit'
          : 'Fullscreen'}
      </span>
    </button>

    {/* Save */}
    <button
      type="button"
      onClick={handleSave}
      disabled={saveStatus === 'saving'}
      className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saveStatus === 'saving'
        ? 'Saving...'
        : 'Save'}
    </button>

    {/* Record */}
    <RecordingControls
  status={recordingStatus}
  duration={recordingDuration}
  error={recordingError}
  onStart={startRecording}
  onStop={stopRecording}
/>
  </div>
</header>

      {/* Workspace */}
     <div className="relative flex min-h-0 flex-1">
  <TldrawWorkspace
    onBoardChange={handleBoardChange}
  />

  <WebcamPreview
    isVisible={true}
  />

  {recording && (
    <RecordingPreview
      recording={recording}
      onDiscard={resetRecording}
      onSave={() => {
        console.log(
          'Recording ready to be saved:',
          recording,
        )
      }}
    />
  )}
</div>
    </div>
  )
}

export default Lesson