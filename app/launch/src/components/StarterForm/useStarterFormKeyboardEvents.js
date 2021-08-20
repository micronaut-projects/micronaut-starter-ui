import { useCallback } from 'react'
import {
  NEXT_APP_TYPE_SHORTCUT,
  NEXT_BUILD_SHORTCUT,
  NEXT_JDK_SHORTCUT,
  NEXT_LANG_SHORTCUT,
  NEXT_TEST_SHORTCUT,
  NEXT_VERSION_SHORTCUT,
} from '../../constants/shortcuts'

import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'

export const useOptHandler = (name, value, opts, handleChange) => {
  return useCallback(() => {
    if (opts.length <= 1 || !value) return // One or less opt, nothing to do here

    const idx = opts.findIndex((l) => l.value === value)
    if (idx === opts.length - 1) {
      handleChange({ target: { name, value: opts[0].value } })
    } else {
      handleChange({
        target: { name, value: opts[idx + 1].value },
      })
    }
  }, [name, value, opts, handleChange])
}

export function useStarterVersionKeyboardEvents(
  handleVersionChange,
  version,
  versions
) {
  const nextVersion = useOptHandler(
    'version',
    version?.value,
    versions,
    handleVersionChange
  )
  useKeyboardShortcuts(NEXT_VERSION_SHORTCUT.keys, nextVersion)
}

export function useStarterFormKeyboardEvents(
  handleChange,
  form,
  { LANG_OPTS, BUILD_OPTS, TEST_OPTS, APP_TYPES, JAVA_OPTS }
) {
  const nextType = useOptHandler('type', form.type, APP_TYPES, handleChange)
  useKeyboardShortcuts(NEXT_APP_TYPE_SHORTCUT.keys, nextType)

  const nextJavaVersion = useOptHandler(
    'javaVersion',
    form.javaVersion,
    JAVA_OPTS,
    handleChange
  )
  useKeyboardShortcuts(NEXT_JDK_SHORTCUT.keys, nextJavaVersion)

  const nextLang = useOptHandler('lang', form.lang, LANG_OPTS, handleChange)
  useKeyboardShortcuts(NEXT_LANG_SHORTCUT.keys, nextLang)

  const nextBuild = useOptHandler('build', form.build, BUILD_OPTS, handleChange)
  useKeyboardShortcuts(NEXT_BUILD_SHORTCUT.keys, nextBuild)

  const nextTest = useOptHandler('test', form.test, TEST_OPTS, handleChange)
  useKeyboardShortcuts(NEXT_TEST_SHORTCUT.keys, nextTest)
}
