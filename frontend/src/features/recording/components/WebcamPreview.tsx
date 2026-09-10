import {
  useEffect,
  useRef,
  useState,
} from 'react'

interface WebcamPreviewProps {
  isVisible: boolean
}

interface Position {
  x: number
  y: number
}

const WEBCAM_SIZE = 192
const EDGE_PADDING = 16

function WebcamPreview({
  isVisible,
}: WebcamPreviewProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const webcamRef =
    useRef<HTMLDivElement | null>(null)

  const dragRef = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  })

  const [error, setError] =
    useState<string | null>(null)

  const [position, setPosition] =
    useState<Position>({
      x:
        typeof window !== 'undefined'
          ? window.innerWidth -
            WEBCAM_SIZE -
            EDGE_PADDING
          : EDGE_PADDING,

      y:
        typeof window !== 'undefined'
          ? window.innerHeight -
            WEBCAM_SIZE -
            EDGE_PADDING
          : EDGE_PADDING,
    })

  const [isDragging, setIsDragging] =
    useState(false)

  const [isFullscreen, setIsFullscreen] =
    useState(false)

  /*
   * Start webcam.
   */
  useEffect(() => {
    if (!isVisible) {
      return
    }

    let isMounted = true

    const startCamera = async () => {
      try {
        setError(null)

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })

        if (!isMounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop())

          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (cameraError) {
        console.error(
          'Failed to access webcam:',
          cameraError,
        )

        if (isMounted) {
          setError(
            'Unable to access the camera.',
          )
        }
      }
    }

    startCamera()

    return () => {
      isMounted = false

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop())

      streamRef.current = null

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [isVisible])

  /*
   * Keep webcam inside the viewport
   * when browser window is resized.
   */
  useEffect(() => {
    if (!isVisible) {
      return
    }

    const handleResize = () => {
      setPosition((current) => {
        const maxX =
          window.innerWidth -
          WEBCAM_SIZE -
          EDGE_PADDING

        const maxY =
          window.innerHeight -
          WEBCAM_SIZE -
          EDGE_PADDING

        return {
          x: Math.min(
            Math.max(
              current.x,
              EDGE_PADDING,
            ),
            Math.max(
              maxX,
              EDGE_PADDING,
            ),
          ),

          y: Math.min(
            Math.max(
              current.y,
              EDGE_PADDING,
            ),
            Math.max(
              maxY,
              EDGE_PADDING,
            ),
          ),
        }
      })
    }

    window.addEventListener(
      'resize',
      handleResize,
    )

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [isVisible])

  /*
   * Handle webcam dragging.
   */
  useEffect(() => {
    if (!isVisible) {
      return
    }

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (
        !dragRef.current.isDragging ||
        isFullscreen
      ) {
        return
      }

      const maxX =
        window.innerWidth -
        WEBCAM_SIZE -
        EDGE_PADDING

      const maxY =
        window.innerHeight -
        WEBCAM_SIZE -
        EDGE_PADDING

      const nextX =
        event.clientX -
        dragRef.current.offsetX

      const nextY =
        event.clientY -
        dragRef.current.offsetY

      setPosition({
        x: Math.min(
          Math.max(
            nextX,
            EDGE_PADDING,
          ),
          Math.max(
            maxX,
            EDGE_PADDING,
          ),
        ),

        y: Math.min(
          Math.max(
            nextY,
            EDGE_PADDING,
          ),
          Math.max(
            maxY,
            EDGE_PADDING,
          ),
        ),
      })
    }

    const handlePointerUp = () => {
      if (!dragRef.current.isDragging) {
        return
      }

      dragRef.current.isDragging = false

      setIsDragging(false)
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    window.addEventListener(
      'pointerup',
      handlePointerUp,
    )

    window.addEventListener(
      'pointercancel',
      handlePointerUp,
    )

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      )

      window.removeEventListener(
        'pointerup',
        handlePointerUp,
      )

      window.removeEventListener(
        'pointercancel',
        handlePointerUp,
      )
    }
  }, [isVisible, isFullscreen])

  /*
   * Track browser fullscreen state.
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ===
          videoRef.current,
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
   * Start dragging.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (isFullscreen) {
      return
    }

    const element =
      webcamRef.current

    if (!element) {
      return
    }

    const rect =
      element.getBoundingClientRect()

    dragRef.current = {
      isDragging: true,

      offsetX:
        event.clientX - rect.left,

      offsetY:
        event.clientY - rect.top,
    }

    setIsDragging(true)
  }

  /*
   * Open actual video element in fullscreen.
   */
  const enterFullscreen = async () => {
    const video =
      videoRef.current

    if (!video) {
      return
    }

    try {
      if (
        document.fullscreenElement
      ) {
        return
      }

      await video.requestFullscreen()
    } catch (fullscreenError) {
      console.error(
        'Failed to enter webcam fullscreen:',
        fullscreenError,
      )
    }
  }

  /*
   * Exit fullscreen.
   */
  const exitFullscreen = async () => {
    try {
      if (
        document.fullscreenElement
      ) {
        await document.exitFullscreen()
      }
    } catch (fullscreenError) {
      console.error(
        'Failed to exit webcam fullscreen:',
        fullscreenError,
      )
    }
  }

  /*
   * Double-click webcam to fullscreen.
   */
  const handleDoubleClick = async () => {
    if (isDragging) {
      return
    }

    if (isFullscreen) {
      await exitFullscreen()
      return
    }

    await enterFullscreen()
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={webcamRef}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={[
        'group fixed z-[1100]',
  'touch-none select-none',
        isDragging
          ? 'cursor-grabbing'
          : 'cursor-grab',
      ].join(' ')}
      style={{
        left: position.x,
        top: position.y,
      }}
      title="Drag to move • Double-click for fullscreen"
    >
      <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-gray-900 shadow-xl">
        {error ? (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-[10px] leading-tight text-white">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{
              transform: 'scaleX(-1)',
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10" />

        {!isFullscreen && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
            Double-click
          </div>
        )}
      </div>
    </div>
  )
}

export default WebcamPreview