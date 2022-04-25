import {NEXT_CLOUD_PROVIDER_SHORTCUT} from "../../constants/shortcuts";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import {useCloudProvider, NO_SELECTION_VALUE} from '../../state/store'
import Select from '../Select'
import {useOptHandler} from "./useStarterFormKeyboardEvents";

export default function StarterFormCloudProvider() {
  const [value, setter, select] = useCloudProvider()
  const handleChange = (event) => setter(event.target.value)

  const options = [{ value: NO_SELECTION_VALUE, name: 'None', label: 'None' }, ...(select?.options ?? [{ value, name: '' }])];
  const next = useOptHandler('cloudProvider', value, options, handleChange)
  useKeyboardShortcuts(NEXT_CLOUD_PROVIDER_SHORTCUT.keys, next)

  return (
    <Select
      tabIndex={1}
      label="Cloud Provider"
      value={value}
      name="cloudProvider"
      onChange={handleChange}
      options={options}
    ></Select>
  )
}
