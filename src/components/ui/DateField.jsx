import { useCaptureLoading } from './captureLoading.js'
import { controlProps } from './controlProps.js'
import { Field } from './Field.jsx'

/** Selector de fecha con el calendario nativo del navegador. */
export function DateField({ id, label, hint, error, loading: loadingProp, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <Field id={id} label={label} hint={hint} error={error} loading={loading}>
      <input type="date" {...controlProps({ id, error, hint, loading })} {...props} />
    </Field>
  )
}
