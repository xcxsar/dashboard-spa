import { ButtonLink } from '../components/ui/Button.jsx'

export function NotFound({ message = 'La página que buscas no existe.' }) {
  return (
    <div className="page">
      <header className="page-header">
        <div className="page-titles">
          <h1 id="page-title" tabIndex={-1}>
            No encontrado
          </h1>
          <p className="page-subtitle">{message}</p>
        </div>
      </header>
      <ButtonLink variant="primary" href="#/" icon="home">
        Ir a la vista general
      </ButtonLink>
    </div>
  )
}
