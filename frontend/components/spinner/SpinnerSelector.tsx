'use client'

import { useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

export interface SpinnerItem { label: string; value: string; meta?: string }

interface SpinnerSelectorProps {
  items: SpinnerItem[]; onSelect?: (item: SpinnerItem) => void
  itemHeight?: number; visibleCount?: number
}

function buildLongList(items: SpinnerItem[], repeats: number): SpinnerItem[] {
  return Array.from({ length: repeats }, () => items).flat()
}

function yFromIndex(idx: number, itemH: number, containerH: number) {
  return -(idx * itemH) + (containerH - itemH) / 2
}

// Scale the label down as it gets longer so multi-word topics stay on one or
// two tight lines (reading as a single phrase) instead of wrapping with big gaps.
function fontSizeFor(label: string): string {
  const n = label.trim().length
  if (n <= 12) return 'clamp(1.45rem, 5vw, 1.95rem)'
  if (n <= 20) return 'clamp(1.2rem, 4vw, 1.55rem)'
  if (n <= 30) return 'clamp(1rem, 3.4vw, 1.25rem)'
  return 'clamp(0.85rem, 3vw, 1.05rem)'
}

export function SpinnerSelector({ items, onSelect, itemHeight=80, visibleCount=5 }: SpinnerSelectorProps) {
  const REPEATS    = 20
  const containerH = itemHeight * visibleCount
  const longList   = buildLongList(items, REPEATS)
  const midRepeat  = Math.floor(REPEATS / 2)
  const startIdx   = midRepeat * items.length

  const controls   = useAnimation()
  const isSpinning = useRef(false)
  const currentIdx = useRef(startIdx)
  const [selectedItem, setSelectedItem] = useState<SpinnerItem>(items[0])

  const spin = async () => {
    if (isSpinning.current) return
    isSpinning.current = true
    const targetItemIdx  = Math.floor(Math.random() * items.length)
    const loops          = 3 + Math.floor(Math.random() * 3)
    const targetLongIdx  = currentIdx.current + loops * items.length + targetItemIdx
    const targetY        = yFromIndex(targetLongIdx, itemHeight, containerH)
    await controls.start({ y: targetY, transition: { duration: 2.8 + Math.random() * 0.6, ease: [0.16, 1, 0.3, 1] } })
    currentIdx.current   = targetLongIdx
    const winner         = items[targetItemIdx]
    setSelectedItem(winner)
    onSelect?.(winner)
    isSpinning.current   = false
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>

      <div style={{ position:'relative', width:'100%', height:containerH, overflow:'hidden' }}>

        {/* Top fade */}
        <div className="spinner-fade-top" style={{ position:'absolute', insetInline:0, top:0, zIndex:10, pointerEvents:'none', height:itemHeight*2 }} />
        {/* Bottom fade */}
        <div className="spinner-fade-bottom" style={{ position:'absolute', insetInline:0, bottom:0, zIndex:10, pointerEvents:'none', height:itemHeight*2 }} />

        {/* Center highlight lines */}
        <div style={{ position:'absolute', insetInline:0, zIndex:20, pointerEvents:'none', top:(containerH-itemHeight)/2 }}>
          <div style={{ height:'1px', width:'100%', background:'hsl(var(--foreground) / 0.15)' }} />
          <div style={{ height:'1px', width:'100%', background:'hsl(var(--foreground) / 0.15)', marginTop:itemHeight-1 }} />
        </div>

        {/* Scrolling list */}
        <motion.div animate={controls} initial={{ y: yFromIndex(startIdx, itemHeight, containerH) }}>
          {longList.map((it, i) => {
            const isCenter = i === currentIdx.current
            return (
              <div key={i} style={{ height:itemHeight, display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none', overflow:'hidden', padding:'0 1.25rem' }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: fontSizeFor(it.label),
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  textAlign: 'center',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  color: isCenter ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.2)',
                  transition: 'color 0.3s',
                }}>
                  {it.label}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Spin button */}
      <motion.button onClick={spin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
        style={{ padding:'0.9rem 3rem', border:'1.5px solid hsl(var(--foreground))', background:'hsl(var(--foreground))', color:'hsl(var(--background))', fontSize:'0.85rem', letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}
        onMouseEnter={e=>{ const b=e.currentTarget; b.style.background='transparent'; b.style.color='hsl(var(--foreground))' }}
        onMouseLeave={e=>{ const b=e.currentTarget; b.style.background='hsl(var(--foreground))'; b.style.color='hsl(var(--background))' }}
      >
        Spin
      </motion.button>
    </div>
  )
}
