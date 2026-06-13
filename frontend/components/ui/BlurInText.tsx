'use client'

import { CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface BlurInTextProps {
  text: string
  /** delay before the first character animates (seconds) */
  delay?: number
  /** per-character stagger (seconds) */
  stagger?: number
  className?: string
  style?: CSSProperties
}

/**
 * Reveals text character-by-character from a blur. Spaces are preserved.
 */
export function BlurInText({ text, delay = 0, stagger = 0.035, className, style }: BlurInTextProps) {
  const chars = Array.from(text)
  return (
    <span className={className} style={style} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 16 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: delay + i * stagger, duration: 0.5, ease: 'easeOut' }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  )
}
