import { Link } from 'react-router-dom'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import './ErrorPage.css'

export default function ErrorPage() {
  return (
    <PageWrapper page="error">
      <div className="error-page">
        <div className="error-card">
          <p className="error-code data-text">SYS_ERR :: 0x00FF</p>
          <h1 className="error-heading">Whoa, the Galra Jammed the Signal.</h1>
          <p className="error-body">
            Don't worry — nothing's lost. We're already tracking this and getting it sorted.
          </p>
          <Link to="/" className="error-cta">Retreat to Safety</Link>
        </div>
      </div>
    </PageWrapper>
  )
}
