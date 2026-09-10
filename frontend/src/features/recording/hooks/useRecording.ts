import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  RecordingResult,
  RecordingStatus,
} from '../types/recording'

interface UseRecordingResult {
  status: RecordingStatus
  duration: number
  recording: RecordingResult | null
  error: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  resetRecording: () => void
}

function getSupportedMimeType(): string {
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ]

  return (
    mimeTypes.find((mimeType) =>
      MediaRecorder.isTypeSupported(
        mimeType,
      ),
    ) ?? ''
  )
}

function useRecording(): UseRecordingResult {
  const [status, setStatus] =
    useState<RecordingStatus>('idle')

  const [duration, setDuration] =
    useState(0)

  const [recording, setRecording] =
    useState<RecordingResult | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const recorderRef =
    useRef<MediaRecorder | null>(null)

  const streamRef =
    useRef<MediaStream | null>(null)

  const chunksRef =
    useRef<Blob[]>([])

  const startedAtRef =
    useRef<number | null>(null)

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    )

  const stopTracks = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop())

    streamRef.current = null
  }, [])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    startedAtRef.current = Date.now()

    setDuration(0)

    timerRef.current = setInterval(() => {
      if (!startedAtRef.current) {
        return
      }

      const elapsed =
        Date.now() - startedAtRef.current

      setDuration(
        Math.floor(elapsed / 1000),
      )
    }, 250)
  }, [])

  const startRecording =
    useCallback(async () => {
      try {
        setError(null)
        setRecording(null)
        setDuration(0)

        setStatus(
          'requesting-permission',
        )

        const displayStream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
              audio: true,
            },
          )

        const microphoneStream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: false,
              audio: true,
            },
          )

        const displayAudioTracks =
          displayStream.getAudioTracks()

        const microphoneAudioTracks =
          microphoneStream.getAudioTracks()

        const videoTracks =
          displayStream.getVideoTracks()

        const combinedStream =
          new MediaStream([
            ...videoTracks,
            ...displayAudioTracks,
            ...microphoneAudioTracks,
          ])

        streamRef.current =
          combinedStream

        const mimeType =
          getSupportedMimeType()

        const recorder =
          mimeType
            ? new MediaRecorder(
                combinedStream,
                { mimeType },
              )
            : new MediaRecorder(
                combinedStream,
              )

        chunksRef.current = []

        recorder.ondataavailable = (
          event,
        ) => {
          if (event.data.size > 0) {
            chunksRef.current.push(
              event.data,
            )
          }
        }

        recorder.onstop = () => {
          clearTimer()

          const blob = new Blob(
            chunksRef.current,
            {
              type:
                recorder.mimeType ||
                'video/webm',
            },
          )

          const url =
            URL.createObjectURL(blob)

          const recordingDuration =
            startedAtRef.current
              ? Math.floor(
                  (Date.now() -
                    startedAtRef.current) /
                    1000,
                )
              : 0

          setDuration(
            recordingDuration,
          )

          setRecording({
            blob,
            url,
            duration:
              recordingDuration,
          })

          stopTracks()

          startedAtRef.current = null

          setStatus('stopped')
        }

        recorder.onerror = () => {
          clearTimer()
          stopTracks()

          setError(
            'Recording failed. Please try again.',
          )

          setStatus('error')
        }

        const displayVideoTrack =
          displayStream.getVideoTracks()[0]

        if (displayVideoTrack) {
          displayVideoTrack.onended =
            () => {
              if (
                recorderRef.current
                  ?.state === 'recording'
              ) {
                recorderRef.current.stop()
              }
            }
        }

        recorderRef.current = recorder

        recorder.start(1000)

        setStatus('recording')

        startTimer()
      } catch (recordingError) {
        console.error(
          'Failed to start recording:',
          recordingError,
        )

        stopTracks()
        clearTimer()

        setStatus('error')

        if (
          recordingError instanceof
          DOMException
        ) {
          if (
            recordingError.name ===
            'NotAllowedError'
          ) {
            setError(
              'Screen, microphone, or camera permission was denied.',
            )
          } else {
            setError(
              'Unable to start recording.',
            )
          }
        } else {
          setError(
            'Unable to start recording.',
          )
        }
      }
    }, [
      clearTimer,
      startTimer,
      stopTracks,
    ])

  const stopRecording =
    useCallback(() => {
      const recorder =
        recorderRef.current

      if (
        !recorder ||
        recorder.state !== 'recording'
      ) {
        return
      }

      recorder.stop()
    }, [])

  const resetRecording =
    useCallback(() => {
      clearTimer()
      stopTracks()

      if (recording?.url) {
        URL.revokeObjectURL(
          recording.url,
        )
      }

      recorderRef.current = null
      chunksRef.current = []
      startedAtRef.current = null

      setRecording(null)
      setDuration(0)
      setError(null)
      setStatus('idle')
    }, [
      clearTimer,
      recording,
      stopTracks,
    ])

  useEffect(() => {
    return () => {
      clearTimer()
      stopTracks()

      if (recording?.url) {
        URL.revokeObjectURL(
          recording.url,
        )
      }
    }
  }, [
    clearTimer,
    recording,
    stopTracks,
  ])

  return {
    status,
    duration,
    recording,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  }
}

export default useRecording