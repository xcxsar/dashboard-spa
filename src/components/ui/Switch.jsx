import { useCaptureLoading } from './captureLoading.js'
import { Spinner } from './Spinner.jsx'

/** Interruptor binario (role="switch") con estados Hover, Focus, Disabled y Loading. */
export function Switch({ id, label, checked, onChange, disabled = false, loading: loadingProp = false }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <div className={`switch-row${loading ? ' is-loading' : ''}`}>
      <span id={`${id}-label`} className="switch-label">
        {label}
      </span>
      <button
        type="button"
        id={id}
        role="switch"
        className="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb">{loading && <Spinner />}</span>
      </button>
    </div>
  )
}
