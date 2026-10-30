import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
});

// Connects with the nickname; resolves with the server's `{ id, nickname }`.
// Rejects with Error('bad_nickname') or Error('offline').
export function login(nickname, timeout = 6000) {
  return new Promise((resolve, reject) => {
    const done = (fn, value) => {
      clearTimeout(timer);
      socket.off("auth:ok", onOk);
      socket.off("connect_error", onError);
      fn(value);
    };
    const onOk = (user) => done(resolve, user);
    const onError = (err) => {
      socket.disconnect();
      done(
        reject,
        new Error(err.message === "bad_nickname" ? "bad_nickname" : "offline"),
      );
    };
    const timer = setTimeout(() => onError(new Error("timeout")), timeout);

    socket.disconnect();
    socket.auth = { nickname };
    socket.once("auth:ok", onOk);
    socket.once("connect_error", onError);
    socket.connect();
  });
}
