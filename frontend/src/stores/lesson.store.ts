import { create } from 'zustand'

import type { Lesson } from '../types/lesson'
import {
  createLesson,
  getLessons,
} from '../services/lesson.service'

interface LessonState {
  lessons: Lesson[]
  loadLessons: () => void
  addLesson: (title: string, description: string) => Lesson
  getLessonById: (id: string) => Lesson | undefined
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: [],

  loadLessons: () => {
    const lessons = getLessons()

    set({ lessons })
  },

  addLesson: (title, description) => {
    const lesson = createLesson(title, description)

    set((state) => ({
      lessons: [...state.lessons, lesson],
    }))

    return lesson
  },

  getLessonById: (id) => {
    return get().lessons.find(
      (lesson) => lesson.id === id,
    )
  },
}))