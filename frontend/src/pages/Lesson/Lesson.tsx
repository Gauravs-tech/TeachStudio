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

import Whiteboard from '../../features/lessons/components/Whiteboard'

import { BOARD_THEMES } from '../../features/lessons/config/boardThemes'
import { useBoardStore } from '../../features/lessons/stores/board.store'

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

  const boardTheme = useBoardStore(
    (state) => state.theme,
  )

  const setBoardTheme = useBoardStore(
    (state) => state.setTheme,
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
      <div className="flex min-h-[70vh] items-center justify-center border border-[#2A2F3A] bg-[#0B0D12]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Lesson not found
          </h1>

          <p className="mt-2 text-sm text-[#94A3B8]">
            The lesson you're looking for
            doesn't exist.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
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
      className={`flex min-h-0 flex-col overflow-hidden bg-[#0B0D12] ${
        isFullscreen
          ? 'h-screen'
          : 'h-full'
      }`}
    >
      {/* Workspace Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2A2F3A] bg-[#313132] px-5">
        {/* Left Side */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#171B24] hover:text-white"
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
            <h1 className="truncate text-sm font-semibold text-[#F8FAFC] sm:text-base">
              {lesson.title}
            </h1>

            <p className="text-xs text-[#94A3B8]">
              Teaching Workspace
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Save Status */}
          <div className="hidden items-center gap-2 sm:flex">
            {saveStatus === 'saved' && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

                <span className="text-xs font-medium text-[#94A3B8]">
                  Saved
                </span>
              </>
            )}

            {saveStatus === 'unsaved' && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]" />

                <span className="text-xs font-medium text-[#CBD5E1]">
                  Unsaved changes
                </span>
              </>
            )}

            {saveStatus === 'saving' && (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" />

                <span className="text-xs font-medium text-[#94A3B8]">
                  Saving...
                </span>
              </>
            )}
          </div>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={handleFullscreen}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#2A2F3A] bg-[#171B24] px-3 text-sm font-medium text-[#CBD5E1] transition hover:border-[#8B5CF6]/60 hover:bg-[#1D2330] hover:text-white"
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
            disabled={
              saveStatus === 'saving'
            }
            className="h-9 rounded-lg border border-[#2A2F3A] bg-[#171B24] px-4 text-sm font-semibold text-[#CBD5E1] transition hover:border-[#8B5CF6]/60 hover:bg-[#1D2330] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Board Theme Bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#2A2F3A] bg-[#11151D] px-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
          Board
        </span>

        <div className="flex items-center gap-2">
          {Object.values(
            BOARD_THEMES,
          ).map((theme) => {
            const isActive =
              boardTheme === theme.id

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() =>
                  setBoardTheme(theme.id)
                }
                className={[
                  'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'border-[#A855F7] bg-[#6D28D9]/25 text-white shadow-[0_0_14px_rgba(139,92,246,0.18)]'
                    : 'border-[#2A2F3A] bg-[#171B24] text-[#94A3B8] hover:border-[#8B5CF6]/50 hover:bg-[#1D2330] hover:text-[#F8FAFC]',
                ].join(' ')}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full border ${theme.previewClass}`}
                />

                {theme.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Teaching Workspace */}
      <div className="relative min-h-0 flex-1 bg-[#0B0D12]">
        <Whiteboard
          onBoardChange={
            handleBoardChange
          }
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