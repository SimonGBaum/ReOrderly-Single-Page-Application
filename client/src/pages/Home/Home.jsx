import { Link } from 'react-router-dom'
import { IconPlus, IconList, IconEdit, IconRadar } from '@tabler/icons-react'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrdersContext'
import './Home.css'

const LION_CARDS = [
  { to: '/create', label: 'Create', tagline: 'Deploy a new order', Icon: IconPlus,  accent: '#FF4040' },
  { to: '/orders', label: 'Orders', tagline: 'Review your fleet',  Icon: IconList,  accent: '#4A9EE8' },
  { to: '/update', label: 'Update', tagline: 'Adjust your mission',Icon: IconEdit,  accent: '#3DCA5A' },
  { to: '/track',  label: 'Track',  tagline: 'Lock on and follow', Icon: IconRadar, accent: '#F0C030' },
]

export default function Home() {
  const { user }   = useAuth()
  const { orders } = useOrders()

  const activeCount   = orders.filter(o => o.status === 'active').length
  const lifetimeDels  = orders.reduce((s, o) => s + (o.deliveriesCompleted || 0), 0)

  return (
    <PageWrapper page="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="page-content">
          <p className="home-greeting">Welcome back, {user?.firstName}.</p>
          <h1 className="home-title">REORDERLY</h1>
          <p className="home-pitch">
            Your orders, defended across the universe.
          </p>
          <p className="home-couplet">
            <em>
              Forgot to re-order? Your pantry weeps.<br />
              ReOrderly's got this — your schedule keeps.
            </em>
          </p>
        </div>
      </section>

      {/* Stats */}
      {(activeCount > 0 || lifetimeDels > 0) && (
        <section className="home-stats">
          <div className="page-content home-stats__inner">
            <div className="home-stat card">
              <span className="home-stat__value">{activeCount}</span>
              <span className="home-stat__label">Active Orders</span>
            </div>
            <div className="home-stat card">
              <span className="home-stat__value">{lifetimeDels}</span>
              <span className="home-stat__label">Lifetime Deliveries</span>
            </div>
          </div>
        </section>
      )}

      {/* Lion nav cards */}
      <section className="home-cards">
        <div className="page-content">
          <div className="home-cards__grid">
            {LION_CARDS.map(({ to, label, tagline, Icon, accent }) => (
              <Link
                key={to}
                to={to}
                className="home-lion-card card"
                style={{ '--card-accent': accent }}
              >
                <Icon size={32} stroke={1.5} aria-hidden="true" color={accent} />
                <span className="home-lion-card__label">{label}</span>
                <span className="home-lion-card__tagline">{tagline}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
