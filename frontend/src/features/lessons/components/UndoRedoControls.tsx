import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  CaptureUpdateAction,
  type ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

interface UndoRedoControlsProps {
  api: ExcalidrawImperativeAPI | null
}

interface SceneSnapshot {
  elements: ReturnType<
    ExcalidrawImperativeAPI['getSceneElements']
  >
}

function UndoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 7L4 12L9 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 12H14C17.3 12 20 14.7 20 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RedoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 7L20 12L15 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M20 12H10C6.7 12 4 14.7 4 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function UndoRedoControls({
  api,
}: UndoRedoControlsProps) {
  /*
   * We keep the actual history in refs.
   *
   * React state is only used for rendering the
   * enabled/disabled state of the buttons.
   */
  const undoStackRef =
    useRef<SceneSnapshot[]>([])

  const redoStackRef =
    useRef<SceneSnapshot[]>([])

  /*
   * This MUST be a ref instead of React state.
   *
   * updateScene() can immediately trigger onChange(),
   * while React state updates are asynchronous.
   */
  const isRestoringRef =
    useRef(false)

  /*
   * Tracks whether the user is currently performing
   * a pointer interaction on the canvas.
   *
   * One complete pointer interaction becomes
   * one undo step.
   */
  const isPointerInteractionRef =
    useRef(false)

  /*
   * Stores the scene before a pointer interaction.
   */
  const pointerStartSnapshotRef =
    useRef<SceneSnapshot | null>(null)

  /*
   * Used for keyboard/programmatic changes that don't
   * have pointer down/up events.
   */
  const pendingCommitTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

  const lastSnapshotKeyRef =
    useRef('')

  const [
    undoCount,
    setUndoCount,
  ] = useState(0)

  const [
    redoCount,
    setRedoCount,
  ] = useState(0)

  /*
   * Create a snapshot of the current canvas.
   */
  const createSnapshot = (): SceneSnapshot => {
    if (!api) {
      return {
        elements: [],
      }
    }

    return {
      elements: structuredClone(
        api.getSceneElements(),
      ),
    }
  }

  /*
   * Generate a lightweight key so identical scenes
   * are not added repeatedly to history.
   */
  const getSnapshotKey = (
    snapshot: SceneSnapshot,
  ) => {
    return JSON.stringify(
      snapshot.elements,
    )
  }

  /*
   * Commit a scene to the undo history.
   */
  const commitSnapshot = (
    snapshot: SceneSnapshot,
    clearRedo = true,
  ) => {
    const snapshotKey =
      getSnapshotKey(snapshot)

    /*
     * Don't add duplicate snapshots.
     */
    if (
      snapshotKey ===
      lastSnapshotKeyRef.current
    ) {
      return
    }

    undoStackRef.current.push(
      snapshot,
    )

    lastSnapshotKeyRef.current =
      snapshotKey

    if (clearRedo) {
      redoStackRef.current = []
    }

    setUndoCount(
      undoStackRef.current.length,
    )

    setRedoCount(
      redoStackRef.current.length,
    )
  }

  /*
   * Initialize history when the Excalidraw API
   * becomes available.
   */
  useEffect(() => {
    if (!api) {
      return
    }

    /*
     * Start with an empty canvas snapshot.
     *
     * This is important because it allows:
     *
     * Draw → Undo → Empty canvas
     */
    const initialSnapshot: SceneSnapshot = {
      elements: structuredClone(
        api.getSceneElements(),
      ),
    }

    undoStackRef.current = [
      initialSnapshot,
    ]

    redoStackRef.current = []

    lastSnapshotKeyRef.current =
      getSnapshotKey(initialSnapshot)

    setUndoCount(1)
    setRedoCount(0)

    /*
     * --------------------------------------------------
     * POINTER DOWN
     * --------------------------------------------------
     */
    const unsubscribePointerDown =
      api.onPointerDown(() => {
        if (isRestoringRef.current) {
          return
        }

        isPointerInteractionRef.current =
          true

        pointerStartSnapshotRef.current =
          createSnapshot()

        /*
         * Cancel any pending keyboard/programmatic
         * history commit.
         */
        if (
          pendingCommitTimerRef.current
        ) {
          clearTimeout(
            pendingCommitTimerRef.current,
          )

          pendingCommitTimerRef.current =
            null
        }
      })

    /*
     * --------------------------------------------------
     * POINTER UP
     * --------------------------------------------------
     */
    const unsubscribePointerUp =
      api.onPointerUp(() => {
        if (isRestoringRef.current) {
          return
        }

        if (
          !isPointerInteractionRef.current
        ) {
          return
        }

        isPointerInteractionRef.current =
          false

        /*
         * Wait one tick so Excalidraw can finish
         * its final scene update.
         */
        setTimeout(() => {
          if (
            !api ||
            isRestoringRef.current
          ) {
            return
          }

          const snapshot =
            createSnapshot()

          commitSnapshot(snapshot)

          pointerStartSnapshotRef.current =
            null
        }, 0)
      })

    /*
     * --------------------------------------------------
     * SCENE CHANGE
     * --------------------------------------------------
     */
    const unsubscribeChange =
      api.onChange((elements) => {
        if (isRestoringRef.current) {
          return
        }

        /*
         * Pointer interactions are committed on
         * pointer up, not on every mouse movement.
         */
        if (
          isPointerInteractionRef.current
        ) {
          return
        }

        /*
         * Keyboard actions / programmatic changes
         * don't necessarily have pointer events.
         *
         * Debounce them so one logical action becomes
         * one history entry.
         */
        if (
          pendingCommitTimerRef.current
        ) {
          clearTimeout(
            pendingCommitTimerRef.current,
          )
        }

        pendingCommitTimerRef.current =
          setTimeout(() => {
            if (
              isRestoringRef.current ||
              !api
            ) {
              return
            }

            const snapshot: SceneSnapshot = {
              elements: structuredClone(
                elements,
              ),
            }

            commitSnapshot(snapshot)

            pendingCommitTimerRef.current =
              null
          }, 300)
      })

    return () => {
      unsubscribePointerDown()
      unsubscribePointerUp()
      unsubscribeChange()

      if (
        pendingCommitTimerRef.current
      ) {
        clearTimeout(
          pendingCommitTimerRef.current,
        )
      }
    }
  }, [api])

  /*
   * --------------------------------------------------
   * UNDO
   * --------------------------------------------------
   */
  const handleUndo = () => {
    if (
      !api ||
      undoStackRef.current.length <= 1
    ) {
      return
    }

    isRestoringRef.current = true

    /*
     * Current scene goes into redo.
     */
    const currentSnapshot =
      createSnapshot()

    /*
     * Remove current state from undo history.
     */
    const previousSnapshot =
      undoStackRef.current[
        undoStackRef.current.length - 2
      ]

    undoStackRef.current =
      undoStackRef.current.slice(
        0,
        -1,
      )

    /*
     * Save current state for redo.
     */
    redoStackRef.current.push(
      currentSnapshot,
    )

    /*
     * Restore previous scene.
     *
     * NEVER is important here because this is our
     * own history restoration. We don't want
     * Excalidraw to add this restoration to its
     * internal history as another change.
     */
    api.updateScene({
      elements:
        previousSnapshot.elements,
      captureUpdate:
        CaptureUpdateAction.NEVER,
    })

    lastSnapshotKeyRef.current =
      getSnapshotKey(
        previousSnapshot,
      )

    setUndoCount(
      undoStackRef.current.length,
    )

    setRedoCount(
      redoStackRef.current.length,
    )

    /*
     * Release the restoring lock after the scene
     * update has propagated.
     */
    setTimeout(() => {
      isRestoringRef.current = false
    }, 0)
  }

  /*
   * --------------------------------------------------
   * REDO
   * --------------------------------------------------
   */
  const handleRedo = () => {
    if (
      !api ||
      redoStackRef.current.length === 0
    ) {
      return
    }

    isRestoringRef.current = true

    /*
     * Current scene goes back into undo.
     */
    const currentSnapshot =
      createSnapshot()

    const nextSnapshot =
      redoStackRef.current[
        redoStackRef.current.length - 1
      ]

    redoStackRef.current =
      redoStackRef.current.slice(
        0,
        -1,
      )

    undoStackRef.current.push(
      currentSnapshot,
    )

    /*
     * Restore the redo scene.
     */
    api.updateScene({
      elements:
        nextSnapshot.elements,
      captureUpdate:
        CaptureUpdateAction.NEVER,
    })

    lastSnapshotKeyRef.current =
      getSnapshotKey(
        nextSnapshot,
      )

    setUndoCount(
      undoStackRef.current.length,
    )

    setRedoCount(
      redoStackRef.current.length,
    )

    setTimeout(() => {
      isRestoringRef.current = false
    }, 0)
  }

  const canUndo =
    undoCount > 1

  const canRedo =
    redoCount > 0

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white/95 p-1 shadow-md backdrop-blur-sm">
      <button
        type="button"
        title="Undo"
        aria-label="Undo"
        disabled={!canUndo}
        onClick={handleUndo}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          !canUndo
            ? 'cursor-not-allowed text-gray-300'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
        }`}
      >
        <UndoIcon />
      </button>

      <button
        type="button"
        title="Redo"
        aria-label="Redo"
        disabled={!canRedo}
        onClick={handleRedo}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          !canRedo
            ? 'cursor-not-allowed text-gray-300'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
        }`}
      >
        <RedoIcon />
      </button>
    </div>
  )
}

export default UndoRedoControls