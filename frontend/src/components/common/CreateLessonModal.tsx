import { useState } from 'react'

interface CreateLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (title: string, description: string) => void
}

function CreateLessonModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLessonModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      return
    }

    onCreate(trimmedTitle, trimmedDescription)

    setTitle('')
    setDescription('')
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Lesson
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Start a new teaching workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label
                htmlFor="lesson-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Lesson Title
              </label>

              <input
                id="lesson-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Introduction to Java"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="lesson-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="lesson-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="What will students learn?"
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLessonModal