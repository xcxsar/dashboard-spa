import { useCaptureLoading } from './captureLoading.js'
import { controlProps } from './controlProps.js'
import { Field } from './Field.jsx'

export function TextField({ id, label, hint, hintTone, error, loading: loadingProp, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <Field id={id} label={label} hint={hint} hintTone={hintTone} error={error} loading={loading}>
      <input type="text" {...controlProps({ id, error, hint, loading })} {...props} />
    </Field>
  )
}
