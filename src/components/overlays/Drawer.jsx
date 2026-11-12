import { useRef, useState } from 'react'
import { INSTANCE_TYPES } from '../../data/mock.js'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { Button } from '../ui/Button.jsx'
import { DateField } from '../ui/DateField.jsx'
import { Icon } from '../ui/Icon.jsx'
import { IconButton } from '../ui/IconButton.jsx'
import { Select } from '../ui/Select.jsx'
import { Switch } from '../ui/Switch.jsx'
import { TextArea } from '../ui/TextArea.jsx'
import { TextField } from '../ui/TextField.jsx'

const today = () => new Date().toISOString().slice(0, 10)

function validate(draft) {
  const errors = {}
  const min = Number(draft.minReplicas)
  const max = Number(draft.maxReplicas)
  const threshold = Number(draft.cpuThreshold)
  if (!Number.isInteger(min) || min < 1) errors.minReplicas = 'Escribe un número entero mayor o igual a 1.'
  if (!Number.isInteger(max) || max < 1) errors.maxReplicas = 'Escribe un número entero mayor o igual a 1.'
  else if (!errors.minReplicas && max < min) errors.maxReplicas = 'Debe ser mayor o igual que las réplicas mínimas.'
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 100) errors.cpuThreshold = 'Escribe un porcentaje entero entre 1 y 100.'
  if (draft.applyOn && draft.applyOn < today()) errors.applyOn = 'Elige hoy o una fecha posterior.'
  return errors
}

function ConfigForm({ instance, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...instance.config }))
  const [saving, setSaving] = useState(false)
  const errors = validate(draft)
  const dirty = Object.keys(draft).some((key) => String(draft[key]) !== String(instance.config[key]))
  const valid = Object.keys(errors).length === 0
  const set = (key) => (event) => setDraft((d) => ({ ...d, [key]: event.target.value }))

  async function onSubmit(event) {
    event.preventDefault()
    if (!dirty || !valid || saving) return
    setSaving(true)
    await onSave(instance, {
      ...draft,
      minReplicas: Number(draft.minReplicas),
      maxReplicas: Number(draft.maxReplicas),
      cpuThreshold: Number(draft.cpuThreshold),
    })
    setSaving(false)
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-busy={saving || undefined}>
      <fieldset>
        <legend className="form-section">Recursos</legend>
        <Select id="cfg-type" label="Tipo de instancia" options={INSTANCE_TYPES} value={draft.instanceType} onChange={set('instanceType')} loading={saving} />
        <div className="form-row">
          <TextField id="cfg-min" label="Réplicas mín." inputMode="numeric" value={draft.minReplicas} onChange={set('minReplicas')} error={errors.minReplicas} loading={saving} />
          <TextField id="cfg-max" label="Réplicas máx." inputMode="numeric" value={draft.maxReplicas} onChange={set('maxReplicas')} error={errors.maxReplicas} loading={saving} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="form-section">Alertas</legend>
        <TextField
          id="cfg-threshold"
          label="Umbral de CPU (%)"
          inputMode="numeric"
          value={draft.cpuThreshold}
          onChange={set('cpuThreshold')}
          error={errors.cpuThreshold}
          hint="Se notifica cuando se supera durante 5 min."
          loading={saving}
        />
        <Switch id="cfg-autoscaling" label="Escalado automático" checked={draft.autoscaling} onChange={(value) => setDraft((d) => ({ ...d, autoscaling: value }))} loading={saving} />
        <Switch id="cfg-pagerduty" label="Notificar a PagerDuty" checked={draft.pagerduty} onChange={(value) => setDraft((d) => ({ ...d, pagerduty: value }))} loading={saving} />
      </fieldset>

      <fieldset>
        <legend className="form-section">Programación</legend>
        <DateField
          id="cfg-apply"
          label="Aplicar cambios el"
          min={today()}
          value={draft.applyOn}
          onChange={set('applyOn')}
          error={errors.applyOn}
          hint="Sin fecha, se aplican en el siguiente despliegue."
          loading={saving}
        />
        <TextArea id="cfg-note" label="Nota del cambio" placeholder="Describe el motivo del cambio…" value={draft.note} onChange={set('note')} loading={saving} />
      </fieldset>

      <div className="form-row">
        <Button onClick={() => setDraft({ ...instance.config })} disabled={!dirty || saving}>
          Descartar
        </Button>
        <Button type="submit" variant="primary" disabled={!dirty || !valid} loading={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

/** Zona 3 · Drawer de configuración (derecha en tableta/escritorio, inferior en móvil). */
export function Drawer({ open, formKey, instance, onClose, onSave, onRequestAction }) {
  const ref = useRef(null)
  useFocusTrap(ref, open, { onEscape: onClose })
  const running = instance?.status === 'running'

  return (
    <>
      <div className={`scrim drawer-scrim${open ? ' is-visible' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={ref}
        className={`drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        inert={!open ? true : undefined}
      >
        <span className="drawer-handle" aria-hidden="true" />
        <div className="drawer-head">
          <h2 id="drawer-title">Configuración del servicio</h2>
          <IconButton icon="x" label="Cerrar panel" onClick={onClose} />
        </div>
        {instance && (
          <div className="drawer-body">
            <p className="drawer-context">{instance.id} · los cambios se aplican en el siguiente despliegue.</p>
            <ConfigForm key={formKey} instance={instance} onSave={onSave} />
            <section className="danger-zone" aria-labelledby="danger-title">
              <h3 id="danger-title">
                <Icon name="alert" size={18} />
                Zona de peligro
              </h3>
              <p>Estas acciones interrumpen el servicio y siempre piden confirmación.</p>
              <div className="button-group">
                <Button variant="danger-outline" icon="refresh" disabled={!running} onClick={() => onRequestAction('restart')}>
                  Reiniciar instancia
                </Button>
                <Button variant="danger" icon="trash" disabled={!running} onClick={() => onRequestAction('terminate')}>
                  Terminar instancia
                </Button>
              </div>
            </section>
          </div>
        )}
      </aside>
    </>
  )
}
