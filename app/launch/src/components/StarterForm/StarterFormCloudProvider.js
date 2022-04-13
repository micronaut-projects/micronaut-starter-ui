import {useCloudProvider, NO_SELECTION_VALUE} from '../../state/store'
import Select from '../Select'

export default function StarterFormCloudProvider() {
  const [value, setter, select] = useCloudProvider()
  const handleChange = (event) => setter(event.target.value)

  return (
    <Select
      tabIndex={1}
      label="Cloud Provider"
      value={value}
      name="cloudProvider"
      onChange={handleChange}
      options={[{ value: NO_SELECTION_VALUE, name: 'None', label: 'None' }, ...(select?.options ?? [{ value, name: '' }])]}
    ></Select>
  )
}
