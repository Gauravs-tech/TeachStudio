import {
  useState,
} from 'react'

import { NavLink } from 'react-router-dom'

import { useSlideStore } from '../../features/lessons/stores/slide.store'

function Sidebar() {
  const slides =
    useSlideStore(
      (state) => state.slides,
    )

  const activeSlideId =
    useSlideStore(
      (state) =>
        state.activeSlideId,
    )

  const setActiveSlide =
    useSlideStore(
      (state) =>
        state.setActiveSlide,
    )

  const addSlide =
    useSlideStore(
      (state) => state.addSlide,
    )

  const renameSlide =
    useSlideStore(
      (state) =>
        state.renameSlide,
    )

  const deleteSlide =
    useSlideStore(
      (state) =>
        state.deleteSlide,
    )

  const [
    editingSlideId,
    setEditingSlideId,
  ] = useState<string | null>(
    null,
  )

  const [
    editingTitle,
    setEditingTitle,
  ] = useState('')

  const startRename = (
    slideId: string,
    currentTitle: string,
  ) => {
    setEditingSlideId(
      slideId,
    )

    setEditingTitle(
      currentTitle,
    )
  }

  const saveRename = () => {
    if (!editingSlideId) {
      return
    }

    renameSlide(
      editingSlideId,
      editingTitle,
    )

    setEditingSlideId(null)
    setEditingTitle('')
  }

  const cancelRename = () => {
    setEditingSlideId(null)
    setEditingTitle('')
  }

  const handleAddSlide = () => {
    addSlide()
  }

  const handleDeleteSlide = (
    slideId: string,
  ) => {
    if (slides.length <= 1) {
      return
    }

    const slide =
      slides.find(
        (item) =>
          item.id === slideId,
      )

    const confirmed =
      window.confirm(
        `Delete "${slide?.title ?? 'this slide'}"?`,
      )

    if (!confirmed) {
      return
    }

    deleteSlide(slideId)
  }

  return (
    <aside className="flex w-64 flex-col border-r border-[#2A2F3A] bg-[#0D1118]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#2A2F3A] px-6">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-[#F8FAFC]">
            Teach
          </span>

          <span className="text-[#A855F7]">
            Studio
          </span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-[#171B24] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:bg-[#171B24] hover:text-[#F8FAFC]'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/lessons"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-[#171B24] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:bg-[#171B24] hover:text-[#F8FAFC]'
            }`
          }
        >
          Lessons
        </NavLink>

        <NavLink
          to="/recordings"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-[#171B24] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:bg-[#171B24] hover:text-[#F8FAFC]'
            }`
          }
        >
          Recordings
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `block rounded-lg px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-[#171B24] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:bg-[#171B24] hover:text-[#F8FAFC]'
            }`
          }
        >
          Settings
        </NavLink>
      </nav>

      {/* Slides */}
      <div className="px-4">
        <div className="mb-2 flex items-center justify-between px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Slides
          </p>

          <button
            type="button"
            title="Add new slide"
            aria-label="Add new slide"
            onClick={
              handleAddSlide
            }
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94A3B8] transition hover:bg-[#171B24] hover:text-[#A855F7]"
          >
            +
          </button>
        </div>

        <div className="space-y-1">
          {slides.map(
            (slide) => {
              const isActive =
                slide.id ===
                activeSlideId

              const isEditing =
                slide.id ===
                editingSlideId

              return (
                <div
                  key={slide.id}
                  className={`group flex items-center rounded-lg transition ${
                    isActive
                      ? 'border border-[#6D28D9]/60 bg-[#171B24]'
                      : 'hover:bg-[#171B24]'
                  }`}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={
                        editingTitle
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditingTitle(
                          event
                            .target
                            .value,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                          'Enter'
                        ) {
                          saveRename()
                        }

                        if (
                          event.key ===
                          'Escape'
                        ) {
                          cancelRename()
                        }
                      }}
                      onBlur={
                        saveRename
                      }
                      className="mx-2 my-1 min-w-0 flex-1 rounded-md border border-[#6D28D9] bg-[#11151D] px-2 py-1.5 text-sm text-[#F8FAFC] outline-none"
                    />
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveSlide(
                            slide.id,
                          )
                        }
                        className="flex min-w-0 flex-1 items-center px-4 py-2.5 text-left text-sm"
                      >
                        <span
                          className={`mr-3 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isActive
                              ? 'bg-[#A855F7]'
                              : 'bg-[#64748B]'
                          }`}
                        />

                        <span
                          className={`truncate ${
                            isActive
                              ? 'text-[#F8FAFC]'
                              : 'text-[#94A3B8]'
                          }`}
                        >
                          {
                            slide.title
                          }
                        </span>
                      </button>

                      <div className="mr-2 hidden items-center gap-0.5 group-hover:flex">
                        <button
                          type="button"
                          title="Rename slide"
                          aria-label={`Rename ${slide.title}`}
                          onClick={() =>
                            startRename(
                              slide.id,
                              slide.title,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#2A2F3A] hover:text-[#CBD5E1]"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 20H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />

                            <path
                              d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10218 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {slides.length >
                          1 && (
                          <button
                            type="button"
                            title="Delete slide"
                            aria-label={`Delete ${slide.title}`}
                            onClick={() =>
                              handleDeleteSlide(
                                slide.id,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#2A2F3A] hover:text-[#F43F5E]"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M4 7H20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />

                              <path
                                d="M10 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />

                              <path
                                d="M14 11V17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />

                              <path
                                d="M6 7L7 20H17L18 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              <path
                                d="M9 7V4H15V7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            },
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="mt-auto border-t border-[#2A2F3A] p-4">
        <div className="rounded-lg border border-[#2A2F3A] bg-[#171B24] px-4 py-3">
          <p className="text-sm font-semibold text-[#F8FAFC]">
            Teacher
          </p>

          <p className="text-xs text-[#94A3B8]">
            TeachStudio Account
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar