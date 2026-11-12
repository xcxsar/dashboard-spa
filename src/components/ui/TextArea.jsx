import { useCaptureLoading } from './captureLoading.js'
import { controlProps } from './controlProps.js'
import { Field } from './Field.jsx'

export function TextArea({ id, label, hint, error, loading: loadingProp, rows = 4, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <Field id={id} label={label} hint={hint} error={error} loading={loading}>
      <textarea rows={rows} {...controlProps({ id, error, hint, loading })} {...props} />
    </Field>
  )
}
