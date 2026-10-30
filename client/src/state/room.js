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

export function setRoomId(roomId) {
  set({ ...room, roomId });
}

socket.on("room:state", (state) => set({ ...room, ...state }));
socket.on("disconnect", () => set(null));

export function useRoom() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => room,
  );
}
