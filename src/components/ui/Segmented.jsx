import { useCaptureLoading } from './captureLoading.js'
import { Spinner } from './Spinner.jsx'

/**
 * Grupo de opciones excluyentes (rango de tiempo, filtros).
 * Estados por opción: Default · Seleccionada · Hover · Focus · Disabled · Loading.
 */
export function Segmented({ label, options, value, onChange, loading: loadingProp = false, disabled = false }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <div className="segmented" role="group" aria-label={label} aria-busy={loading || undefined}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={loading ? 'is-loading' : undefined}
          aria-pressed={value === option.id}
          disabled={disabled || loading}
          onClick={() => onChange(option.id)}
        >
          {loading && <Spinner />}
          {option.label}
        </button>
      ))}
    </div>
  )
}
