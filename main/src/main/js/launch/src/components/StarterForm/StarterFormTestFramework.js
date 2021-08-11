import { NEXT_TEST_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useTestFramework } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormTestFramework() {
  const [value, setter, select] = useTestFramework()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('test', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_TEST_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="Test Framework"
      id="test"
      name="test"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={2}
    />
  )
}
