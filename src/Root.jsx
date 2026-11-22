import { useEffect, useState } from 'react'
import App from './App.jsx'
import OverclockedProject from './OverclockedProject.jsx'

export default function Root() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash === '#/projects/overclocked' ? <OverclockedProject /> : <App />
}
