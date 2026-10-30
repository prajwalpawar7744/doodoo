import { motion, useReducedMotion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1]

// Shared draw-on timing; delay staggers each doodle. Reduced motion shows the finished stroke.
const draw = (reduce, delay, duration = 0.7) => ({
  initial: reduce ? false : { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration, delay, ease }, opacity: { duration: 0.1, delay } },
})

const stroke = (color, width) => ({
  stroke: `var(--color-${color})`,
  strokeWidth: width,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
})

export function Squiggle({ className = '', delay = 0, color = 'yellow' }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 160 40" aria-hidden="true" className={`ink-edge mix-blend-multiply ${className}`}>
      <motion.path {...draw(reduce, delay)} {...stroke(color, 8)} d="M6 26c12-20 24-20 30 0s20 20 30 0 22-20 30 0 22 20 30 0 18-14 26-6" />
      <motion.path {...draw(reduce, delay + 0.05)} {...stroke(color, 3)} d="M10 30c12-18 22-18 28 0s20 18 30 0 22-18 30 0 22 18 30 0" />
    </svg>
  )
}

export function Arrow({ className = '', delay = 0, color = 'yellow' }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 140 80" aria-hidden="true" className={`ink-edge mix-blend-multiply ${className}`}>
      <motion.path {...draw(reduce, delay)} {...stroke(color, 7)} d="M6 14c26-8 50 2 56 20 5 15-8 24-16 16-8-9 6-22 26-14 18 7 34 22 58 26" />
      <motion.path {...draw(reduce, delay + 0.6, 0.25)} {...stroke(color, 7)} d="M114 48l18 14-22 8" />
    </svg>
  )
}

export function Underline({ className = '', delay = 0, color = 'yellow' }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true" className={`ink-edge mix-blend-multiply ${className}`}>
      <motion.path {...draw(reduce, delay, 0.8)} {...stroke(color, 14)} d="M10 24c90-14 200-18 300-12s180 8 280-6" />
      <motion.path {...draw(reduce, delay + 0.15, 0.7)} {...stroke(color, 6)} d="M40 34c120-10 260-12 420-6" />
    </svg>
  )
}

export function Ticks({ className = '', delay = 0, color = 'violet' }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 50 60" aria-hidden="true" className={`ink-edge mix-blend-multiply ${className}`}>
      <motion.path {...draw(reduce, delay, 0.2)} {...stroke(color, 5)} d="M10 10l12 12" />
      <motion.path {...draw(reduce, delay + 0.1, 0.2)} {...stroke(color, 5)} d="M6 32h16" />
      <motion.path {...draw(reduce, delay + 0.2, 0.2)} {...stroke(color, 5)} d="M10 52l12-11" />
    </svg>
  )
}
