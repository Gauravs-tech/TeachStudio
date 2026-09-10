export type RecordingStatus =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'stopped'
  | 'error'

export interface RecordingResult {
  blob: Blob
  url: string
  duration: number
}