import { motion } from 'motion/react'

const inks = {
  violet: { top: 'bg-violet', under: 'bg-yellow', text: 'text-white' },
  yellow: { top: 'bg-yellow', under: 'bg-violet', text: 'text-ink' },
}

// A rubber-stamped button: two textured ink blocks that snap into register when pressed
function StampButton({ children, ink = 'violet', tilt = -1.5, className = '', ...props }) {
  const { top, under, text } = inks[ink]

  return (
    <motion.button
      className={`relative isolate cursor-pointer px-8 py-3.5 font-sans text-xl font-extrabold disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl ${text} ${className}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap="press"
      variants={{
        rest: { rotate: tilt, scale: 1 },
        hover: { rotate: tilt - 1, scale: 1.03 },
        press: { rotate: 0, scale: 0.97 },
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className={`ink absolute inset-0 -z-20 rounded-[6px] ${under}`}
        variants={{
          rest: { x: 7, y: 6 },
          hover: { x: 9, y: 8 },
          press: { x: 0, y: 0 },
        }}
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
      <span aria-hidden="true" className={`ink-solid absolute inset-0 -z-10 rounded-[6px] ${top}`} />
      {children}
    </motion.button>
  )
}

export default StampButton
