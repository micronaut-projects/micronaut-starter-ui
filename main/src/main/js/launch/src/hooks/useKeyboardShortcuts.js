import { useCallback, useEffect, useRef } from 'react'

const IGNORE_TAGS = ['INPUT', 'TEXTAREA']

function shouldIgnore(target) {
  return IGNORE_TAGS.includes(target.tagName)
}

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
      const { repeat, keyCode, target } = event

      if (repeat || shouldIgnore(target)) {
        return
      }
      activeKeys.current.add(keyCode)

      // If more keys are pressed than requested return
      if (activeKeys.current.size !== shortcutKeys.length) {
        return
      }

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
      const { keyCode, repeat, target } = event

      if (repeat || shouldIgnore(target) || !activeKeys.current.has(keyCode)) {
        return
      }
      activeKeys.current.delete(keyCode)
    },
    [activeKeys]
  )

  useEffect(() => {
    activeKeys.current.clear()
  }, [shortcutKeys, activeKeys])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [onKeyDown, shortcutKeys])

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp, true)
    return () => window.removeEventListener('keyup', onKeyUp, true)
  }, [onKeyUp, shortcutKeys])
}
