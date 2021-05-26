import { NEXT_BUILD_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useBuild } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormBuild() {
  const [value, setter, select] = useBuild()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler(
    'build',
    value,
    select?.options ?? [],
    handleChange
  )
  useKeyboardShortcuts(NEXT_BUILD_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="Build Tool"
      id="build"
      name="build"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={2}
    />
  )
}
