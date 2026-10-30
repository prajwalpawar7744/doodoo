import { socket } from "./socket";
import { setRoomId } from "../state/room";

const MESSAGES = {
  not_found: "No room with that code. Check it and try again.",
  full: "That room is full.",
  bad_name: "The server didn't accept your name. Go back and pick another.",
  already_in_room: "You're already in a room.",
};

async function request(event, payload) {
  let res;
  try {
    res = await socket.timeout(5000).emitWithAck(event, payload);
  } catch {
    throw new Error("Can't reach the doodoo server. Try again in a moment.");
  }
  if (res.error) throw new Error(MESSAGES[res.error] ?? "Something went wrong.");
  setRoomId(res.roomId);
  return res.roomId;
}

// Both resolve with the room code, or reject with a message ready to show.
export const createRoom = () => request("room:create", {});
export const joinRoom = (roomId) => request("room:join", { roomId });
