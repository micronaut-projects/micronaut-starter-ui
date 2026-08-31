import { useSelectedVersions } from '../../state/store'
import RadioGroup from '../RadioGroup'
import { useStarterVersionKeyboardEvents } from './useStarterFormKeyboardEvents'

export default function MicronautVersion() {
  const [version, setter, options] = useSelectedVersions()

  const handleVersionChange = (event) => {
    const { value } = event.target
    if (!value) return
    setter(options.find((v) => v.value === value))
  }
  useStarterVersionKeyboardEvents(handleVersionChange, version, options)

  return (
    <RadioGroup
      tabIndex={1}
      label="Micronaut Version"
      id="micronautApi"
      name="micronautApi"
      value={version?.value}
      onChange={handleVersionChange}
      options={options}
      expected={2}
    />
  )
}
