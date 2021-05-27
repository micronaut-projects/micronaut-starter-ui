export function formResets(fallbacks = {}) {
  const { name, package: pkg, type } = fallbacks
  return {
    name: typeof name === 'string' ? name : 'demo',
    package: typeof pkg === 'string' ? pkg : 'com.example',
    type: typeof type === 'string' ? type : 'DEFAULT',
  }
}
