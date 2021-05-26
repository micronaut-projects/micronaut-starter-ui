import { useAppPackage } from '../../state/store'
import TextInput from '../TextInput'

export default function StarterFormPackage() {
  const [value, setter] = useAppPackage()
  const handleChange = (event) => setter(event.target.value)

  return (
    <TextInput
      tabIndex={1}
      required
      className="mn-input"
      label="Base Package"
      name="package"
      placeholder="ex: com.mycompany"
      value={value}
      onChange={handleChange}
    />
  )
}
