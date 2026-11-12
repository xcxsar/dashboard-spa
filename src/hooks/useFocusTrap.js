import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Pila de capas abiertas: solo la superior responde a Tab y Escape
const layers = []

/**
 * Atrapa el foco dentro de `ref` mientras `active` es true, cierra con Escape
 * y devuelve el foco al elemento que abrió la capa.
 */
export function useFocusTrap(ref, active, { onEscape, initialFocus } = {}) {
  const onEscapeRef = useRef(onEscape)

  useEffect(() => {
    onEscapeRef.current = onEscape
  })

  useEffect(() => {
    if (!active || !ref.current) return
    const node = ref.current
    const layer = {}
    const opener = document.activeElement
    layers.push(layer)

    const focusables = () => [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0)
    const frame = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? focusables()[0] ?? node
      target.focus()
    })

    function onKeyDown(event) {
      if (layers[layers.length - 1] !== layer) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscapeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!node.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      layers.splice(layers.indexOf(layer), 1)
      if (opener instanceof HTMLElement && opener.isConnected && !opener.disabled) opener.focus()
    }
  }, [active, ref, initialFocus])
}
