'use client'

interface MarqueeProps {
  items: string[]
  /** seconds for one full loop */
  speed?: number
  reverse?: boolean
}

/**
 * Seamless scrolling ticker band. Content is duplicated so the loop is gapless.
 */
export function Marquee({ items, speed = 22, reverse = false }: MarqueeProps) {
  const loop = [...items, ...items]
  return (
    <div className="marquee" aria-hidden>
      <div
        className="marquee__track"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {loop.map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
