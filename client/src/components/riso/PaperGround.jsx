import { MotionConfig } from 'motion/react'
import InkFilters from './InkFilters'

// Uncoated paper sheet every page is printed on
function PaperGround({ children, className = '' }) {
  return (
    <MotionConfig reducedMotion="user">
      <main className={`paper relative min-h-screen overflow-hidden ${className}`}>
        <InkFilters />
        {children}
      </main>
    </MotionConfig>
  )
}

export default PaperGround
