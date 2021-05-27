import { useAppPackage } from '../../state/store'
import TextInput from '../TextInput'

export default function StarterFormPackage() {
  const [value, setter] = useAppPackage()
  const handleChange = (event) => setter(event.target.value)

  return (
    <TextInput
      id="starter-form-package-input"
      tabIndex={1}
      className="mn-input"
      label="Base Package"
      name="package"
      placeholder="ex: com.mycompany"
      required
      value={value}
      onChange={handleChange}
    />
  )
}
