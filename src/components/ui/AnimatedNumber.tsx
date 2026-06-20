'use client'
import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

interface Props {
  value: number
  className?: string
  duration?: number
}

export default function AnimatedNumber({ value, className, duration = 1 }: Props) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: latest => setDisplay(Math.round(latest)),
    })
    prevValue.current = value
    return () => controls.stop()
  }, [value, duration])

  return <span className={className}>{display}</span>
}
