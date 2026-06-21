import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './VoltronTransition.css'

const BAR_COLORS = ['#C9A84C', '#CC3333', '#3A8EDF', '#33AA55', '#DDB830']

export default function VoltronTransition() {
  const location = useLocation()
  const prevPath  = useRef(location.pathname)
  const [phase, setPhase] = useState('idle')
  const timerRef = useRef(null)

  useEffect(() => {
    if (location.pathname === prevPath.current) return
    prevPath.current = location.pathname

    clearTimeout(timerRef.current)
    setPhase('assembling')
  }, [location.pathname])

  function handleAssembleEnd() {
    if (phase !== 'assembling') return
    setPhase('assembled')
    timerRef.current = setTimeout(() => setPhase('disassembling'), 80)
  }

  function handleDisassembleEnd() {
    if (phase !== 'disassembling') return
    setPhase('idle')
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  if (phase === 'idle') return null

  return (
    <div
      className={`voltron-overlay voltron-overlay--${phase}`}
      aria-hidden="true"
      onAnimationEnd={phase === 'assembling' ? handleAssembleEnd : handleDisassembleEnd}
    >
      {BAR_COLORS.map((color, i) => (
        <div
          key={i}
          className="voltron-bar"
          style={{ '--bar-color': color, '--bar-delay': `${i * 40}ms` }}
        />
      ))}
    </div>
  )
}
