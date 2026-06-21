import { useState, useEffect } from 'react'
import './OfflineBanner.css'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const onOnline  = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="offline-banner" role="alert">
      <span>
        Looks like you're offline. We'll keep everything saved on this device until you're back.
      </span>
    </div>
  )
}
