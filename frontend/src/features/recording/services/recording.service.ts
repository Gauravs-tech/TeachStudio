import type { RecordingResult } from '../types/recording'

interface SaveFilePickerOptions {
  suggestedName?: string

  types?: Array<{
    description: string

    accept: Record<
      string,
      string[]
    >
  }>
}

interface FileSystemFileHandle {
  createWritable: () => Promise<{
    write: (
      data: Blob,
    ) => Promise<void>

    close: () => Promise<void>
  }>
}

interface SaveFilePickerWindow
  extends Window {
  showSaveFilePicker?: (
    options?: SaveFilePickerOptions,
  ) => Promise<FileSystemFileHandle>
}

export async function saveRecording(
  recording: RecordingResult,
): Promise<void> {
  const filename =
    'teachstudio-recording.webm'

  const pickerWindow =
    window as SaveFilePickerWindow

  /*
   * Preferred method:
   *
   * Open the native Save As dialog.
   */
  if (
    typeof pickerWindow.showSaveFilePicker ===
    'function'
  ) {
    const fileHandle =
      await pickerWindow.showSaveFilePicker({
        suggestedName: filename,

        types: [
          {
            description:
              'TeachStudio Recording',

            accept: {
              'video/webm': [
                '.webm',
              ],
            },
          },
        ],
      })

    const writable =
      await fileHandle.createWritable()

    try {
      await writable.write(
        recording.blob,
      )
    } finally {
      await writable.close()
    }

    return
  }

  /*
   * Fallback for browsers that do not
   * support the File System Access API.
   */
  const url =
    URL.createObjectURL(
      recording.blob,
    )

  const link =
    document.createElement('a')

  link.href = url

  link.download = filename

  document.body.appendChild(link)

  link.click()

  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}