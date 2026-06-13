'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_\\/[]{}=+*^?#·:;~'

interface ScrambleTextProps {
  text: string
  /** total scramble duration in ms */
  duration?: number
  /** delay before the scramble starts */
  delay?: number
  className?: string
  style?: CSSProperties
}

/**
 * Resolves `text` out of random characters, "AI-lab" decode style.
 * Re-runs whenever `text` changes.
 */
export function ScrambleText({ text, duration = 900, delay = 0, className, style }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const raf = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        const revealed = Math.floor(p * text.length)
        let out = ''
        for (let i = 0; i < text.length; i++) {
          if (i < revealed || text[i] === ' ') out += text[i]
          else out += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
        setDisplay(out)
        if (p < 1) raf.current = requestAnimationFrame(tick)
        else setDisplay(text)
      }
      raf.current = requestAnimationFrame(tick)
    }

    if (delay > 0) timeout.current = setTimeout(run, delay)
    else run()

    return () => {
      cancelAnimationFrame(raf.current)
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [text, duration, delay])

  return (
    <span className={className} style={style}>
      {display}
    </span>
  )
}
