import './PageWrapper.css'

export default function PageWrapper({ page, children, className = '' }) {
  return (
    <div className={`page-wrapper page-${page} ${className}`}>
      {children}
    </div>
  )
}
