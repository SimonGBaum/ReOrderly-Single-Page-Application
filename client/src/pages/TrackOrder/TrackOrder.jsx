import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconSearch } from '@tabler/icons-react'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useOrders }  from '../../context/OrdersContext'
import { formatDate } from '../../utils/formatDate'
import './TrackOrder.css'

const TIMELINE_STEPS = ['active', 'out-for-delivery', 'delivered']

function stepIndex(status) {
  const idx = TIMELINE_STEPS.indexOf(status)
  return idx === -1 ? -1 : idx
}

function isSideState(status) {
  return ['paused', 'cancelled', 'draft', 'completed'].includes(status)
}

const SIDE_STATE_LABELS = {
  paused:    'Paused',
  cancelled: 'Cancelled',
  draft:     'Draft',
  completed: 'Completed',
}

export default function TrackOrder() {
  const { orderId } = useParams()
  const navigate    = useNavigate()
  const { orders }  = useOrders()
  const [search,    setSearch]  = useState('')
  const [selected,  setSelected] = useState(
    () => orderId ? (orders.find(o => o.orderId === orderId) || null) : null
  )

  const lifetimeDels = orders.reduce((s, o) => s + (o.deliveriesCompleted || 0), 0)

  if (!selected) {
    const filtered = orders.filter(o =>
      o.status !== 'draft' &&
      (o.orderNickname.toLowerCase().includes(search.toLowerCase()) ||
       o.productName.toLowerCase().includes(search.toLowerCase()))
    )

    return (
      <PageWrapper page="track">
        <div className="page-content">
          <h1 className="track-title">Track Order</h1>
          <p className="track-subtitle">Your order's in good hands. Let's find it first.</p>

          <div className="form-group track-search">
            <label htmlFor="search" className="sr-only">Search orders</label>
            <div className="track-search__wrap">
              <IconSearch size={18} stroke={1.5} className="track-search__icon" aria-hidden="true" />
              <input id="search" type="search" placeholder="Search by name or product…"
                value={search} onChange={e => setSearch(e.target.value)} className="track-search__input" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="track-empty">No orders match that search.</p>
          ) : (
            <ul className="track-picker">
              {filtered.map(order => (
                <li key={order.orderId}>
                  <button className="track-picker__item card" onClick={() => setSelected(order)}>
                    <span className="track-picker__name">{order.orderNickname}</span>
                    <span className="track-picker__product data-text">{order.productName}</span>
                    <span className={`status-badge status-badge--${order.status}`}>{order.status.replace(/-/g,' ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageWrapper>
    )
  }

  const currentStep = stepIndex(selected.status)
  const sideState   = isSideState(selected.status)

  return (
    <PageWrapper page="track">
      <div className="page-content">
        <button className="track-back btn-secondary btn-sm" onClick={() => setSelected(null)}>
          ← Track a different order
        </button>

        <h1 className="track-title">{selected.orderNickname}</h1>
        <p className="track-reassure">Your order's in good hands. Here's exactly where it is.</p>

        {/* Side state badge */}
        {sideState && (
          <div className={`track-side-state status-badge status-badge--${selected.status}`} role="status">
            {SIDE_STATE_LABELS[selected.status] || selected.status}
          </div>
        )}

        {/* Timeline */}
        {!sideState && (
          <div className="track-timeline" role="list" aria-label="Order status timeline">
            {TIMELINE_STEPS.map((step, i) => {
              const isActive   = i === currentStep
              const isComplete = i < currentStep
              return (
                <div
                  key={step}
                  className={`track-step ${isActive ? 'track-step--active' : ''} ${isComplete ? 'track-step--complete' : ''}`}
                  role="listitem"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="track-step__dot" aria-hidden="true" />
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={`track-step__line ${isComplete ? 'track-step__line--done' : ''}`} aria-hidden="true" />
                  )}
                  <span className="track-step__label">{step.replace(/-/g, ' ')}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Stats grid */}
        <div className="track-stats card">
          <TrackStat label="Order ID"          value={selected.orderId.slice(0,8)} mono />
          <TrackStat label="Product"           value={selected.productName} />
          <TrackStat label="Store"             value={selected.storeName} />
          <TrackStat label="Date Created"      value={formatDate(selected.dateCreated)} mono />
          <TrackStat label="Expected Delivery" value={formatDate(selected.expectedDeliveryDate)} mono />
          <TrackStat label="Last Delivery"     value={formatDate(selected.lastDeliveryDate)} mono />
          <TrackStat label="Deliveries (this order)"   value={`${selected.deliveriesCompleted || 0} completed`} />
          <TrackStat label="Lifetime Deliveries (all orders)" value={`${lifetimeDels} total`} />
        </div>

        <div className="track-actions">
          <button className="btn-secondary" onClick={() => navigate(`/update/${selected.orderId}`)}>
            Update This Order
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}

function TrackStat({ label, value, mono }) {
  return (
    <div className="track-stat">
      <span className="track-stat__label">{label}</span>
      <span className={`track-stat__value ${mono ? 'data-text' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}
