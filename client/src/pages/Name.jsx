import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { Squiggle } from '../components/riso/Doodles'
import PaperGround from '../components/riso/PaperGround'
import RisoText from '../components/riso/RisoText'
import StampButton from '../components/riso/StampButton'
import { load, save } from '../lib/storage'

const NAME_KEY = 'doodoo:name'
const MIN = 2
const MAX = 16
const ease = [0.16, 1, 0.3, 1]

function validate(name) {
  const trimmed = name.trim()
  if (trimmed.length < MIN) return `Name needs at least ${MIN} characters.`
  if (trimmed.length > MAX) return `Keep it to ${MAX} characters.`
  return null
}

function Name() {
  const [name, setName] = useState(() => load(NAME_KEY) ?? '')
  const [error, setError] = useState(null)
  const [shake, setShake] = useState(0)
  const [step, setStep] = useState('name')
  const [code, setCode] = useState('')
  const narrow = useNarrow()
  const nameId = useId()
  const codeId = useId()

  function submitName(e) {
    e.preventDefault()
    const problem = validate(name)
    setError(problem)
    if (problem) {
      setShake((n) => n + 1)
      return
    }
    setName(name.trim())
    save(NAME_KEY, name.trim())
    setStep('choose')
  }

  function submitCode(e) {
    e.preventDefault()
    if (code) setStep('soon')
  }

  return (
    <PaperGround className="flex flex-col px-5 py-6 md:px-12 md:py-10">
      <Squiggle delay={0.9} className="absolute right-[4%] bottom-[8%] w-28 rotate-[170deg] md:w-44" />

      <Link to="/" aria-label="doodoo home" className="self-start">
        <RisoText as="span" fine className="font-display text-4xl leading-none md:text-5xl" offset={[3, 3]}>
          doodoo
        </RisoText>
      </Link>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center pb-[8vh]">
        <form onSubmit={submitName} noValidate>
          <h1>
            <label htmlFor={nameId} className="block">
              <RisoText as="span" fine={narrow} className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95]" offset={[5, 4]}>
                What should we call you?
              </RisoText>
            </label>
          </h1>

          <div className="relative mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-4">
            <motion.div
              key={shake}
              className="w-full flex-1"
              animate={shake ? { x: [0, -10, 9, -6, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                id={nameId}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                  if (step !== 'name') setStep('name')
                }}
                maxLength={MAX}
                autoFocus
                autoComplete="nickname"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${nameId}-error` : undefined}
                className="peer w-full bg-transparent pb-2 font-sans text-3xl font-bold text-ink caret-violet outline-none md:text-4xl"
              />
              <span
                aria-hidden="true"
                className="ink block h-1.25 origin-left rounded-full bg-violet transition-[height] duration-200 peer-focus:h-2"
              />
            </motion.div>
            {step === 'name' && (
              <StampButton type="submit" className="shrink-0">
                That's me!
              </StampButton>
            )}
          </div>

          <div className="mt-4 min-h-9">
            <p id={`${nameId}-error`} role="alert" className={`relative isolate inline-block font-bold text-violet ${error ? 'px-3 py-1' : ''}`}>
              {error && <span aria-hidden="true" className="ink absolute inset-0 -z-10 -rotate-1 bg-yellow" />}
              {error}
            </p>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {step === 'choose' && (
            <motion.div
              key="choose"
              className="mt-6 flex flex-wrap items-center gap-6"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              <p className="w-full text-lg text-muted">
                Nice to meet you, <strong className="text-ink">{name}</strong>. What now?
              </p>
              <Reveal>
                <StampButton autoFocus onClick={() => setStep('soon')}>
                  Start a room
                </StampButton>
              </Reveal>
              <Reveal>
                <StampButton ink="yellow" tilt={1.5} onClick={() => setStep('join')}>
                  Join with code
                </StampButton>
              </Reveal>
            </motion.div>
          )}

          {step === 'join' && (
            <motion.form
              key="join"
              onSubmit={submitCode}
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease }}
            >
              <label htmlFor={codeId} className="text-lg font-bold">
                Room code
              </label>
              <div className="mt-2 flex items-end gap-4">
                <div className="flex-1">
                  <input
                    id={codeId}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    maxLength={8}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    className="peer w-full bg-transparent pb-2 font-sans text-3xl font-bold tracking-[0.2em] text-ink caret-violet outline-none"
                  />
                  <span aria-hidden="true" className="ink block h-1.25 rounded-full bg-yellow transition-[height] duration-200 peer-focus:h-2" />
                </div>
                <StampButton type="submit" ink="yellow" tilt={1.5} disabled={!code}>
                  Join
                </StampButton>
              </div>
              <button type="button" onClick={() => setStep('choose')} className="mt-4 cursor-pointer font-bold text-muted underline underline-offset-4 hover:text-ink">
                Back
              </button>
            </motion.form>
          )}

          {step === 'soon' && (
            <motion.div
              key="soon"
              className="mt-6"
              initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
              animate={{ opacity: 1, rotate: -1.5, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p role="status" className="relative isolate inline-block px-4 py-2 text-lg font-bold">
                <span aria-hidden="true" className="ink absolute inset-0 -z-10 bg-yellow" />
                Rooms are coming soon. Hang tight, {name}!
              </p>
              <button type="button" onClick={() => setStep('choose')} className="mt-4 block cursor-pointer font-bold text-muted underline underline-offset-4 hover:text-ink">
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PaperGround>
  )
}

// The heading drops below ~64px on phones, where it needs the fine ink
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia('(max-width: 639px)')
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => matchMedia('(max-width: 639px)').matches,
  )
}

function Reveal({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}

export default Name
