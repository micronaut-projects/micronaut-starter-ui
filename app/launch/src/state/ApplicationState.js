import { useMemo } from 'react'
import { RecoilRoot } from 'recoil'
import { initializeStateFactory } from './factories/initializeState'

export default function ApplicationState({
  initialData,
  stateInitializer,
  children,
}) {
  const initializeState = useMemo(() => {
    if (typeof stateInitializer === 'function') return stateInitializer
    return initializeStateFactory(initialData)
  }, [initialData, stateInitializer])

  return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
}
