import { NEXT_APP_TYPE_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useApplicationType } from '../../state/store'
import Select from '../Select'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormApplicationType() {
  const [value, setter, select] = useApplicationType()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('type', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_APP_TYPE_SHORTCUT.keys, next)

  return (
    <Select
      tabIndex={1}
      className="mn-input"
      label="Application Type"
      name="type"
      value={value}
      onChange={handleChange}
      options={select?.options ?? [{ value, name: 'Loading' }]}
    ></Select>
  )
}
