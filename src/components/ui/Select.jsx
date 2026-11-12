import { useCaptureLoading } from './captureLoading.js'
import { controlProps } from './controlProps.js'
import { Field } from './Field.jsx'
import { Icon } from './Icon.jsx'

export function Select({ id, label, hint, error, loading: loadingProp, options, disabled = false, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  // <select> no admite readOnly: durante la carga se deshabilita
  const { readOnly, ...control } = controlProps({ id, error, hint, loading })
  return (
    <Field id={id} label={label} hint={hint} error={error} loading={loading}>
      <select {...control} disabled={disabled || Boolean(readOnly)} {...props}>
        {options.map((option) => {
          const { value, label: text } = typeof option === 'string' ? { value: option, label: option } : option
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
      <Icon name="chevronDown" size={18} className="field-icon" />
    </Field>
  )
}
