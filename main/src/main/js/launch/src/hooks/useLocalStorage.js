import { useState, useCallback } from 'react'

export const getStorageValue = (key, initialValue, skipOnce) => {
  if (skipOnce) {
    return initialValue
  }
  try {
    const item = window.sessionStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch (error) {
    return initialValue
  }
}

export const setStorageValue = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value))
  return value
}

export default function useLocalStorage(key, initialValue, skipOnce = false) {
  const [state, setState] = useState(() =>
    getStorageValue(key, initialValue, skipOnce)
  )

  const setter = useCallback(
    (value) => {
      try {
        const update = value instanceof Function ? value(state) : value
        setState(key, setStorageValue(update))
      } catch (error) {
        console.log('useLocalStorage', error)
      }
    },
    [state, key]
  )

  return [state, setter]
}
