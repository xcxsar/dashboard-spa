import { useCallback, useState } from 'react'

let nextId = 0

export function useToasts() {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), [])

  const notify = useCallback(
    ({ duration = 5000, ...toast }) => {
      const id = ++nextId
      setToasts((list) => [...list, { id, duration, ...toast }])
      setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  return { toasts, notify, dismiss }
}
