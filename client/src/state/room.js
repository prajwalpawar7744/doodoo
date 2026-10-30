import { useSyncExternalStore } from "react";
import { socket } from "../net/socket";

// The room this socket is in, kept in sync with the server's `room:state`.
// Lives outside React because `room:state` arrives before the room page mounts.
let room = null;
const listeners = new Set();

function set(next) {
  room = next;
  listeners.forEach((fn) => fn());
}

// Start fresh for a new room; the server's first `room:state` fills in the rest
export function setRoomId(roomId) {
  set({ roomId });
}

export function clearRoom() {
  set(null);
}

socket.on("room:state", (state) => set({ ...room, ...state }));
socket.on("disconnect", () => set(null));
// Host removed us; the room page sees `kicked` and sends us back to /name
socket.on("room:kicked", () => set({ kicked: true }));

export function useRoom() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => room,
  );
}
