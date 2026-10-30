import { motion, MotionConfig, useAnimationControls } from 'motion/react'

const ease = [0.16, 1, 0.3, 1]

// One draw-on timing for every doodle; delay staggers them after the logo prints
const draw = (delay) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.7, delay, ease }, opacity: { duration: 0.1, delay } },
})

function Home() {
  const arrow = useAnimationControls()

  return (
    <MotionConfig reducedMotion="user">
      <main className="riso-grain relative grid min-h-screen place-items-center overflow-hidden px-4">
        <Squiggle delay={0.9} className="absolute top-[12%] left-[8%] w-28 rotate-[-12deg] md:w-40" />
        <Star delay={1.05} className="absolute right-[10%] top-[18%] w-14 rotate-12 md:w-20" />
        <Squiggle delay={1.2} className="absolute right-[6%] bottom-[14%] w-24 rotate-[160deg] md:w-36" />
        <Star delay={1.35} className="absolute bottom-[20%] left-[14%] w-10 -rotate-6 md:w-14" />

        <div className="relative flex flex-col items-center gap-12 pb-[6vh] md:gap-16">
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="riso-layers font-display text-[clamp(5rem,23vw,13rem)] leading-[0.85] tracking-[-0.02em] text-violet select-none"
          >
            doodoo
            <motion.span
              aria-hidden="true"
              className="riso-under text-yellow"
              initial={{ x: 34, y: 22, opacity: 0 }}
              animate={{ x: 6, y: 5, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.25 }}
            >
              doodoo
            </motion.span>
          </motion.h1>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
          >
            <motion.div
              animate={arrow}
              className="absolute top-2 -left-32 hidden w-28 sm:block md:-left-40 md:w-32"
            >
              <Arrow delay={1.0} />
            </motion.div>
            <motion.button
              type="button"
              className="riso-layers cursor-pointer rounded-full px-10 py-4 font-sans text-xl font-extrabold text-white md:text-2xl"
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              whileTap="press"
              variants={{
                rest: { rotate: 0, scale: 1 },
                hover: { rotate: -2, scale: 1.03 },
                press: { rotate: 0, scale: 0.97 },
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
              onHoverStart={() => arrow.start({ x: [0, 10, 0], transition: { duration: 0.6, ease } })}
            >
              <motion.span
                aria-hidden="true"
                className="riso-under rounded-full bg-yellow"
                variants={{
                  rest: { x: 7, y: 7 },
                  hover: { x: 9, y: 9 },
                  press: { x: 0, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-violet" />
              Hop in &amp; doodle!
            </motion.button>
          </motion.div>
        </div>
      </main>
    </MotionConfig>
  )
}

function Arrow({ delay }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true" className="w-full">
      <motion.path
        {...draw(delay)}
        d="M8 12c22-6 52 0 62 22 7 16-6 28-16 20-9-8 4-24 22-18 15 5 24 20 30 36"
        stroke="var(--color-yellow)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <motion.path
        {...draw(delay + 0.55)}
        d="M92 64l14 10 2-17"
        stroke="var(--color-yellow)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Squiggle({ className, delay }) {
  return (
    <svg viewBox="0 0 160 40" fill="none" aria-hidden="true" className={`mix-blend-multiply ${className}`}>
      <motion.path
        {...draw(delay)}
        d="M6 26c12-20 24-20 30 0s20 20 30 0 22-20 30 0 22 20 30 0 18-14 26-6"
        stroke="var(--color-yellow)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Star({ className, delay }) {
  return (
    <motion.svg
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      className={`mix-blend-multiply ${className}`}
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
    >
      <path
        d="M30 6c2 12 6 20 24 24-16 3-21 9-24 24-3-15-8-21-24-24 17-4 22-12 24-24z"
        fill="var(--color-lilac)"
      />
    </motion.svg>
  )
}

export default Home
