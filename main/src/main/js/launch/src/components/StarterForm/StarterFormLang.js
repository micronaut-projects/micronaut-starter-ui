import { NEXT_LANG_SHORTCUT } from '../../constants/shortcuts'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useLanguage } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useOptHandler } from './useStarterFormKeyboardEvents'

export default function StarterFormLang() {
  const [value, setter, select] = useLanguage()
  const handleChange = (event) => setter(event.target.value)

  const next = useOptHandler('lang', value, select?.options ?? [], handleChange)
  useKeyboardShortcuts(NEXT_LANG_SHORTCUT.keys, next)

  return (
    <RadioGroup
      tabIndex={1}
      label="Language"
      id="lang"
      name="lang"
      value={value}
      onChange={handleChange}
      options={select?.options ?? []}
      loading={!select}
      expected={3}
    />
  )
}
