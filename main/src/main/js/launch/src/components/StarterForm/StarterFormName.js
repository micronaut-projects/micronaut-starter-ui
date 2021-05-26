import { useAppName } from '../../state/store'
import TextInput from '../TextInput'

export default function StarterFormName() {
  const [value, setter] = useAppName()
  const handleChange = (event) => setter(event.target.value)

  return (
    <TextInput
      required
      tabIndex={1}
      className="mn-input"
      label="Name"
      name="name"
      placeholder="ex: myapp"
      value={value}
      onChange={handleChange}
    />
  )
}
