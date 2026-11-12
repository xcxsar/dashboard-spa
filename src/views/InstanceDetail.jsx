import { useState } from 'react'
import { Button, ButtonLink } from '../components/ui/Button.jsx'
import { useCaptureLoading } from '../components/ui/captureLoading.js'
import { Icon } from '../components/ui/Icon.jsx'
import { KpiCard } from '../components/ui/KpiCard.jsx'
import { LineChart } from '../components/ui/LineChart.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import { StatusChip } from '../components/ui/StatusChip.jsx'
import { getHealth, meterTone } from '../data/mock.js'
import { NotFound } from './NotFound.jsx'

const TABS = [
  { id: 'metrics', label: 'Métricas' },
  { id: 'events', label: 'Eventos' },
]

export function InstanceDetail({ instance, events, onConfigure, onRequestAction }) {
  const [tab, setTab] = useState('metrics')
  const tabsLoading = useCaptureLoading()
  if (!instance) return <NotFound message="La instancia que buscas no existe o fue eliminada." />

  const health = getHealth(instance)
  const running = instance.status === 'running'
  const terminated = instance.status === 'terminated'
  const chipLabel = running && health.key !== 'ok' ? `${health.label} · CPU ${instance.cpu} %` : health.label
  const subtitle = terminated
    ? `${instance.type} · ${instance.zone} · terminada hace unos segundos`
    : `${instance.type} · ${instance.zone} · ${instance.ip} · ${instance.uptime}`
  const kpi = (label, value, unit, trend, tone) =>
    terminated ? { label, value: '—', trend: 'Sin datos', tone: 'off' } : { label, value: String(value), unit, trend, tone }

  function onTabKey(event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const index = TABS.findIndex((t) => t.id === tab)
    const next = TABS[(index + (event.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
    setTab(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <div className="page">
      <ButtonLink variant="ghost" icon="chevronLeft" href="#/instancias" className="back-link">
        Instancias
      </ButtonLink>

      <header className="page-header">
        <div className="page-titles">
          <div className="title-row">
            <h1 id="page-title" tabIndex={-1}>
              {instance.id}
            </h1>
            <StatusChip tone={health.tone}>{chipLabel}</StatusChip>
          </div>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className="button-group">
          <Button icon="refresh" disabled={!running} onClick={() => onRequestAction('restart')}>
            Reiniciar
          </Button>
          <Button variant="primary" icon="sliders" disabled={!running} onClick={onConfigure}>
            Configurar
          </Button>
        </div>
      </header>

      {terminated && (
        <div className="banner" role="note">
          <Icon name="info" />
          <p>Esta instancia fue terminada. Las métricas se conservan 30 días.</p>
          <ButtonLink href="#/instancias" iconEnd="chevronRight">
            Ver instancias
          </ButtonLink>
        </div>
      )}

      <div className="tabs" role="tablist" aria-label="Secciones de la instancia" onKeyDown={onTabKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            className={`tab${tabsLoading ? ' is-loading' : ''}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            aria-busy={tabsLoading || undefined}
            disabled={tabsLoading}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
          >
            {tabsLoading && <Spinner />}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'metrics' ? (
        <div id="panel-metrics" role="tabpanel" aria-labelledby="tab-metrics" className="page">
          <div className="kpi-grid">
            <KpiCard series={instance.cpuSeries} {...kpi('CPU', instance.cpu, '%', instance.trends.cpu, meterTone(instance.cpu))} />
            <KpiCard series={instance.cpuSeries.map((v) => v * 0.4 + instance.mem * 0.6)} {...kpi('Memoria', instance.mem, '%', instance.trends.mem, meterTone(instance.mem))} />
            <KpiCard {...kpi('Disco', instance.disk, '%', instance.trends.disk, meterTone(instance.disk))} />
            <KpiCard {...kpi('Latencia p95', instance.latency, 'ms', instance.trends.latency, instance.latency > 250 ? 'warn' : undefined)} />
          </div>
          <section className="card" aria-labelledby="cpu-title">
            <div className="card-head">
              <h2 id="cpu-title">CPU · últimas 6 h</h2>
              <span className="card-note">Umbral {instance.config.cpuThreshold} %</span>
            </div>
            <LineChart
              label="CPU de la instancia, últimas 6 h"
              threshold={instance.config.cpuThreshold}
              marker={instance.deployMarker?.position}
              series={[{ name: 'CPU', values: terminated ? instance.cpuSeries.map(() => 0) : instance.cpuSeries }]}
            />
            {instance.deployMarker && <p className="card-note">{instance.deployMarker.note}</p>}
          </section>
        </div>
      ) : (
        <section id="panel-events" role="tabpanel" aria-labelledby="tab-events" className="card">
          <h2>Eventos recientes</h2>
          {events.length === 0 ? (
            <p className="empty">Sin eventos recientes.</p>
          ) : (
            <ol className="event-list">
              {events.map((event) => (
                <li key={event.id} className={`event tone-${event.tone}`}>
                  <span>{event.text}</span>
                  <time>{event.time}</time>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </div>
  )
}
