import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CreateLessonModal from '../../components/common/CreateLessonModal'
import { useLessonStore } from '../../stores/lesson.store'

function Dashboard() {
  const navigate = useNavigate()

  const lessons = useLessonStore(
    (state) => state.lessons,
  )

  const loadLessons = useLessonStore(
    (state) => state.loadLessons,
  )

  const addLesson = useLessonStore(
    (state) => state.addLesson,
  )

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
    const lesson = addLesson(
      title,
      description,
    )

    navigate(`/lesson/${lesson.id}`)
  }

  return (
    <>
      <div className="space-y-8">
        {/* Welcome */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Welcome back, Teacher 👋
            </h1>

            <p className="mt-2 text-[#94A3B8]">
              Create engaging lessons and turn your ideas
              into teaching content.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsCreateModalOpen(true)
            }
            className="w-fit rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.18)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(139,92,246,0.28)]"
          >
            + New Lesson
          </button>
        </section>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Lessons */}
          <div className="rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-6 transition-all duration-200 hover:border-[#6D28D9]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  Total Lessons
                </p>

                <p className="mt-3 text-3xl font-bold text-[#F8FAFC]">
                  {lessons.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9]/20 text-[#A855F7]">
                📚
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-6 transition-all duration-200 hover:border-[#22C55E]/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  Published
                </p>

                <p className="mt-3 text-3xl font-bold text-[#F8FAFC]">
                  {publishedLessons.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                ✓
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-6 transition-all duration-200 hover:border-[#F59E0B]/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">
                  Drafts
                </p>

                <p className="mt-3 text-3xl font-bold text-[#F8FAFC]">
                  {draftLessons.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                ✎
              </div>
            </div>
          </div>
        </section>

        {/* Recent Lessons */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">
                Recent Lessons
              </h2>

              <p className="mt-1 text-sm text-[#94A3B8]">
                Continue working on your latest lessons.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="group rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B5CF6]/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-[#F8FAFC]">
                    {lesson.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      lesson.status ===
                      'PUBLISHED'
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#94A3B8]">
                  {lesson.description ||
                    'No description provided.'}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/lesson/${lesson.id}`,
                    )
                  }
                  className="mt-5 text-sm font-semibold text-[#A855F7] transition hover:text-[#EC4899]"
                >
                  Open Lesson →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-[#F8FAFC]">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Create Lesson */}
            <button
              type="button"
              onClick={() =>
                setIsCreateModalOpen(true)
              }
              className="group rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-6 text-left transition-all duration-200 hover:border-[#8B5CF6]/60 hover:bg-[#1B202B] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#F8FAFC]">
                    Create a Lesson
                  </p>

                  <p className="mt-2 text-sm text-[#94A3B8]">
                    Start with a blank teaching
                    workspace.
                  </p>
                </div>

                <span className="text-xl text-[#A855F7] transition group-hover:text-[#EC4899]">
                  +
                </span>
              </div>
            </button>

            {/* Start Recording */}
            <button
              type="button"
              onClick={() =>
                navigate('/recordings')
              }
              className="group rounded-2xl border border-[#2A2F3A] bg-[#171B24] p-6 text-left transition-all duration-200 hover:border-[#EF4444]/50 hover:bg-[#1B202B] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#F8FAFC]">
                    Start Recording
                  </p>

                  <p className="mt-2 text-sm text-[#94A3B8]">
                    Record your screen,
                    whiteboard and voice.
                  </p>
                </div>

                <span className="text-xl text-[#EF4444]">
                  ●
                </span>
              </div>
            </button>
          </div>
        </section>
      </div>

      <CreateLessonModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onCreate={handleCreateLesson}
      />
    </>
  )
}

export default Dashboard