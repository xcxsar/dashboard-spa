import { useEffect, useRef, useState } from 'react'
import { Header } from './components/layout/Header.jsx'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { ConfirmModal } from './components/overlays/ConfirmModal.jsx'
import { Drawer } from './components/overlays/Drawer.jsx'
import { CaptureLoadingContext } from './components/ui/captureLoading.js'
import { Toasts } from './components/ui/Toast.jsx'
import { ALERTS, CURRENT_USER, EVENTS, INSTANCES } from './data/mock.js'
import { useHashRoute } from './hooks/useHashRoute.js'
import { useMediaQuery } from './hooks/useMediaQuery.js'
import { useTheme } from './hooks/useTheme.js'
import { useToasts } from './hooks/useToasts.js'
import { Alerts } from './views/Alerts.jsx'
import { InstanceDetail } from './views/InstanceDetail.jsx'
import { Instances } from './views/Instances.jsx'
import { NotFound } from './views/NotFound.jsx'
import { Overview } from './views/Overview.jsx'

const HOME = { label: 'Inicio', href: '#/' }
const MODAL_EXIT_MS = 200
const TERMINATE_MS = 2500
const RESTART_MS = 2000

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function resolveView([section, id]) {
  if (!section) return { name: 'overview', nav: 'overview', title: 'Vista general', crumbs: [HOME, { label: 'Vista general' }] }
  if (section === 'instancias' && id)
    return { name: 'detail', nav: 'instances', id, title: id, crumbs: [HOME, { label: 'Instancias', href: '#/instancias' }, { label: id }] }
  if (section === 'instancias') return { name: 'instances', nav: 'instances', title: 'Instancias', crumbs: [HOME, { label: 'Instancias' }] }
  if (section === 'alertas') return { name: 'alerts', nav: 'alerts', title: 'Alertas', crumbs: [HOME, { label: 'Alertas' }] }
  return { name: 'not-found', nav: null, title: 'No encontrado', crumbs: [HOME, { label: 'No encontrado' }] }
}

export default function App() {
  const route = useHashRoute()
  const theme = useTheme()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { toasts, notify, dismiss } = useToasts()

  const [instances, setInstances] = useState(INSTANCES)
  const [alerts, setAlerts] = useState(ALERTS)
  const [events, setEvents] = useState(EVENTS)
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawer, setDrawer] = useState({ open: false, formKey: 0 })
  const [modal, setModal] = useState(null)

  // TEMPORAL (capturas): Alt+Shift+D alterna todos los controles en Disabled
  // y Alt+Shift+L en Loading
  const [captureDisabled, setCaptureDisabled] = useState(false)
  const [captureLoading, setCaptureLoading] = useState(false)
  useEffect(() => {
    function onKeyDown(event) {
      if (!event.altKey || !event.shiftKey) return
      if (event.code === 'KeyD') {
        event.preventDefault()
        setCaptureDisabled((value) => !value)
      } else if (event.code === 'KeyL') {
        event.preventDefault()
        setCaptureLoading((value) => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const view = resolveView(route.parts)
  const instance = view.id ? instances.find((i) => i.id === view.id) : null
  const activeAlerts = alerts.filter((a) => !a.silenced).length

  // Al cambiar de vista se cierran el menú y el drawer (ajuste de estado durante el render)
  const [routeKey, setRouteKey] = useState(route.key)
  if (routeKey !== route.key) {
    setRouteKey(route.key)
    setMenuOpen(false)
    setDrawer((d) => (d.open ? { ...d, open: false } : d))
  }

  // ¿Dónde estoy?: título del documento y foco en el encabezado de la vista nueva
  const lastRouteKey = useRef(route.key)
  useEffect(() => {
    document.title = `${view.title} · CloudOps`
    // Solo al navegar (no en la carga inicial)
    if (lastRouteKey.current === route.key) return
    lastRouteKey.current = route.key
    document.getElementById('page-title')?.focus()
  }, [route.key, view.title])

  const updateInstance = (id, patch) => setInstances((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const addEvent = (id, event) =>
    setEvents((all) => ({ ...all, [id]: [{ id: `ev-${Date.now()}`, ...event }, ...(all[id] ?? [])] }))

  function closeModal() {
    setModal((m) => (m ? { ...m, closing: true } : m))
    setTimeout(() => setModal(null), MODAL_EXIT_MS)
  }

  async function saveConfig(target, config) {
    await wait(1200)
    updateInstance(target.id, { config })
    notify({
      tone: 'ok',
      title: 'Cambios guardados',
      body: config.applyOn
        ? `Se aplicarán a ${target.id} el ${new Date(`${config.applyOn}T00:00`).toLocaleDateString('es-MX')}.`
        : `Se aplicarán a ${target.id} en el siguiente despliegue.`,
    })
  }

  function silenceAlert(alert) {
    setAlerts((list) => list.map((a) => (a.id === alert.id ? { ...a, silenced: true } : a)))
    notify({ title: 'Alerta silenciada', body: `${alert.title} · ${alert.instanceId}` })
  }

  async function confirmAction({ action, instance: target, snapshot }) {
    await wait(600)
    closeModal()
    setDrawer((d) => ({ ...d, open: false }))

    if (action === 'restart') {
      updateInstance(target.id, { status: 'restarting' })
      notify({ busy: true, title: `Reiniciando ${target.id}…`, body: 'La instancia volverá a responder en unos segundos.', duration: RESTART_MS })
      await wait(RESTART_MS)
      updateInstance(target.id, { status: 'running' })
      addEvent(target.id, { tone: 'accent', text: `Instancia reiniciada por ${CURRENT_USER.name}`, time: 'hace unos segundos' })
      notify({ tone: 'ok', title: `${target.id} reiniciada`, body: 'La instancia está en ejecución.' })
      return
    }

    updateInstance(target.id, { status: 'terminating' })
    notify({
      busy: true,
      title: `Terminando ${target.id}…`,
      body: snapshot ? 'Creando snapshot del disco y liberando las IP asignadas.' : 'Liberando el disco y las IP asignadas.',
      duration: TERMINATE_MS,
    })
    await wait(TERMINATE_MS)
    updateInstance(target.id, { status: 'terminated' })
    setAlerts((list) => list.filter((a) => a.instanceId !== target.id))
    addEvent(target.id, {
      tone: 'crit',
      text: `Instancia terminada por ${CURRENT_USER.name}${snapshot ? ' (con snapshot)' : ''}`,
      time: 'hace unos segundos',
    })
    notify({ tone: 'ok', title: `${target.id} terminada`, body: 'La facturación de esta instancia se detuvo.' })
  }

  let content
  if (view.name === 'overview') content = <Overview instances={instances} alerts={alerts} onSilence={silenceAlert} />
  else if (view.name === 'instances') content = <Instances key={route.key} instances={instances} initialQuery={route.query.get('q') ?? ''} />
  else if (view.name === 'alerts') content = <Alerts alerts={alerts} onSilence={silenceAlert} />
  else if (view.name === 'detail')
    content = (
      <InstanceDetail
        key={view.id}
        instance={instance}
        events={events[view.id] ?? []}
        onConfigure={() => setDrawer((d) => ({ open: true, formKey: d.formKey + 1 }))}
        onRequestAction={(action) => setModal({ action, instanceId: instance.id })}
      />
    )
  else content = <NotFound />

  const modalInstance = modal && instances.find((i) => i.id === modal.instanceId)

  return (
    <CaptureLoadingContext value={captureLoading}>
    <div className={`app${captureDisabled ? ' is-capture-disabled' : ''}${captureLoading ? ' is-capture-loading' : ''}`}>
      {/* TEMPORAL (capturas): el fieldset propaga `disabled` a todos los controles */}
      <fieldset className="capture-fieldset" disabled={captureDisabled}>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          // El hash se usa para rutas: se enfoca el contenido sin cambiar la URL
          event.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Saltar al contenido
      </a>
      <Sidebar section={view.nav} alertCount={activeAlerts} open={menuOpen || isDesktop} overlay={!isDesktop} onClose={() => setMenuOpen(false)} />
      <Header
        crumbs={view.crumbs}
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        isDark={theme.isDark}
        onToggleTheme={theme.toggle}
        alertCount={activeAlerts}
      />
      <main id="main" className="main" tabIndex={-1}>
        {content}
      </main>

      <Drawer
        open={drawer.open && Boolean(instance)}
        formKey={drawer.formKey}
        instance={instance}
        onClose={() => setDrawer((d) => ({ ...d, open: false }))}
        onSave={saveConfig}
        onRequestAction={(action) => setModal({ action, instanceId: instance.id })}
      />
      {modalInstance && (
        <ConfirmModal
          key={`${modal.action}-${modal.instanceId}`}
          action={modal.action}
          instance={modalInstance}
          closing={modal.closing}
          onCancel={closeModal}
          onConfirm={confirmAction}
        />
      )}
      <Toasts toasts={toasts} onDismiss={dismiss} />
      </fieldset>
    </div>
    </CaptureLoadingContext>
  )
}
