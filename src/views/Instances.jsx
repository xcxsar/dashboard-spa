import { useState } from 'react'
import { InstanceTable } from '../components/InstanceTable.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Select } from '../components/ui/Select.jsx'
import { TextField } from '../components/ui/TextField.jsx'
import { getHealth, REGIONS } from '../data/mock.js'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'crit', label: 'Crítico' },
  { value: 'warn', label: 'Advertencia' },
  { value: 'ok', label: 'Correcto' },
  { value: 'terminated', label: 'Terminada' },
]

export function Instances({ instances, initialQuery }) {
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState('all')
  const [region, setRegion] = useState('all')
  const [page, setPage] = useState(1)

  const q = query.trim().toLowerCase()
  const filtered = instances.filter(
    (i) =>
      (!q || [i.id, i.ip, i.service, i.region].some((v) => v.toLowerCase().includes(q))) &&
      (status === 'all' || getHealth(i).key === status) &&
      (region === 'all' || i.region === region),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const count = (key) => instances.filter((i) => getHealth(i).key === key).length
  const update = (setter) => (event) => {
    setter(event.target.value)
    setPage(1)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-titles">
          <h1 id="page-title" tabIndex={-1}>
            Instancias
          </h1>
          <p className="page-subtitle">
            {instances.length} instancias · {count('crit')} crítica · {count('warn')} con advertencia
            {count('terminated') > 0 && ` · ${count('terminated')} terminada`}
          </p>
        </div>
      </header>

      <div className="toolbar">
        <div className="grow">
          <TextField id="instances-search" label="Buscar" type="search" placeholder="Filtrar por nombre, IP o servicio" value={query} onChange={update(setQuery)} />
        </div>
        <Select id="instances-status" label="Estado" options={STATUS_OPTIONS} value={status} onChange={update(setStatus)} />
        <Select id="instances-region" label="Región" options={[{ value: 'all', label: 'Todas' }, ...REGIONS]} value={region} onChange={update(setRegion)} />
      </div>

      <section className="card table-card" aria-label="Listado de instancias">
        <InstanceTable caption="Listado de instancias" instances={visible} />
        <nav className="pagination" aria-label="Paginación">
          <p aria-live="polite">
            Mostrando {visible.length} de {filtered.length} instancias · Página {current} de {pages}
          </p>
          <Button icon="chevronLeft" disabled={current === 1} onClick={() => setPage(current - 1)}>
            Anterior
          </Button>
          <Button disabled={current === pages} onClick={() => setPage(current + 1)}>
            Siguiente
          </Button>
        </nav>
      </section>
    </div>
  )
}
