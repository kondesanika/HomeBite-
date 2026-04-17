import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const socket = io(API_URL);

socket.on("connect", () => {
  console.log("Connected to Real-time Backend ✓");
});

socket.on("connect_error", (err) => {
  console.error("Connection Error:", err.message);
});

let currentDB = {
  students: [],
  inventory: [],
  offers: [],
  notifications: [],
  users: []
};
const listeners = new Set();

socket.on("init", (data) => {
  currentDB = data;
  listeners.forEach(cb => cb(currentDB));
});

socket.on("sync", ({ key, value }) => {
  currentDB[key] = value;
  listeners.forEach(cb => cb(currentDB));
});

export const db = {
  get: (key) => currentDB[key],

  set: (key, value) => {
    currentDB[key] = value;
    socket.emit("update", { key, value });
    listeners.forEach(cb => cb(currentDB));
  },

  subscribe: (callback) => {
    listeners.add(callback);
    if (Object.keys(currentDB).length > 0) callback(currentDB);
    return () => listeners.delete(callback);
  },

  // Real-time Authentication
  login: (username, password) => {
    return new Promise((resolve) => {
      socket.emit("login", { username, password }, (res) => {
        resolve(res);
      });
    });
  },

  signup: (userData) => {
    return new Promise((resolve) => {
      socket.emit("signup", userData, (res) => {
        resolve(res);
      });
    });
  }
};
