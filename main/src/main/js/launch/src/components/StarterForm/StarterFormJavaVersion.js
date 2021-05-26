import { NEXT_JDK_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useJavaVersion } from '../../state/store'
import Select from '../Select'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormJavaVersion() {
  const [value, setter, select] = useJavaVersion()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler(
    'javaVersion',
    value,
    select?.options ?? [],
    handleChange
  )
  useKeyboardShortcuts(NEXT_JDK_SHORTCUT.keys, next)

  return (
    <Select
      tabIndex={1}
      label="Java Version"
      value={value}
      name="javaVersion"
      onChange={handleChange}
      options={select?.options ?? []}
    ></Select>
  )
}
