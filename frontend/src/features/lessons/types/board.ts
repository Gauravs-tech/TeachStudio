export type BoardTheme =
  | 'WHITEBOARD'
  | 'BLACKBOARD'
  | 'GREENBOARD'

export type HighlightMode =
  | 'TEMPORARY'
  | 'PERMANENT'

export interface BoardThemeConfig {
  id: BoardTheme
  name: string
  backgroundColor: string
  previewClass: string
}