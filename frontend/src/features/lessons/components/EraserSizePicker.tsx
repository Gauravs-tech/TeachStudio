import {
TldrawUiButton,
TldrawUiButtonLabel,
} from 'tldraw'

import { ERASER_SIZES } from '../config/eraserSizes'
import { useBoardStore } from '../stores/board.store'

function EraserSizePicker() {
const eraserSize = useBoardStore(
(state) => state.eraserSize,
)

const setEraserSize = useBoardStore(
(state) => state.setEraserSize,
)

return ( <div className="flex flex-col gap-1"> <TldrawUiButtonLabel>
Eraser Size </TldrawUiButtonLabel>

```
  <div className="flex flex-wrap gap-1">
    {ERASER_SIZES.map((size) => {
      const isActive =
        eraserSize === size.id

      return (
        <TldrawUiButton
          key={size.id}
          type="tool"
          title={size.name}
          aria-label={`Use ${size.name} eraser`}
          isActive={isActive}
          onClick={() =>
            setEraserSize(size.id)
          }
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
            }}
          >
            <span
              className="rounded-full border border-gray-500 bg-gray-200"
              style={{
                width: size.previewSize,
                height: size.previewSize,
              }}
            />
          </span>
        </TldrawUiButton>
      )
    })}
  </div>
</div>


)
}

export default EraserSizePicker
