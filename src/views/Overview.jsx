import { useState } from 'react'
import { AlertCard } from '../components/AlertCard.jsx'
import { InstanceTable } from '../components/InstanceTable.jsx'
import { LiveIndicator } from '../components/layout/LiveIndicator.jsx'
import { ButtonLink } from '../components/ui/Button.jsx'
import { KpiCard } from '../components/ui/KpiCard.jsx'
import { LineChart } from '../components/ui/LineChart.jsx'
import { Segmented } from '../components/ui/Segmented.jsx'
import { Select } from '../components/ui/Select.jsx'
import { StatusChip } from '../components/ui/StatusChip.jsx'
import { CPU_24H, getHealth, MEM_24H, OVERVIEW_KPIS, REGIONS, TIME_RANGES } from '../data/mock.js'

const byPriority = (a, b) => getHealth(a).rank - getHealth(b).rank || b.cpu - a.cpu

export function Overview({ instances, alerts, onSilence }) {
  const [region, setRegion] = useState('all')
  const [range, setRange] = useState(TIME_RANGES[3])
  const scoped = region === 'all' ? instances : instances.filter((i) => i.region === region)
  const active = alerts.filter((a) => !a.silenced)
  const crit = active.filter((a) => a.severity === 'crit').length
  const regions = REGIONS.map((name) => {
    const list = instances.filter((i) => i.region === name && i.status !== 'terminated')
    const count = (key) => list.filter((i) => getHealth(i).key === key).length
    return { name, total: list.length, ok: count('ok'), warn: count('warn'), crit: count('crit') }
  }).filter((r) => region === 'all' || r.name === region)

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-titles">
          <h1 id="page-title" tabIndex={-1}>
            Vista general
          </h1>
          <p className="page-subtitle">
            Producción · {instances.length} instancias en {REGIONS.length} regiones
          </p>
        </div>
        <LiveIndicator className="page-live" />
      </header>

      <div className="filters">
        <Select id="filter-account" label="Cuenta" options={['Producción']} />
        <Select
          id="filter-region"
          label="Región"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          options={[{ value: 'all', label: 'Todas' }, ...REGIONS]}
        />
        <Select id="filter-env" label="Entorno" options={['prod']} />
        <Segmented
          label="Rango de tiempo"
          options={TIME_RANGES}
          value={range.id}
          onChange={(id) => setRange(TIME_RANGES.find((r) => r.id === id))}
        />
      </div>

      <div className="bento">
        {OVERVIEW_KPIS.map((kpi, index) => (
          <KpiCard key={kpi.id} className={`bento-k${index + 1}`} {...kpi} />
        ))}
        <KpiCard
          className="bento-k4"
          href="#/alertas"
          label="Alertas activas"
          value={String(active.length)}
          trend={`${crit} crítica${crit === 1 ? '' : 's'} · ${active.length - crit} advertencia${active.length - crit === 1 ? '' : 's'}`}
          tone={crit > 0 ? 'crit' : undefined}
          series={[2, 2, 3, 2, 3, 3, 2, 3, 4, 3, 3, 4, 3, 4, 4, 3, 4, 5, 4, active.length]}
        />

        <section className="card bento-chart" aria-labelledby="chart-title">
          <div className="card-head">
            <h2 id="chart-title">CPU y memoria</h2>
            <div className="legend">
              <span className="legend-item">
                <span className="legend-swatch series-1" />
                CPU
              </span>
              <span className="legend-item">
                <span className="legend-swatch series-2" />
                Memoria
              </span>
            </div>
          </div>
          <LineChart
            label={`CPU y memoria, últimas ${range.label}`}
            threshold={85}
            series={[
              { name: 'CPU', values: CPU_24H.slice(-range.points) },
              { name: 'Memoria', values: MEM_24H.slice(-range.points) },
            ]}
          />
          <p className="card-note">Línea punteada: umbral de alerta 85 % · últimas {range.label}</p>
        </section>

        <section className="card bento-region" aria-labelledby="region-title">
          <h2 id="region-title">Instancias por región</h2>
          <ul className="region-list">
            {regions.map((r) => (
              <li key={r.name}>
                <p className="region-row">
                  <span>{r.name}</span>
                  <strong>{r.total} inst.</strong>
                </p>
                <div className="stacked-bar" role="img" aria-label={`${r.name}: ${r.ok} correctas, ${r.warn} con advertencia, ${r.crit} críticas`}>
                  {['ok', 'warn', 'crit'].map((tone) => r[tone] > 0 && <span key={tone} className={`tone-${tone}`} style={{ flex: r[tone] }} />)}
                </div>
              </li>
            ))}
          </ul>
          <div className="legend">
            <span className="legend-item">
              <span className="legend-swatch tone-ok" />
              Correcto
            </span>
            <span className="legend-item">
              <span className="legend-swatch tone-warn" />
              Advertencia
            </span>
            <span className="legend-item">
              <span className="legend-swatch tone-crit" />
              Crítico
            </span>
          </div>
        </section>

        <section className="card bento-alerts" aria-labelledby="alerts-title">
          <div className="card-head">
            <h2 id="alerts-title">Alertas activas</h2>
            {active.length > 0 && <StatusChip tone="crit">{active.length} activas</StatusChip>}
          </div>
          {active.length === 0 ? (
            <p className="empty">Sin alertas activas.</p>
          ) : (
            active.slice(0, 2).map((alert) => <AlertCard key={alert.id} alert={alert} onSilence={onSilence} />)
          )}
          <ButtonLink variant="ghost" href="#/alertas" iconEnd="chevronRight">
            Ver todas las alertas
          </ButtonLink>
        </section>

        <section className="card table-card bento-table" aria-labelledby="table-title">
          <div className="card-head">
            <h2 id="table-title">Instancias con mayor uso</h2>
            <ButtonLink variant="ghost" href="#/instancias" iconEnd="chevronRight">
              Ver todas
            </ButtonLink>
          </div>
          <InstanceTable caption="Instancias con mayor uso" instances={[...scoped].sort(byPriority).slice(0, 5)} />
        </section>
      </div>
    </div>
  )
}
