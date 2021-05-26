import { RecoilRoot } from 'recoil'

export default function ApplicationState({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>
}
