import { useEffect, useState } from 'react'

const STORAGE_KEY = 'dashboard-theme'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

// Sigue a prefers-color-scheme hasta que el usuario usa el toggle manual
export function useTheme() {
  const [stored, setStored] = useState(readStored)
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches)

  useEffect(() => {
    const query = darkQuery()
    const onChange = (event) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (stored) root.dataset.theme = stored
    else delete root.dataset.theme
    try {
      if (stored) localStorage.setItem(STORAGE_KEY, stored)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Sin almacenamiento: el tema elegido dura solo esta sesión
    }
  }, [stored])

  const isDark = stored ? stored === 'dark' : systemDark
  return { isDark, toggle: () => setStored(isDark ? 'light' : 'dark') }
}
