import { useEffect, useState, useCallback } from 'react'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

export default function useAppTheme() {
    const [theme, setTheme] = useState(loadTheme())
    useEffect(() => {
        registerTheme(theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((theme) => nextTheme(theme))
    }, [])

    return [theme, toggleTheme]
}

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
