import { useEffect, useMemo, useRef, useState } from 'react'
import { useInitialData, useStarterForm } from '../../state/store'

const handlersFactory = (node, setState) => {
  return {
    // calculate relative position to the mouse and set dragging=true
    onMouseDown: function (e) {
      // only left mouse button
      if (e.button !== 0) return
      window.ref = node.current
      const { offsetLeft, offsetTop } = node.current
      setState((state) => ({
        ...state,
        dragging: true,
        rel: {
          x: e.pageX - offsetLeft,
          y: e.pageY - offsetTop,
        },
      }))
      e.stopPropagation()
      e.preventDefault()
    },

    onMouseUp: function (e) {
      setState((state) => ({ ...state, dragging: false }))
      e.stopPropagation()
      e.preventDefault()
    },

    onMouseMove: function (e) {
      e.stopPropagation()
      e.preventDefault()
      setState((state) => {
        if (!state.dragging) return state
        return {
          ...state,
          pos: {
            x: e.pageX - state.rel.x,
            y: e.pageY - state.rel.y,
          },
        }
      })
    },
  }
}

const useDragHandles = (ref) => {
  const [drag, setDrag] = useState({})

  const handlers = useMemo(() => {
    return handlersFactory(ref, setDrag)
  }, [ref, setDrag])

  useEffect(() => {
    if (drag.dragging) {
      document.addEventListener('mousemove', handlers.onMouseMove)
      document.addEventListener('mouseup', handlers.onMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handlers.onMouseMove)
      document.removeEventListener('mouseup', handlers.onMouseUp)
    }
  }, [drag.dragging, handlers])

  const position = {
    left: drag?.pos?.x ?? 0 + 'px',
    top: drag?.pos?.y ?? 0 + 'px',
    dragging: drag?.dragging,
  }
  return [position, handlers.onMouseDown]
}

export function DebugInfo() {
  const form = useStarterForm()
  const { debug } = useInitialData()
  const ref = useRef()
  const [{ left, top, dragging }, onMouseDown] = useDragHandles(ref)

  return (
    debug === 'true' && (
      <div
        ref={ref}
        onMouseDown={onMouseDown}
        style={{
          position: 'fixed',
          left,
          top,
          padding: 10,
          background: 'grey',
          color: 'white',
          maxWidth: '30%',
          maxHeight: '40%',
          overflow: 'scroll',
          fontSize: '8px',
          zIndex: 9999,
          cursor: dragging && 'grabbing',
        }}
      >
        <div
          style={{
            position: 'sticky',
            width: 100,
            background: 'white',
            borderRadius: '2px',
            height: '4px',
            margin: 'auto',
            top: 0,
            left: 0,
            right: 0,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        ></div>
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
    )
  )
}
