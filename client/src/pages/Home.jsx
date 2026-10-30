import { motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Arrow, Squiggle, Ticks, Underline } from '../components/riso/Doodles'
import PaperGround from '../components/riso/PaperGround'
import RisoText from '../components/riso/RisoText'
import StampButton from '../components/riso/StampButton'

function Home() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()

  return (
    <PaperGround className="grid place-items-center px-4">
      <Squiggle delay={1.1} className="absolute top-[10%] left-[6%] w-28 -rotate-12 md:w-44" />
      <Squiggle delay={1.25} className="absolute right-[5%] bottom-[10%] w-24 rotate-[165deg] md:w-40" />

      <div className="relative flex w-full flex-col items-center pb-[4vh]">
        <RisoText className="font-display text-[clamp(5.5rem,24vw,22rem)] leading-[0.8] tracking-[-0.02em] select-none" offset={[9, 7]}>
          doodoo
        </RisoText>
        <Underline delay={0.7} className="-mt-[1vw] h-[clamp(1.25rem,3vw,2.75rem)] w-[min(86vw,1150px)]" />

        <motion.div
          className="relative mt-10 md:mt-14"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Arrow delay={1.0} className="absolute top-1/2 right-full mr-3 hidden w-32 -translate-y-3/4 sm:block md:w-40" />
          <StampButton onClick={() => setTimeout(() => navigate('/name'), 160)}>Hop in &amp; doodle!</StampButton>
          <Ticks delay={1.5} className="absolute top-1/2 left-full ml-4 w-8 -translate-y-1/2 md:w-10" />
        </motion.div>
      </div>
    </PaperGround>
  )
}

export default Home
