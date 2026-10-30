import { AnimatePresence, motion } from "motion/react";
import { useId, useState, useSyncExternalStore } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Squiggle } from "../components/riso/Doodles";
import PaperGround from "../components/riso/PaperGround";
import RisoText from "../components/riso/RisoText";
import StampButton from "../components/riso/StampButton";
import { load, save } from "../lib/storage";
import { createRoom, joinRoom } from "../net/rooms";
import { login, socket } from "../net/socket";

const NAME_KEY = "doodoo:name";
const MIN = 1;
const MAX = 20;
const ease = [0.16, 1, 0.3, 1];

function validate(name) {
  const trimmed = name.trim();
  if (trimmed.length < MIN) return "Type a name first.";
  if (trimmed.length > MAX) return `Keep it to ${MAX} characters.`;
  return null;
}

function Name() {
  const [name, setName] = useState(() => load(NAME_KEY) ?? "");
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(0);
  // Still logged in (left or was removed from a room): skip straight to the choices
  const [step, setStep] = useState(() => (socket.connected ? "choose" : "name"));
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [roomError, setRoomError] = useState(null);
  const navigate = useNavigate();
  const notice = useLocation().state?.notice;
  const narrow = useNarrow();
  const nameId = useId();
  const codeId = useId();

  function fail(message) {
    setError(message);
    setShake((n) => n + 1);
  }

  async function submitName(e) {
    e.preventDefault();
    if (pending) return;
    const problem = validate(name);
    if (problem) return fail(problem);

    setError(null);
    setPending(true);
    try {
      const user = await login(name.trim());
      setName(user.nickname);
      save(NAME_KEY, user.nickname);
      setStep("choose");
    } catch (err) {
      fail(
        err.message === "bad_nickname"
          ? "That name didn't work. Try another one."
          : "Can't reach the doodoo server. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  async function enterRoom(request) {
    if (pending) return;
    setRoomError(null);
    setPending(true);
    try {
      const roomId = await request();
      navigate(`/room/${roomId}`);
    } catch (err) {
      setRoomError(err.message);
      setPending(false);
    }
  }

  function submitCode(e) {
    e.preventDefault();
    if (code) enterRoom(() => joinRoom(code));
  }

  function goTo(next) {
    setRoomError(null);
    setStep(next);
  }

  return (
    <PaperGround className="flex flex-col px-5 py-6 md:px-12 md:py-10">
      <Squiggle
        delay={0.9}
        className="absolute right-[4%] bottom-[8%] w-28 rotate-[170deg] md:w-44"
      />

      <Link to="/" aria-label="doodoo home" className="self-start">
        <RisoText
          as="span"
          fine
          className="font-display text-4xl leading-none md:text-5xl"
          offset={[3, 3]}
        >
          doodoo
        </RisoText>
      </Link>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center pb-[8vh]">
        {notice && <ErrorNote message={notice} className="mb-8 self-start" />}
        <form onSubmit={submitName} noValidate>
          <h1>
            <label htmlFor={nameId} className="block">
              <RisoText
                as="span"
                fine={narrow}
                className="font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95]"
                offset={[5, 4]}
              >
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
                  setName(e.target.value);
                  if (error) setError(null);
                  if (step !== "name") setStep("name");
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
            {step === "name" && (
              <StampButton
                type="submit"
                className="shrink-0"
                disabled={pending}
              >
                {pending ? "Checking…" : "That's me!"}
              </StampButton>
            )}
          </div>

          <div className="mt-4 min-h-9">
            <p
              id={`${nameId}-error`}
              role="alert"
              className={`relative isolate inline-block font-bold text-violet ${error ? "px-3 py-1" : ""}`}
            >
              {error && (
                <span
                  aria-hidden="true"
                  className="ink absolute inset-0 -z-10 -rotate-1 bg-yellow"
                />
              )}
              {error}
            </p>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {step === "choose" && (
            <motion.div
              key="choose"
              className="mt-6 flex flex-wrap items-center gap-6"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              <p className="w-full text-lg text-muted">
                Nice to meet you, <strong className="text-ink">{name}</strong>.
                What now?
              </p>
              <Reveal>
                <StampButton
                  autoFocus
                  disabled={pending}
                  onClick={() => enterRoom(createRoom)}
                >
                  {pending ? "Making a room…" : "Start a room"}
                </StampButton>
              </Reveal>
              <Reveal>
                <StampButton
                  ink="yellow"
                  tilt={1.5}
                  disabled={pending}
                  onClick={() => goTo("join")}
                >
                  Join with code
                </StampButton>
              </Reveal>
              <ErrorNote message={roomError} />
            </motion.div>
          )}

          {step === "join" && (
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
                    onChange={(e) =>
                      setCode(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                      )
                    }
                    maxLength={6}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    className="peer w-full bg-transparent pb-2 font-sans text-3xl font-bold tracking-[0.2em] text-ink caret-violet outline-none"
                  />
                  <span
                    aria-hidden="true"
                    className="ink block h-1.25 rounded-full bg-yellow transition-[height] duration-200 peer-focus:h-2"
                  />
                </div>
                <StampButton
                  type="submit"
                  ink="yellow"
                  tilt={1.5}
                  disabled={!code || pending}
                >
                  {pending ? "Joining…" : "Join"}
                </StampButton>
              </div>
              <ErrorNote message={roomError} className="mt-3" />
              <button
                type="button"
                onClick={() => goTo("choose")}
                className="mt-4 block cursor-pointer font-bold text-muted underline underline-offset-4 hover:text-ink"
              >
                Back
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </div>
    </PaperGround>
  );
}

// The heading drops below ~64px on phones, where it needs the fine ink
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia("(max-width: 639px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => matchMedia("(max-width: 639px)").matches,
  );
}

function ErrorNote({ message, className = "" }) {
  return (
    <p
      role="alert"
      className={`relative isolate inline-block font-bold text-violet ${message ? "px-3 py-1" : ""} ${className}`}
    >
      {message && (
        <span
          aria-hidden="true"
          className="ink absolute inset-0 -z-10 -rotate-1 bg-yellow"
        />
      )}
      {message}
    </p>
  );
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
  );
}

export default Name;
