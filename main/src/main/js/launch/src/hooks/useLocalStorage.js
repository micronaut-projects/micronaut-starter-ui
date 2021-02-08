import { useState, useCallback } from 'react'

export default function useLocalStorage(key, initialValue, skipOnce = false) {
  const [state, setState] = useState(() => {
    if (skipOnce) {
      return initialValue
    }
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setter = useCallback(
    (value) => {
      try {
        const update = value instanceof Function ? value(state) : value
        setState(update)
        window.sessionStorage.setItem(key, JSON.stringify(update))
      } catch (error) {
        console.log('useLocalStorage', error)
      }
    },
    [state, key]
  )

  return [state, setter]
}
