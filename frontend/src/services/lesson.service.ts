import type { Lesson } from '../types/lesson'

const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Introduction to Java',
    description: 'Learn the fundamentals of Java programming.',
    status: 'PUBLISHED',
    createdAt: '2026-09-01T10:00:00',
    updatedAt: '2026-09-01T10:00:00',
  },
  {
    id: 'lesson-2',
    title: 'Object-Oriented Programming',
    description: 'Classes, objects, inheritance and polymorphism.',
    status: 'DRAFT',
    createdAt: '2026-09-03T10:00:00',
    updatedAt: '2026-09-03T10:00:00',
  },
  {
    id: 'lesson-3',
    title: 'Spring Boot REST APIs',
    description: 'Build production-ready REST APIs with Spring Boot.',
    status: 'DRAFT',
    createdAt: '2026-09-05T10:00:00',
    updatedAt: '2026-09-05T10:00:00',
  },
]

export function getLessons(): Lesson[] {
  return mockLessons
}

export function createLesson(
  title: string,
  description: string,
): Lesson {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}