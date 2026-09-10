import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CreateLessonModal from '../../components/common/CreateLessonModal'
import { useLessonStore } from '../../stores/lesson.store'

function Dashboard() {
  const navigate = useNavigate()

  const lessons = useLessonStore((state) => state.lessons)
  const loadLessons = useLessonStore((state) => state.loadLessons)
  const addLesson = useLessonStore((state) => state.addLesson)

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false)

  useEffect(() => {
    loadLessons()
  }, [loadLessons])

  const publishedLessons = lessons.filter(
    (lesson) => lesson.status === 'PUBLISHED',
  )

  const draftLessons = lessons.filter(
    (lesson) => lesson.status === 'DRAFT',
  )

const handleCreateLesson = (
  title: string,
  description: string,
) => {
  const lesson = addLesson(title, description)

  navigate(`/lesson/${lesson.id}`)
}

  return (
    <>
      <div className="space-y-8">
        {/* Welcome */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Teacher 👋
            </h1>

            <p className="mt-2 text-gray-600">
              Create engaging lessons and turn your ideas into
              teaching content.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-fit rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + New Lesson
          </button>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Lessons
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {lessons.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {publishedLessons.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">
              Drafts
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {draftLessons.length}
            </p>
          </div>
        </section>

        {/* Recent Lessons */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Lessons
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue working on your latest lessons.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900">
                    {lesson.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      lesson.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                  {lesson.description ||
                    'No description provided.'}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/lesson/${lesson.id}`)
                  }
                  className="mt-5 text-sm font-medium text-gray-900 hover:underline"
                >
                  Open Lesson →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-gray-300 hover:shadow-sm"
            >
              <p className="font-semibold text-gray-900">
                Create a Lesson
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Start with a blank teaching workspace.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/recordings')}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-gray-300 hover:shadow-sm"
            >
              <p className="font-semibold text-gray-900">
                Start Recording
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Record your screen, whiteboard and voice.
              </p>
            </button>
          </div>
        </section>
      </div>

      <CreateLessonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLesson}
      />
    </>
  )
}

export default Dashboard