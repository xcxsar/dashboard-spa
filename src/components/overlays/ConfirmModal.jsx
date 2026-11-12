import { useRef, useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { Button } from '../ui/Button.jsx'
import { Icon } from '../ui/Icon.jsx'
import { Switch } from '../ui/Switch.jsx'
import { TextField } from '../ui/TextField.jsx'

function copyFor(action, instance) {
  if (action === 'restart') {
    return {
      title: `¿Reiniciar la instancia ${instance.id}?`,
      description: 'La instancia dejará de responder unos segundos mientras se reinicia.',
      consequences: ['Las conexiones activas se cerrarán', 'Las métricas y la configuración se conservan'],
      confirm: 'Reiniciar instancia',
      icon: 'refresh',
    }
  }
  const dependents = instance.dependents.length
    ? [`${instance.dependents.length} servicios dependientes (${instance.dependents.join(', ')}) perderán conexión`]
    : []
  return {
    title: `¿Terminar la instancia ${instance.id}?`,
    description: 'Esta acción es irreversible. Se eliminarán el disco raíz y las IP asignadas a la instancia.',
    consequences: [...dependents, 'Se detendrá la facturación de esta instancia', 'El historial de métricas se conserva 30 días'],
    confirm: 'Terminar instancia',
    icon: 'trash',
    requireName: true,
  }
}

/** Zona 3 · Diálogo de confirmación para acciones destructivas. */
export function ConfirmModal({ action, instance, closing, onCancel, onConfirm }) {
  const ref = useRef(null)
  const cancelRef = useRef(null)
  const [typed, setTyped] = useState('')
  const [snapshot, setSnapshot] = useState(true)
  const [loading, setLoading] = useState(false)
  const copy = copyFor(action, instance)
  const matches = !copy.requireName || typed.trim() === instance.id
  const cancel = () => !loading && onCancel()

  // Foco inicial en "Cancelar": la opción segura
  useFocusTrap(ref, !closing, { onEscape: cancel, initialFocus: cancelRef })

  async function onSubmit(event) {
    event.preventDefault()
    if (!matches || loading) return
    setLoading(true)
    await onConfirm({ action, instance, snapshot })
  }

  return (
    <div className={`modal-backdrop${closing ? ' is-closing' : ''}`} onClick={(event) => event.target === event.currentTarget && cancel()}>
      <form
        ref={ref}
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onSubmit={onSubmit}
        noValidate
      >
        <span className="modal-icon" aria-hidden="true">
          <Icon name="alert" size={22} />
        </span>
        <h2 id="modal-title">{copy.title}</h2>
        <p id="modal-description" className="modal-description">
          {copy.description}
        </p>
        <ul className="consequences">
          {copy.consequences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {copy.requireName && (
          <>
            <TextField
              id="confirm-name"
              label={`Escribe «${instance.id}» para confirmar`}
              placeholder={instance.id}
              autoComplete="off"
              spellCheck={false}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              hint={matches ? '✓ El nombre coincide' : undefined}
              hintTone="ok"
              loading={loading}
            />
            <Switch id="confirm-snapshot" label="Crear snapshot del disco antes de terminar" checked={snapshot} onChange={setSnapshot} loading={loading} />
          </>
        )}

        <div className="modal-actions">
          <span className="modal-hint">Esc para cancelar</span>
          <Button ref={cancelRef} onClick={cancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" icon={copy.icon} disabled={!matches} loading={loading}>
            {copy.confirm}
          </Button>
        </div>
      </form>
    </div>
  )
}
