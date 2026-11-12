import { useEffect, useState } from 'react'

const REFRESH_SECONDS = 30

/** Indicador de datos en tiempo real: segundos desde la última actualización (ciclo de 30 s). */
export function LiveIndicator({ className = '' }) {
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s + 1) % REFRESH_SECONDS), 1000)
    return () => clearInterval(id)
  }, [])

  return <span className={`live ${className}`}>En vivo · hace {seconds} s</span>
}
