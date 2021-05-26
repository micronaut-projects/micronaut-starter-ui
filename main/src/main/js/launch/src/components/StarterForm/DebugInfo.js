import { useInitialData, useStarterForm } from '../../state/store'

export function DebugInfo() {
  const form = useStarterForm()
  const { debug } = useInitialData()
  return (
    debug === 'true' && (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          padding: 10,
          background: 'grey',
          color: 'white',
          maxWidth: '30%',
          maxHeight: '40%',
          overflow: 'scroll',
          fontSize: '8px',
        }}
      >
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
    )
  )
}
