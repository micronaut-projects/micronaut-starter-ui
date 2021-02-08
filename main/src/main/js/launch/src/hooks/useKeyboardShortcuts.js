import { useCallback, useEffect, useRef } from 'react'

const DISABLED_FN = () => {}
export default function useKeyboardShortcuts(
  shortcutKeys = [],
  callback = () => {},
  disabled = false
) {
  const activeKeys = useRef(new Set())
  const watchableCallback = useRef()
  useEffect(() => {
    watchableCallback.current = disabled === true ? DISABLED_FN : callback
  }, [callback, disabled])

  const onKeyDown = useCallback(
    (event) => {
      const { repeat, keyCode } = event
      if (repeat) return
      activeKeys.current.add(keyCode)
      // If more keys are pressed than requested return
      if (activeKeys.current.size !== shortcutKeys.length) return

      const difference = new Set(
        [...shortcutKeys].filter((x) => !activeKeys.current.has(x))
      )

      if (difference.size === 0) {
        watchableCallback.current()
      }
    },
    [shortcutKeys, activeKeys, watchableCallback]
  )

  const onKeyUp = useCallback(
    (event) => {
      const { keyCode, repeat } = event
      if (repeat || !activeKeys.current.has(keyCode)) return
      activeKeys.current.delete(keyCode)
    },
    [activeKeys]
  )

  useEffect(() => {
    activeKeys.current.clear()
  }, [shortcutKeys])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [onKeyDown, shortcutKeys])

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp, true)
    return () => window.removeEventListener('keyup', onKeyUp, true)
  }, [onKeyUp, shortcutKeys])
}
