/** ¿Dónde estoy? y ¿de dónde vengo?: ruta jerárquica hasta la vista actual. */
export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        {items.map((item, index) =>
          index === items.length - 1 ? (
            <li key={item.label} aria-current="page">
              {item.label}
            </li>
          ) : (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}
