import { useEffect, useRef, useState } from 'react'

interface WebcamPreviewProps {
  isVisible: boolean
}

function WebcamPreview({
  isVisible,
}: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(
    null,
  )

  const streamRef =
    useRef<MediaStream | null>(null)

  const [error, setError] = useState<string | null>(
    null,
  )

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

  if (!isVisible) {
    return null
  }

  return (
    <div className="absolute bottom-6 right-6 z-[1100]">
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
      </div>
    </div>
  )
}

export default WebcamPreview