import React from 'react'
import { vi } from 'vitest'

vi.mock('./images/micronaut-launch.svg?react', () => ({
  default: (props) => React.createElement('svg', props, 'micronaut-launch.svg'),
}))

// Keep the application test on its loading fallback without depending on the
// live version feed.
globalThis.fetch = () => new Promise(() => {})

const createStorage = () => {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size
    },
  }
}

for (const name of ['localStorage', 'sessionStorage']) {
  let storage
  try {
    storage = window[name]
  } catch {
    storage = undefined
  }
  if (!storage) {
    Object.defineProperty(window, name, {
      configurable: true,
      value: createStorage(),
    })
  }
}

if (globalThis.CSS) {
  Object.defineProperty(globalThis.CSS, 'escape', {
    configurable: true,
    value: (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&'),
  })
}
