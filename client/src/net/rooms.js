import { socket } from "./socket";
import { clearRoom, setRoomId } from "../state/room";

const MESSAGES = {
  not_found: "No room with that code. Check it and try again.",
  full: "That room is full.",
  bad_name: "The server didn't accept your name. Go back and pick another.",
  already_in_room: "You're already in a room.",
  not_host: "Only the host can remove players.",
  not_in_room: "That player already left.",
};

async function ack(event, payload) {
  let res;
  try {
    res = await socket.timeout(5000).emitWithAck(event, payload);
  } catch {
    throw new Error("Can't reach the doodoo server. Try again in a moment.");
  }
  if (res.error) throw new Error(MESSAGES[res.error] ?? "Something went wrong.");
  return res;
}

async function enter(event, payload) {
  const { roomId } = await ack(event, payload);
  setRoomId(roomId);
  return roomId;
}

// Both resolve with the room code, or reject with a message ready to show.
export const createRoom = () => enter("room:create", {});
export const joinRoom = (roomId) => enter("room:join", { roomId });

// Host only. Rejects with a message ready to show.
export const kickPlayer = (playerId) => ack("room:kick", { playerId });

// Stays logged in, so the player can start or join another room right away.
export function leaveRoom() {
  socket.emit("room:leave");
  clearRoom();
}
