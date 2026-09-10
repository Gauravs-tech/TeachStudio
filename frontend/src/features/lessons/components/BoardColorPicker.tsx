import type {
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw'

import {
  useEffect,
  useState,
} from 'react'

interface BoardColorPickerProps {
  api: ExcalidrawImperativeAPI | null
}

const COLORS = [
  {
    name: 'Black',
    value: '#1e1e1e',
  },
  {
    name: 'Red',
    value: '#e03131',
  },
  {
    name: 'Blue',
    value: '#1971c2',
  },
  {
    name: 'Green',
    value: '#2f9e44',
  },
  {
    name: 'Orange',
    value: '#f08c00',
  },
  {
    name: 'Purple',
    value: '#7048e8',
  },
  {
    name: 'Pink',
    value: '#d6336c',
  },
  {
    name: 'White',
    value: '#ffffff',
  },
]

function BoardColorPicker({
  api,
}: BoardColorPickerProps) {
  const [selectedColor, setSelectedColor] =
    useState('#1e1e1e')

  useEffect(() => {
    if (!api) {
      return
    }

    setSelectedColor(
      api.getAppState()
        .currentItemStrokeColor,
    )
  }, [api])

  const handleColorChange = (
    color: string,
  ) => {
    if (!api) {
      return
    }

    setSelectedColor(color)

    api.updateScene({
      appState: {
        currentItemStrokeColor:
          color,
      },
    })
  }

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-[#2A2F3A] bg-[#171B24]/95 px-2 py-1.5 shadow-lg shadow-black/20 backdrop-blur-sm">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
        Color
      </span>

      {COLORS.map((color) => {
        const isSelected =
          selectedColor.toLowerCase() ===
          color.value.toLowerCase()

        return (
          <button
            key={color.value}
            type="button"
            title={color.name}
            aria-label={`Set drawing color to ${color.name}`}
            aria-pressed={isSelected}
            onClick={() =>
              handleColorChange(
                color.value,
              )
            }
            className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
              isSelected
                ? 'ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-[#171B24]'
                : 'hover:scale-110'
            }`}
          >
            <span
              className="h-5 w-5 rounded-full border border-[#2A2F3A]"
              style={{
                backgroundColor:
                  color.value,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}

export default BoardColorPicker