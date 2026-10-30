import { motion, useReducedMotion } from 'motion/react'

const MotionTags = { h1: motion.h1, h2: motion.h2, p: motion.p, span: motion.span }

// Text printed as two ink passes: violet on top, yellow off-register beneath.
// The violet pass knocks out the yellow beneath so the lilac stays clean.
// `fine` swaps in the lighter ink for type under ~64px.
function RisoText({ as = 'h1', children, className = '', offset = [6, 5], delay = 0.2, fine = false }) {
  const Tag = MotionTags[as]
  const reduce = useReducedMotion()
  const [x, y] = offset
  const ink = fine ? 'ink-fine' : 'ink'

  return (
    <Tag
      className={`relative isolate ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={`${ink}-solid relative block text-violet`}>{children}</span>
      <motion.span
        aria-hidden="true"
        className={`${ink} absolute inset-0 -z-10 block text-yellow`}
        initial={reduce ? false : { x: x * 5, y: y * 4, opacity: 0 }}
        animate={{ x, y, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}

export default RisoText
