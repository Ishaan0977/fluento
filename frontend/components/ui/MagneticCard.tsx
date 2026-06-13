'use client'

import Link from 'next/link'
import { useRef, type MouseEvent } from 'react'

export interface Mode {
  num: string
  title: string
  desc: string
  href: string
}

/**
 * Home mode tile with three composed pointer effects:
 *  - magnetic: the card drifts toward the cursor
 *  - 3D tilt: the card tips in perspective toward the pointer
 *  - glare: a soft highlight tracks the cursor across the surface
 * Snaps back smoothly on mouse leave. The black/white inversion + pop
 * shadow still come from the `.mode-card` CSS.
 */
export function MagneticCard({ mode }: { mode: Mode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  const onMove = (e: MouseEvent) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const dx = px - 0.5
    const dy = py - 0.5

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      if (linkRef.current) {
        linkRef.current.style.transform =
          `perspective(900px) translate3d(${dx * 16}px, ${dy * 16}px, 0) ` +
          `rotateX(${-dy * 11}deg) rotateY(${dx * 11}deg) scale(1.04)`
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '1'
        glareRef.current.style.background =
          `radial-gradient(circle at ${px * 100}% ${py * 100}%, hsl(var(--background) / 0.4), transparent 45%)`
      }
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(raf.current)
    if (linkRef.current) linkRef.current.style.transform = ''
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: '900px' }}>
      <Link
        ref={linkRef}
        href={mode.href}
        className="mode-card"
        data-cursor="grow"
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), background 0.3s ease, box-shadow 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <span className="card-num" style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          {mode.num}
        </span>
        <h2 className="card-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '0.75rem' }}>
          {mode.title}
        </h2>
        <p className="card-desc" style={{ fontSize: '0.95rem', lineHeight: 1.65 }}>
          {mode.desc}
        </p>
        <div className="card-cta" style={{ marginTop: '2rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Start →
        </div>
        <div
          ref={glareRef}
          aria-hidden
          style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
        />
      </Link>
    </div>
  )
}
