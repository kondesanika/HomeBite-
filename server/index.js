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
  },
  messes: [
    { id: 1, name: "HomeBite (Central)", type: "General Mess", open: "7:30 AM", close: "10:30 PM", status: "Open", rating: 4.8, distance: "0 m", plan: "₹3000/month", offers: ["10% off annually"], menu: "Standard Indian Thali", address: "Ground Floor, Central Hostel Block", img: "/login_bg.png", isVeg: true, contact: "+91 98765-43210" },
    { id: 2, name: "Annapurna Mess", type: "Pure Veg Meal", open: "8:00 AM", close: "9:30 PM", status: "Open", rating: 4.5, distance: "120 m", plan: "₹2500/month", offers: ["First week free demo"], menu: "Gujarati & Punjabi Veg Thali", address: "Behind Library, East Wing", img: "/mess_veg.png", isVeg: true, contact: "+91 98765-43211" },
    { id: 3, name: "Student Point Canteen", type: "Snacks & Fast Food", open: "10:00 AM", close: "11:00 PM", status: "Open", rating: 4.2, distance: "300 m", plan: "Pay per item", offers: ["Free chai with ₹100 order"], menu: "Samosa, Maggi, Burgers", address: "Near North Gate Entrance", img: "/mess_canteen.png", isVeg: false, contact: "+91 98765-43212" },
    { id: 4, name: "Night Owl Cafe", type: "Late Night", open: "8:00 PM", close: "3:00 AM", status: "Closed", rating: 4.9, distance: "450 m", plan: "Pay per item", offers: ["No delivery fee"], menu: "Coffee, Sandwiches, Fries", address: "Rooftop, Block D Recreation Center", img: "/login_bg.png", isVeg: false, contact: "+91 98765-43213" },
    { id: 5, name: "Spice Route Mess", type: "Non-Veg", open: "12:00 PM", close: "10:00 PM", status: "Open", rating: 4.4, distance: "500 m", plan: "₹3500/month", offers: ["Free Sunday special add-on"], menu: "Chicken Biryani, Curries, Rotis", address: "Basement Level, South Block", img: "/mess_premium.png", isVeg: false, contact: "+91 98765-43214" },
  ],
  feedbacks: [
    { id: 1, student: "Aanya S.", meal: "Monday Lunch", rating: 5, comment: "Paneer was excellent today!", time: "2h ago" },
    { id: 2, student: "Rohit V.", meal: "Tuesday Dinner", rating: 3, comment: "Biryani was a bit dry.", time: "5h ago" },
    { id: 3, student: "Priya N.", meal: "Today Breakfast", rating: 4, comment: "Idli was soft and fresh!", time: "1h ago" },
  ]
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-time backend running on port ${PORT}`);
});

