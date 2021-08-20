import { ReactComponent as BackdropImage } from '../../images/micronaut-launch.svg'

export function AppLoadingBackdrop({ children }) {
  return (
    <div style={styles.container}>
      <BackdropImage className="inverse-theme" style={styles.image} />
      {children}
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
  image: { position: 'absolute', width: '90%', opacity: 0.1 },
}
