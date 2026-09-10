import { useEditor } from 'tldraw'

function WorkspaceToolbar() {
  const editor = useEditor()

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-gray-200 bg-gray-50 py-4">
      <button
        type="button"
        onClick={() => editor.setCurrentTool('select')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm text-gray-600 hover:bg-gray-200"
        title="Select"
      >
        ↖
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('draw')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Pen"
      >
        ✎
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('text')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Text"
      >
        T
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('line')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Line"
      >
        ╱
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('arrow')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Arrow"
      >
        →
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('rectangle')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Rectangle"
      >
        □
      </button>

      <button
        type="button"
        onClick={() => editor.setCurrentTool('ellipse')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Circle"
      >
        ○
      </button>

      <div className="my-2 h-px w-8 bg-gray-200" />

      <button
        type="button"
        onClick={() => editor.setCurrentTool('eraser')}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-gray-600 hover:bg-gray-200"
        title="Eraser"
      >
        ⌫
      </button>
    </aside>
  )
}

export default WorkspaceToolbar