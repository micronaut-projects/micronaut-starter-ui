import { useEffect, useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

export const loadTheme = () => {
  const mode = window.localStorage.getItem('theme')
  switch (mode) {
    case THEME_LIGHT:
    case THEME_DARK:
      return mode
    default:
      return THEME_LIGHT
  }
}

export const registerTheme = (theme) => {
  window.localStorage.setItem('theme', theme)
  document.body.className = theme
  return theme
}

export const nextTheme = (theme) => {
  return theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT
}

const themeState = atom({
  key: 'THEME_STATE',
  default: registerTheme(loadTheme()),
})

export default function useAppTheme() {
  const [theme, setTheme] = useRecoilState(themeState)

  useEffect(() => {
    registerTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((theme) => nextTheme(theme))
  }, [setTheme])

  return [theme, toggleTheme]
}
