import { Check, Copy, Crown, DoorOpen, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Squiggle } from "../components/riso/Doodles";
import PaperGround from "../components/riso/PaperGround";
import RisoText from "../components/riso/RisoText";
import { kickPlayer, leaveRoom } from "../net/rooms";
import { socket } from "../net/socket";
import { useRoom } from "../state/room";

const MIN_PLAYERS = 2;

function Room() {
  const { roomId } = useParams();
  const room = useRoom();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [confirmKick, setConfirmKick] = useState(null);
  const [kickError, setKickError] = useState(null);

  if (room?.kicked) {
    return (
      <Navigate
        to="/name"
        replace
        state={{ notice: "The host removed you from the room." }}
      />
    );
  }
  // No live connection to this room (e.g. after a refresh): go pick a name again
  if (!room || room.roomId !== roomId) return <Navigate to="/name" replace />;
  // Joined, but the first player list hasn't arrived yet
  if (!room.players) return <PaperGround />;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked; the code is still on screen
    }
  }

  function leave() {
    leaveRoom();
    navigate("/name", { replace: true });
  }

  async function kick(player) {
    setConfirmKick(null);
    setKickError(null);
    try {
      await kickPlayer(player.id);
    } catch (err) {
      setKickError(err.message);
    }
  }

  const isHost = room.hostId === socket.id;
  const waiting = room.players.length < MIN_PLAYERS;

  return (
    <PaperGround className="flex flex-col px-5 py-6 md:px-12 md:py-10">
      <Squiggle
        delay={0.9}
        className="absolute right-[4%] bottom-[8%] w-28 rotate-[170deg] md:w-44"
      />

      <header className="flex items-center justify-between gap-4">
        <Link to="/" aria-label="doodoo home">
          <RisoText
            as="span"
            fine
            className="font-display text-4xl leading-none md:text-5xl"
            offset={[3, 3]}
          >
            doodoo
          </RisoText>
        </Link>
        <button
          type="button"
          onClick={leave}
          className="inline-flex cursor-pointer items-center gap-2 font-bold text-muted underline underline-offset-4 hover:text-ink"
        >
          <DoorOpen className="size-5" aria-hidden="true" />
          Leave room
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 pb-[8vh]">
        <div>
          <p className="text-lg font-bold text-muted">Room code</p>
          <div className="mt-1 flex flex-wrap items-center gap-5">
            <h1>
              <RisoText
                as="span"
                className="font-display text-[clamp(3.5rem,12vw,7rem)] leading-none tracking-[0.06em]"
                offset={[6, 5]}
              >
                {roomId}
              </RisoText>
            </h1>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex cursor-pointer items-center gap-2 font-bold text-violet underline underline-offset-4 hover:text-ink"
            >
              {copied ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Copy className="size-5" aria-hidden="true" />
              )}
              <span aria-live="polite">{copied ? "Copied!" : "Copy code"}</span>
            </button>
          </div>
          <p className="mt-5 text-lg text-muted">
            Send this code to your friends so they can join.
          </p>
        </div>

        <section aria-labelledby="players-heading">
          <h2 id="players-heading" className="text-lg font-bold">
            Players ({room.players.length})
          </h2>
          <ul className="mt-3 flex flex-wrap items-center gap-3">
            <AnimatePresence initial={false}>
              {room.players.map((p, i) => {
                const me = p.id === socket.id;
                const canKick = isHost && !me;
                const confirming = confirmKick === p.id;
                return (
                  <motion.li
                    key={p.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
                    animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 1.5 : -1.5 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative isolate inline-flex items-center gap-2 py-2 pr-2 pl-4 text-xl font-extrabold"
                  >
                    <span
                      aria-hidden="true"
                      className={`ink absolute inset-0 -z-10 rounded-[6px] ${me ? "bg-yellow" : "bg-violet/15"}`}
                    />
                    {p.id === room.hostId && (
                      <Crown className="size-5 text-violet" aria-label="Host" />
                    )}
                    {p.name}
                    {me && (
                      <span className="pr-2 text-base font-bold text-muted">
                        (you)
                      </span>
                    )}
                    {canKick && !confirming && (
                      <button
                        type="button"
                        onClick={() => setConfirmKick(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="grid size-8 cursor-pointer place-items-center rounded-full text-muted hover:bg-violet/15 hover:text-ink"
                      >
                        <X className="size-5" aria-hidden="true" />
                      </button>
                    )}
                    {confirming && (
                      <span className="flex items-center gap-1 pl-1 text-base">
                        <span className="font-bold text-muted">Remove?</span>
                        <button
                          type="button"
                          autoFocus
                          onClick={() => kick(p)}
                          className="cursor-pointer rounded-[4px] bg-violet px-2 py-0.5 font-bold text-white"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmKick(null)}
                          className="cursor-pointer px-2 py-0.5 font-bold text-muted underline underline-offset-4 hover:text-ink"
                        >
                          No
                        </button>
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
            {waiting && <EmptySeat reduce={reduce} />}
          </ul>
          <p role="alert" className="mt-3 font-bold text-violet">
            {kickError}
          </p>
        </section>

        <p role="status" className="text-lg text-muted">
          {waiting
            ? "Waiting for friends to join…"
            : isHost
              ? "Everyone's here? Starting the game is coming soon."
              : "Waiting for the host to start the game."}
        </p>
      </div>
    </PaperGround>
  );
}

// A dashed, pulsing seat that says "someone goes here"
function EmptySeat({ reduce }) {
  return (
    <motion.li
      aria-hidden="true"
      className="inline-flex items-center rounded-[6px] border-2 border-dashed border-violet/40 px-4 py-2 text-xl font-extrabold text-violet/50"
      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      your friend?
    </motion.li>
  );
}

export default Room;
