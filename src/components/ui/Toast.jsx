import { Icon } from './Icon.jsx'
import { IconButton } from './IconButton.jsx'
import { Spinner } from './Spinner.jsx'

/** Región de notificaciones. role="status" anuncia cada mensaje a lectores de pantalla. */
export function Toasts({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone ?? 'info'}`}>
          <span className="toast-icon">{toast.busy ? <Spinner /> : <Icon name={toast.tone === 'ok' ? 'check' : 'info'} size={18} />}</span>
          <p className="toast-text">
            <strong>{toast.title}</strong>
            {toast.body}
          </p>
          <IconButton icon="x" label="Cerrar notificación" onClick={() => onDismiss(toast.id)} />
          {toast.busy && <span className="toast-progress" style={{ animationDuration: `${toast.duration}ms` }} />}
        </div>
      ))}
    </div>
  )
}
