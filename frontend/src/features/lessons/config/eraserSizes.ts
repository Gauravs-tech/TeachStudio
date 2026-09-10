export type EraserSize = 'small' | 'medium' | 'large' | 'extra-large'

export interface EraserSizeOption {
id: EraserSize
name: string
radius: number
previewSize: number
}

export const ERASER_SIZES: EraserSizeOption[] = [
{
id: 'small',
name: 'Small',
radius: 8,
previewSize: 12,
},
{
id: 'medium',
name: 'Medium',
radius: 14,
previewSize: 20,
},
{
id: 'large',
name: 'Large',
radius: 22,
previewSize: 30,
},
{
id: 'extra-large',
name: 'Extra Large',
radius: 32,
previewSize: 42,
},
]
