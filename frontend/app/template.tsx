'use client'

import { motion } from 'framer-motion'

/**
 * template.tsx re-mounts on every navigation, so this runs a "curtain rises"
 * wipe + content fade-in on each route change. Matches the black/white
 * inversion theme.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'hsl(var(--foreground))',
          transformOrigin: 'top',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  )
}
