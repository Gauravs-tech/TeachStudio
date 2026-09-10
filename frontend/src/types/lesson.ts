export type LessonStatus = 'DRAFT' | 'PUBLISHED'

export interface Lesson {
  id: string
  title: string
  description?: string
  status: LessonStatus
  createdAt: string
  updatedAt: string
}