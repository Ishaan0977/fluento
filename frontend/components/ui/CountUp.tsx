'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: CSSProperties
}

/**
 * Animates a number from 0 to `value` with an ease-out curve on mount.
 */
export function CountUp({ value, duration = 1400, prefix = '', suffix = '', className, style }: CountUpProps) {
  const [n, setN] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else setN(value)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return (
    <span className={className} style={style}>
      {prefix}{n}{suffix}
    </span>
  )
}
