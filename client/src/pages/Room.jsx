import { Check, Copy, Crown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Squiggle } from "../components/riso/Doodles";
import PaperGround from "../components/riso/PaperGround";
import RisoText from "../components/riso/RisoText";
import { socket } from "../net/socket";
import { useRoom } from "../state/room";

function Room() {
  const { roomId } = useParams();
  const room = useRoom();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // No live connection to this room (e.g. after a refresh): go pick a name again
  if (!room || room.roomId !== roomId) return <Navigate to="/name" replace />;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked; the code is still on screen
    }
  }

  const isHost = room.hostId === socket.id;

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
          <ul className="mt-3 flex flex-wrap gap-3">
            {room.players.map((p, i) => (
              <motion.li
                key={p.id}
                initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 1.5 : -1.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative isolate inline-flex items-center gap-2 px-4 py-2 text-xl font-extrabold"
              >
                <span
                  aria-hidden="true"
                  className={`ink absolute inset-0 -z-10 rounded-[6px] ${p.id === socket.id ? "bg-yellow" : "bg-violet/15"}`}
                />
                {p.id === room.hostId && (
                  <Crown className="size-5 text-violet" aria-label="Host" />
                )}
                {p.name}
                {p.id === socket.id && (
                  <span className="text-base font-bold text-muted">(you)</span>
                )}
              </motion.li>
            ))}
          </ul>
        </section>

        <p role="status" className="text-lg text-muted">
          {isHost
            ? "You're the host. Starting the game is coming soon."
            : "Waiting for the host to start the game."}
        </p>
      </div>
    </PaperGround>
  );
}

export default Room;
