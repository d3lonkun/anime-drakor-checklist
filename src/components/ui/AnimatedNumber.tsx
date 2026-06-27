'use client'
import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

export default function AnimatedNumber({ value, className, duration = 1 }: { value: number; className?: string; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const c = animate(prev.current, value, { duration, ease: 'easeOut', onUpdate: v => setDisplay(Math.round(v)) })
    prev.current = value
    return () => c.stop()
  }, [value, duration])
  return <span className={className}>{display}</span>
}
