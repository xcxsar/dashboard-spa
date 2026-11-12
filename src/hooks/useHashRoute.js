import { useEffect, useState } from 'react'

function parse() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, search = ''] = raw.split('?')
  return {
    key: raw,
    parts: path.split('/').filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(search),
  }
}

// Enrutado de la SPA por hash: #/, #/instancias, #/instancias/:id, #/alertas
export function useHashRoute() {
  const [route, setRoute] = useState(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(path) {
  window.location.hash = path
}
