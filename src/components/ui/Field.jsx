import { Spinner } from './Spinner.jsx'

/** Contenedor común de los campos: etiqueta, control, ayuda o error y estado Loading. */
export function Field({ id, label, hint, hintTone, error, loading, children }) {
  const className = ['field', error && 'has-error', loading && 'is-loading'].filter(Boolean).join(' ')
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-control">
        {children}
        {loading && <Spinner className="field-spinner" />}
      </div>
      {error ? (
        <p id={`${id}-message`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-message`} className={`field-hint${hintTone === 'ok' ? ' is-ok' : ''}`}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}
