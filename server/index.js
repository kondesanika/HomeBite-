const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let db = {
  students: [
    { id: "HB001", name: "Mahek Bagwan", room: "A-101", plan: "Full Mess", paid: true, balance: 0 },
    { id: "HB002", name: "Rohit Gawali", room: "B-205", plan: "Lunch Only", paid: false, balance: 1200 },
    { id: "HB003", name: "Sanika Konde", room: "A-302", plan: "Full Mess", paid: true, balance: 0 },
    { id: "HB004", name: "Gouri Mam ", room: "C-110", plan: "Dinner Only", paid: false, balance: 850 },
  ],
  inventory: [
    { id: 1, name: "Basmati Rice", category: "Grains", stock: 120, unit: "kg", threshold: 50 },
    { id: 2, name: "Cooking Oil", category: "Essentials", stock: 15, unit: "L", threshold: 20 },
    { id: 3, name: "Lentils (Dal)", category: "Grains", stock: 85, unit: "kg", threshold: 30 },
    { id: 4, name: "Spices Mix", category: "Spices", stock: 8, unit: "kg", threshold: 10 },
  ],
  offers: [
    { id: 1, title: "Grand Student Discount", description: "Get 20% off on advance 3-month mess booking.", code: "STUDENT20", validTill: "30th April" },
    { id: 2, title: "Refer-a-Friend", description: "Invite a friend to join HomeBite!", code: "REFER7", validTill: "Permanent" },
  ],
  notifications: [
    { id: 1, text: "Welcome to HomeBite! Check out today's menu.", time: "Just now", unread: true },
    { id: 2, text: "Backend server is now LIVE! 🚀", time: "Just now", unread: true }
  ],
  profile: {
    name: "Aanya Sharma",
    id: "HB001",
    address: "Block A, Room 101, Central Hostel, Campus Estate",
    location: "Mumbai, India",
    email: "aanya.s@university.edu"
  }
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send everything on connection
  socket.emit('init', db);

  // Handle Updates
  socket.on('update', ({ key, value }) => {
    db[key] = value;
    // Broadcast to all other clients
    socket.broadcast.emit('sync', { key, value });
  });

  socket.on("login", ({ username, password }, callback) => {
    if (username === "admin") {
      if (password === "admin123") {
        return callback({ success: true, role: "admin", id: "admin" });
      } else {
        return callback({ success: false, message: "Invalid admin password" });
      }
    }
    // Simple mock logic for student: any non-admin with username starting with HB or anything really but requires a password
    if (username && password) {
      return callback({ success: true, role: "student", id: username });
    }
    return callback({ success: false, message: "Invalid credentials. Please provide valid username and password." });
  });

  socket.on("signup", (userData, callback) => {
    if (!userData.username || !userData.password || !userData.name) {
      return callback({ success: false, message: "Missing fields" });
    }
    const newStudent = { id: userData.username, name: userData.name, room: "-", plan: "Full Mess", paid: true, balance: 0 };
    db.students.push(newStudent);
    io.emit("sync", { key: "students", value: db.students });
    return callback({ success: true, role: "student", id: userData.username });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Real-time backend running on http://localhost:${PORT}`);
});
