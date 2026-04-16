import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #1a0f00;
    font-family: 'DM Sans', sans-serif;
    color: #fdf3e3;
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1a0f00; }
  ::-webkit-scrollbar-thumb { background: #c45c1a; border-radius: 4px; }

  .hb-root {
    display: flex;
    min-height: 100vh;
    background: radial-gradient(ellipse at top left, #2a1200 0%, #1a0f00 60%);
  }

  /* SIDEBAR */
  .sidebar {
    width: 230px;
    min-height: 100vh;
    background: linear-gradient(180deg, #2c1500 0%, #1a0c00 100%);
    border-right: 1px solid #3d1f00;
    display: flex;
    flex-direction: column;
    padding: 28px 0 20px;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }

  .logo {
    padding: 0 24px 28px;
    border-bottom: 1px solid #3d1f00;
    margin-bottom: 16px;
  }

  .logo-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: #f97316;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .logo-sub {
    font-size: 10px;
    color: #8a6040;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 24px;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 500;
    color: #a07050;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    margin: 1px 0;
  }

  .nav-item:hover { background: #2c1a0a; color: #f5c89a; }
  .nav-item.active {
    color: #f97316;
    background: linear-gradient(90deg, #2c1500 0%, #1e1000 100%);
    border-left: 3px solid #f97316;
  }

  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 24px;
    border-top: 1px solid #3d1f00;
    font-size: 11px;
    color: #5a3820;
  }

  /* MAIN */
  .main {
    margin-left: 230px;
    flex: 1;
    padding: 32px;
    min-height: 100vh;
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 900;
    color: #fdf3e3;
    line-height: 1.1;
  }

  .page-sub {
    font-size: 13px;
    color: #8a6040;
    margin-top: 4px;
  }

  /* CARDS */
  .card {
    background: linear-gradient(135deg, #251200 0%, #1e0f00 100%);
    border: 1px solid #3d2000;
    border-radius: 16px;
    padding: 22px;
  }

  .card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #7a5030;
    margin-bottom: 8px;
  }

  .card-value {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    color: #f97316;
    line-height: 1;
  }

  .card-note {
    font-size: 12px;
    color: #8a6040;
    margin-top: 6px;
  }

  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }

  /* BADGE */
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .badge-green { background: #14532d33; color: #4ade80; border: 1px solid #16a34a44; }
  .badge-red { background: #7f1d1d33; color: #f87171; border: 1px solid #dc262644; }
  .badge-orange { background: #7c2d1233; color: #fb923c; border: 1px solid #ea580c44; }
  .badge-blue { background: #1e3a5f33; color: #60a5fa; border: 1px solid #2563eb44; }

  /* BUTTON */
  .btn {
    padding: 9px 18px;
    border-radius: 10px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary { background: #f97316; color: #fff; }
  .btn-primary:hover { background: #ea6c0a; transform: translateY(-1px); }
  .btn-ghost { background: #2c1500; color: #f97316; border: 1px solid #3d2000; }
  .btn-ghost:hover { background: #3d1f00; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid #3d2000; }
  th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #7a5030;
    padding: 10px 14px;
  }
  td { padding: 12px 14px; font-size: 13.5px; color: #d4a57a; border-bottom: 1px solid #2a1500; }
  tr:hover td { background: #2c1500; }
  tr:last-child td { border-bottom: none; }

  /* INPUT */
  input, select, textarea {
    background: #2c1500;
    border: 1px solid #3d2000;
    border-radius: 10px;
    color: #fdf3e3;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    width: 100%;
    transition: border 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: #f97316; }
  input::placeholder, textarea::placeholder { color: #5a3820; }
  select option { background: #2c1500; }

  /* MEAL TAG */
  .meal-card {
    background: #251200;
    border: 1px solid #3d2000;
    border-radius: 12px;
    padding: 14px;
  }
  .meal-time {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #f97316;
    margin-bottom: 4px;
  }
  .meal-items { font-size: 13px; color: #c49060; line-height: 1.6; }

  /* INVENTORY */
  .inv-bar-bg {
    height: 6px;
    background: #3d2000;
    border-radius: 99px;
    overflow: hidden;
    margin-top: 8px;
  }
  .inv-bar { height: 100%; border-radius: 99px; transition: width 0.6s; }

  /* STAR */
  .star { cursor: pointer; font-size: 22px; transition: transform 0.1s; }
  .star:hover { transform: scale(1.2); }

  /* CHAT */
  .chat-wrap {
    display: flex;
    flex-direction: column;
    height: 480px;
  }
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #1a0f00;
    border-radius: 12px;
    border: 1px solid #3d2000;
  }
  .msg-user {
    align-self: flex-end;
    background: #f97316;
    color: #fff;
    padding: 10px 14px;
    border-radius: 14px 14px 4px 14px;
    font-size: 13px;
    max-width: 75%;
  }
  .msg-ai {
    align-self: flex-start;
    background: #251200;
    border: 1px solid #3d2000;
    color: #d4a57a;
    padding: 10px 14px;
    border-radius: 14px 14px 14px 4px;
    font-size: 13px;
    max-width: 85%;
    line-height: 1.6;
  }
  .msg-ai .ai-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #f97316;
    margin-bottom: 4px;
    text-transform: uppercase;
  }
  .chat-input-row {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }

  /* MAP placeholder */
  .map-box {
    background: #1a0f00;
    border: 1px solid #3d2000;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    height: 340px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .map-pin {
    position: absolute;
    width: 14px; height: 14px;
    background: #f97316;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 12px #f97316aa;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .map-pin:hover { transform: scale(1.4); }
  .map-tooltip {
    position: absolute;
    background: #251200;
    border: 1px solid #f97316;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #fdf3e3;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
    transform: translate(-50%, -120%);
  }

  /* TABS (menu days) */
  .day-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
  .day-tab {
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #3d2000;
    background: #1e0f00;
    color: #7a5030;
    transition: all 0.2s;
  }
  .day-tab.active { background: #f97316; color: #fff; border-color: #f97316; }
  .day-tab:hover:not(.active) { background: #2c1500; color: #f5c89a; }

  /* TOAST */
  .toast {
    position: fixed;
    bottom: 28px; right: 28px;
    background: #f97316;
    color: #fff;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 8px 24px #f9731644;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* LIVE DOT */
  .live-dot {
    display: inline-block;
    width: 8px; height: 8px;
    background: #4ade80;
    border-radius: 50%;
    margin-right: 6px;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 #4ade8066; }
    50% { opacity: 0.7; box-shadow: 0 0 0 5px #4ade8000; }
  }

  /* Fade-in */
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #f5c89a;
    margin-bottom: 14px;
  }

  .divider { border: none; border-top: 1px solid #3d2000; margin: 20px 0; }

  .tag {
    display: inline-block;
    background: #f9731622;
    color: #f97316;
    border: 1px solid #f9731633;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
  }
`;

// ─── DATA ───────────────────────────────────────────────────────────────────

const weekMenu = {
  Monday: { breakfast: "Idli · Sambar · Coconut Chutney · Tea", lunch: "Rice · Dal Tadka · Aloo Sabzi · Roti · Salad", dinner: "Roti · Paneer Butter Masala · Dal · Jeera Rice" },
  Tuesday: { breakfast: "Poha · Jalebi · Tea", lunch: "Rajma Chawal · Aloo Gobi · Roti · Buttermilk", dinner: "Veg Biryani · Raita · Pickle · Phirni" },
  Wednesday: { breakfast: "Bread · Butter · Egg Bhurji · Coffee", lunch: "Dal Makhani · Rice · Roti · Aloo Palak · Salad", dinner: "Chole Bhature · Kheer" },
  Thursday: { breakfast: "Upma · Coconut Chutney · Coffee", lunch: "Kadhi Chawal · Mix Veg · Roti · Papad", dinner: "Fried Rice · Veg Manchurian · Soup · Salad" },
  Friday: { breakfast: "Paratha · Curd · Pickle · Tea", lunch: "Chana Dal · Rice · Bhindi Fry · Roti · Salad", dinner: "Dal Tadka · Roti · Jeera Rice · Gulab Jamun" },
  Saturday: { breakfast: "Puri · Aloo Sabzi · Tea", lunch: "Special Biryani · Raita · Papad · Cold Drink", dinner: "Pizza · Tomato Soup · Fruit Salad" },
  Sunday: { breakfast: "Chole Bhature · Lassi", lunch: "Grand Thali – Dal · Rice · 2 Sabzi · Roti · Sweet · Papad", dinner: "Noodles · Manchurian · Ice Cream · Cold Drink" },
};

const initialStudents = [
  { id: "HB001", name: "Aanya Sharma", room: "A-101", plan: "Full Mess", paid: true, balance: 0 },
  { id: "HB002", name: "Rohit Verma", room: "B-205", plan: "Full Mess", paid: false, balance: 2400 },
  { id: "HB003", name: "Priya Nair", room: "A-110", plan: "Lunch Only", paid: true, balance: 0 },
  { id: "HB004", name: "Arjun Mehta", room: "C-302", plan: "Full Mess", paid: false, balance: 4800 },
  { id: "HB005", name: "Sneha Patel", room: "B-108", plan: "Dinner Only", paid: true, balance: 0 },
  { id: "HB006", name: "Dev Kapoor", room: "D-401", plan: "Full Mess", paid: false, balance: 1200 },
];

const initialInventory = [
  { id: 1, name: "Rice", unit: "kg", stock: 85, capacity: 100, threshold: 20, category: "Grains" },
  { id: 2, name: "Wheat Flour", unit: "kg", stock: 45, capacity: 80, threshold: 15, category: "Grains" },
  { id: 3, name: "Dal (Toor)", unit: "kg", stock: 12, capacity: 50, threshold: 10, category: "Pulses" },
  { id: 4, name: "Milk", unit: "litre", stock: 25, capacity: 60, threshold: 15, category: "Dairy" },
  { id: 5, name: "Paneer", unit: "kg", stock: 8, capacity: 20, threshold: 5, category: "Dairy" },
  { id: 6, name: "Tomatoes", unit: "kg", stock: 18, capacity: 30, threshold: 8, category: "Vegetables" },
  { id: 7, name: "Onions", unit: "kg", stock: 30, capacity: 40, threshold: 10, category: "Vegetables" },
  { id: 8, name: "LPG Cylinder", unit: "units", stock: 2, capacity: 5, threshold: 1, category: "Fuel" },
];

const nearbyPlaces = [
  { name: "Campus Canteen", type: "Canteen", dist: "200m", rating: 4.2, x: 38, y: 42, open: true },
  { name: "Sharma Dhaba", type: "Restaurant", dist: "450m", rating: 4.5, x: 65, y: 30, open: true },
  { name: "Green Bowl Café", type: "Café", dist: "600m", rating: 4.1, x: 72, y: 62, open: false },
  { name: "SuperMart Grocery", type: "Grocery", dist: "800m", rating: 4.3, x: 22, y: 68, open: true },
  { name: "Spice Garden", type: "Restaurant", dist: "1.1km", rating: 4.7, x: 50, y: 75, open: true },
  { name: "City Bakery", type: "Bakery", dist: "1.3km", rating: 4.0, x: 82, y: 48, open: true },
];

const feedbacks = [
  { id: 1, student: "Aanya S.", meal: "Monday Lunch", rating: 5, comment: "Paneer was excellent today!", time: "2h ago" },
  { id: 2, student: "Rohit V.", meal: "Tuesday Dinner", rating: 3, comment: "Biryani was a bit dry.", time: "5h ago" },
  { id: 3, student: "Priya N.", meal: "Today Breakfast", rating: 4, comment: "Idli was soft and fresh!", time: "1h ago" },
  { id: 4, student: "Arjun M.", meal: "Monday Dinner", rating: 2, comment: "Roti was hard and cold.", time: "8h ago" },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function StatCard({ label, value, note, color = "#f97316" }) {
  return (
    <div className="card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="card-label">{label}</div>
      <div className="card-value" style={{ color }}>{value}</div>
      {note && <div className="card-note">{note}</div>}
    </div>
  );
}

function Dashboard({ students, inventory }) {
  const unpaid = students.filter(s => !s.paid).length;
  const lowStock = inventory.filter(i => i.stock <= i.threshold);
  const todayMenu = weekMenu[today] || weekMenu["Monday"];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span className="live-dot" />
        <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>LIVE</span>
        <span style={{ fontSize: 12, color: "#7a5030", marginLeft: 4 }}>{new Date().toLocaleString()}</span>
      </div>
      <div className="page-header">
        <div className="page-title">Welcome back, Admin 👋</div>
        <div className="page-sub">Here's what's happening at HomeBite today</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Total Students" value={students.length} note="Enrolled in mess" color="#f97316" />
        <StatCard label="Pending Dues" value={unpaid} note={`₹${students.filter(s=>!s.paid).reduce((a,b)=>a+b.balance,0).toLocaleString()} total`} color="#ef4444" />
        <StatCard label="Low Stock Items" value={lowStock.length} note="Need reorder" color="#eab308" />
        <StatCard label="Today's Rating" value="4.2★" note="Based on 18 reviews" color="#22c55e" />
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Today's Menu — {today}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["breakfast","lunch","dinner"].map(m => (
              <div className="meal-card" key={m}>
                <div className="meal-time">{m === "breakfast" ? "☀️ Breakfast · 7:30–9:30 AM" : m === "lunch" ? "🌤 Lunch · 12:00–2:30 PM" : "🌙 Dinner · 7:30–9:30 PM"}</div>
                <div className="meal-items">{todayMenu[m]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Low Stock Alerts 🚨</div>
          {lowStock.length === 0
            ? <div style={{ color: "#4ade80", fontSize: 13 }}>✅ All stock levels are healthy!</div>
            : lowStock.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a1500" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#f5c89a", fontSize: 13 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#7a5030" }}>{item.stock} {item.unit} remaining</div>
                </div>
                <span className="badge badge-red">Low</span>
              </div>
            ))
          }
          <hr className="divider" />
          <div className="section-title" style={{ marginBottom: 10 }}>Pending Dues</div>
          {students.filter(s => !s.paid).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #2a1500" }}>
              <div>
                <div style={{ fontWeight: 600, color: "#f5c89a", fontSize: 13 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#7a5030" }}>{s.room} · {s.plan}</div>
              </div>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>₹{s.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Recent Feedback</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {feedbacks.slice(0,3).map(f => (
            <div key={f.id} style={{ flex: "1 1 200px", background: "#1a0f00", border: "1px solid #3d2000", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#f5c89a", fontSize: 13 }}>{f.student}</span>
                <span style={{ color: "#eab308", fontSize: 13 }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
              </div>
              <div style={{ fontSize: 11, color: "#7a5030", margin: "3px 0 6px" }}>{f.meal} · {f.time}</div>
              <div style={{ fontSize: 13, color: "#a07050" }}>"{f.comment}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuPage() {
  const [selectedDay, setSelectedDay] = useState(today in weekMenu ? today : "Monday");
  const menu = weekMenu[selectedDay];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Menu & Meal Schedule 🍽</div>
        <div className="page-sub">Weekly meal plan for all students</div>
      </div>
      <div className="day-tabs">
        {days.map(d => (
          <div key={d} className={`day-tab${selectedDay===d?" active":""}`} onClick={()=>setSelectedDay(d)}>
            {d.slice(0,3)} {d === today ? "🔴" : ""}
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-title" style={{ margin: 0 }}>{selectedDay}'s Menu</div>
          {selectedDay === today && <span className="badge badge-green">Today</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "breakfast", label: "☀️ Breakfast", time: "7:30 AM – 9:30 AM" },
            { key: "lunch", label: "🌤 Lunch", time: "12:00 PM – 2:30 PM" },
            { key: "dinner", label: "🌙 Dinner", time: "7:30 PM – 9:30 PM" },
          ].map(m => (
            <div key={m.key} style={{ display: "flex", gap: 16 }}>
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 700, color: "#f97316", fontSize: 14 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "#7a5030", marginTop: 2 }}>{m.time}</div>
              </div>
              <div style={{ flex: 1, background: "#1a0f00", border: "1px solid #3d2000", borderRadius: 10, padding: "12px 16px", color: "#c49060", fontSize: 13.5, lineHeight: 1.7 }}>
                {menu[m.key]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Full Week Overview</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {days.map(d => (
                <tr key={d} style={{ background: d===today ? "#2c150011" : "transparent" }}>
                  <td style={{ fontWeight: 700, color: d===today?"#f97316":"#f5c89a" }}>{d} {d===today?"🔴":""}</td>
                  <td style={{ fontSize: 12 }}>{weekMenu[d].breakfast}</td>
                  <td style={{ fontSize: 12 }}>{weekMenu[d].lunch}</td>
                  <td style={{ fontSize: 12 }}>{weekMenu[d].dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendancePage({ students, setStudents, showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [attendance, setAttendance] = useState(() => {
    const a = {};
    students.forEach(s => { a[s.id] = { breakfast: false, lunch: false, dinner: false }; });
    return a;
  });

  const filtered = students.filter(s =>
    (filter === "All" || (filter === "Unpaid" ? !s.paid : s.paid)) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()))
  );

  const markPaid = (id) => {
    setStudents(prev => prev.map(s => s.id===id ? {...s, paid:true, balance:0} : s));
    showToast("Payment marked as received ✓");
  };

  const toggleMeal = (sid, meal) => {
    setAttendance(prev => ({
      ...prev,
      [sid]: { ...prev[sid], [meal]: !prev[sid][meal] }
    }));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Attendance & Billing 📋</div>
        <div className="page-sub">Track student meals and manage dues</div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <StatCard label="Total Enrolled" value={students.length} color="#f97316" />
        <StatCard label="Dues Pending" value={students.filter(s=>!s.paid).length} note={`₹${students.filter(s=>!s.paid).reduce((a,b)=>a+b.balance,0).toLocaleString()}`} color="#ef4444" />
        <StatCard label="Fully Paid" value={students.filter(s=>s.paid).length} color="#22c55e" />
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <input placeholder="Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ maxWidth: 160 }}>
            <option>All</option>
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Room</th>
                <th>Plan</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="tag">{s.id}</span></td>
                  <td style={{ fontWeight: 600, color: "#f5c89a" }}>{s.name}</td>
                  <td>{s.room}</td>
                  <td><span className="badge badge-blue">{s.plan}</span></td>
                  {["breakfast","lunch","dinner"].map(m => (
                    <td key={m}>
                      <input type="checkbox" checked={attendance[s.id]?.[m]||false} onChange={()=>toggleMeal(s.id,m)}
                        style={{ width:16, height:16, cursor:"pointer", accentColor:"#f97316", padding:0, background:"transparent", border:"none" }} />
                    </td>
                  ))}
                  <td><span className={`badge ${s.paid?"badge-green":"badge-red"}`}>{s.paid?"Paid":"Unpaid"}</span></td>
                  <td style={{ color: s.paid?"#4ade80":"#ef4444", fontWeight:700 }}>
                    {s.paid ? "—" : `₹${s.balance.toLocaleString()}`}
                  </td>
                  <td>
                    {!s.paid && <button className="btn btn-primary btn-sm" onClick={()=>markPaid(s.id)}>Mark Paid</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryPage({ inventory, setInventory, showToast }) {
  const [form, setForm] = useState({ name:"", unit:"kg", stock:"", capacity:"", threshold:"", category:"Grains" });

  const addItem = () => {
    if(!form.name || !form.stock) return;
    setInventory(prev => [...prev, { ...form, id: Date.now(), stock:+form.stock, capacity:+form.capacity||100, threshold:+form.threshold||10 }]);
    setForm({ name:"", unit:"kg", stock:"", capacity:"", threshold:"", category:"Grains" });
    showToast("Item added to inventory ✓");
  };

  const restock = (id) => {
    setInventory(prev => prev.map(i => i.id===id ? {...i, stock:i.capacity} : i));
    showToast("Item restocked to full capacity ✓");
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Inventory & Stock 📦</div>
        <div className="page-sub">Real-time stock tracking and alerts</div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <StatCard label="Total Items" value={inventory.length} color="#f97316" />
        <StatCard label="Low Stock" value={inventory.filter(i=>i.stock<=i.threshold).length} note="Need reorder" color="#ef4444" />
        <StatCard label="Healthy Stock" value={inventory.filter(i=>i.stock>i.threshold).length} color="#22c55e" />
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Stock Levels</div>
          {inventory.map(item => {
            const pct = Math.min(100, Math.round((item.stock/item.capacity)*100));
            const isLow = item.stock <= item.threshold;
            const barColor = isLow ? "#ef4444" : pct > 60 ? "#22c55e" : "#eab308";
            return (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <span style={{ fontWeight:600, color:"#f5c89a", fontSize:13 }}>{item.name}</span>
                    <span style={{ fontSize:11, color:"#7a5030", marginLeft:8 }}>{item.category}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color: isLow?"#ef4444":"#a07050" }}>{item.stock} / {item.capacity} {item.unit}</span>
                    {isLow && <span className="badge badge-red">Low</span>}
                    <button className="btn btn-ghost btn-sm" onClick={()=>restock(item.id)}>Restock</button>
                  </div>
                </div>
                <div className="inv-bar-bg">
                  <div className="inv-bar" style={{ width:`${pct}%`, background:barColor }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="section-title">Add New Item</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <input placeholder="Item name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            <div style={{ display:"flex", gap:10 }}>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {["Grains","Pulses","Dairy","Vegetables","Fuel","Spices","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                {["kg","litre","units","packets","dozen"].map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <input type="number" placeholder="Current stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
              <input type="number" placeholder="Capacity" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} />
            </div>
            <input type="number" placeholder="Low stock threshold" value={form.threshold} onChange={e=>setForm({...form,threshold:e.target.value})} />
            <button className="btn btn-primary" onClick={addItem}>Add Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackPage({ showToast }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ student:"", meal:"", comment:"" });
  const [allFeedbacks, setAllFeedbacks] = useState(feedbacks);

  const submit = () => {
    if(!form.student || !form.meal || rating===0) return;
    setAllFeedbacks(prev => [{
      id: Date.now(), student: form.student, meal: form.meal,
      rating, comment: form.comment, time: "just now"
    }, ...prev]);
    setForm({ student:"", meal:"", comment:"" });
    setRating(0);
    showToast("Feedback submitted! Thank you ⭐");
  };

  const avg = (allFeedbacks.reduce((a,b)=>a+b.rating,0)/allFeedbacks.length).toFixed(1);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Feedback & Ratings ⭐</div>
        <div className="page-sub">Student reviews help us improve quality</div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <StatCard label="Avg Rating" value={`${avg}★`} color="#eab308" />
        <StatCard label="Total Reviews" value={allFeedbacks.length} color="#f97316" />
        <StatCard label="5-Star Reviews" value={allFeedbacks.filter(f=>f.rating===5).length} color="#22c55e" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Submit Feedback</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input placeholder="Your name" value={form.student} onChange={e=>setForm({...form,student:e.target.value})} />
            <select value={form.meal} onChange={e=>setForm({...form,meal:e.target.value})}>
              <option value="">Select meal...</option>
              {days.flatMap(d => ["Breakfast","Lunch","Dinner"].map(m => <option key={`${d}-${m}`}>{d} {m}</option>))}
            </select>
            <div>
              <div style={{ fontSize:12, color:"#7a5030", marginBottom:6 }}>Your Rating</div>
              <div style={{ display:"flex", gap:4 }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="star"
                    style={{ color: s<=(hover||rating)?"#eab308":"#3d2000" }}
                    onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setRating(s)}>★</span>
                ))}
              </div>
            </div>
            <textarea placeholder="Share your experience..." rows={3} value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} style={{ resize:"vertical" }} />
            <button className="btn btn-primary" onClick={submit}>Submit Feedback</button>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Recent Reviews</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:380, overflowY:"auto" }}>
            {allFeedbacks.map(f => (
              <div key={f.id} style={{ background:"#1a0f00", border:"1px solid #3d2000", borderRadius:10, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, color:"#f5c89a", fontSize:13 }}>{f.student}</span>
                  <span style={{ color:"#eab308" }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
                </div>
                <div style={{ fontSize:11, color:"#7a5030", margin:"3px 0 6px" }}>{f.meal} · {f.time}</div>
                {f.comment && <div style={{ fontSize:13, color:"#a07050" }}>"{f.comment}"</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NearbyPage() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const typeColor = { Canteen:"#f97316", Restaurant:"#22c55e", Café:"#3b82f6", Grocery:"#eab308", Bakery:"#a78bfa" };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Nearby Food Places 📍</div>
        <div className="page-sub">Find food options near your hostel</div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ height: 480, position:"relative", padding:0, overflow:"hidden" }}>
          {/* SVG Map Illustration */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position:"absolute", inset:0 }}>
            <rect width="100" height="100" fill="#1a0f00" />
            {/* Road network */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="#3d2000" strokeWidth="3" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#3d2000" strokeWidth="3" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="#2a1500" strokeWidth="1.5" />
            <line x1="0" y1="70" x2="100" y2="70" stroke="#2a1500" strokeWidth="1.5" />
            <line x1="30" y1="0" x2="30" y2="100" stroke="#2a1500" strokeWidth="1.5" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="#2a1500" strokeWidth="1.5" />
            {/* Blocks */}
            {[[5,5,18,18],[35,5,28,18],[68,5,27,18],[5,35,18,28],[68,35,27,28],[5,75,18,18],[35,75,28,18],[68,75,27,18]].map(([x,y,w,h],i) =>
              <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#251200" stroke="#3d2000" strokeWidth="0.5" />
            )}
            {/* Hostel marker */}
            <circle cx="50" cy="50" r="4" fill="#f97316" />
            <text x="50" y="46" textAnchor="middle" fontSize="3" fill="#f97316" fontWeight="bold">🏠 HomeBite</text>
          </svg>
          {/* Place pins */}
          {nearbyPlaces.map((p, i) => (
            <div key={i}>
              <div className="map-pin" style={{
                left:`${p.x}%`, top:`${p.y}%`,
                background: p.open ? (typeColor[p.type]||"#f97316") : "#5a3820",
                transform: `translate(-50%,-50%) ${hovered===i?"scale(1.5)":"scale(1)"}`,
                transition:"transform 0.2s"
              }}
                onMouseEnter={()=>setHovered(i)}
                onMouseLeave={()=>setHovered(null)}
                onClick={()=>setSelected(i===selected?null:i)}
              />
              {hovered===i && (
                <div className="map-tooltip" style={{ left:`${p.x}%`, top:`${p.y}%` }}>
                  {p.name} · {p.dist} · {p.rating}★
                </div>
              )}
            </div>
          ))}
          <div style={{ position:"absolute", bottom:12, left:12, background:"#1a0f00aa", borderRadius:8, padding:"6px 12px", fontSize:11, color:"#7a5030", border:"1px solid #3d2000" }}>
            🟠 You are here (HomeBite Hostel)
          </div>
        </div>

        <div className="card">
          <div className="section-title">Nearby Locations</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {nearbyPlaces.map((p, i) => (
              <div key={i} onClick={()=>setSelected(i===selected?null:i)}
                style={{ background: selected===i?"#2c1500":"#1a0f00", border:`1px solid ${selected===i?"#f97316":"#3d2000"}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:700, color:"#f5c89a", fontSize:13 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:"#7a5030", marginTop:2 }}>
                      <span style={{ color: typeColor[p.type]||"#f97316" }}>{p.type}</span> · {p.dist}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#eab308", fontWeight:700 }}>★ {p.rating}</div>
                    <span className={`badge ${p.open?"badge-green":"badge-red"}`}>{p.open?"Open":"Closed"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIPage({ inventory, students }) {
  const [messages, setMessages] = useState([
    { role:"ai", text:"Hello! I'm HomeBite AI 🍽 — your intelligent mess management assistant. Ask me anything: menu suggestions, stock analysis, diet advice, or billing queries!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if(!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:q }]);
    setLoading(true);

    const lowItems = inventory.filter(i => i.stock<=i.threshold).map(i=>`${i.name}(${i.stock}${i.unit})`).join(", ")||"none";
    const unpaidCount = students.filter(s=>!s.paid).length;
    const todayM = weekMenu[today]||weekMenu["Monday"];
    const systemPrompt = `You are HomeBite AI, the smart assistant for a college hostel mess management system called HomeBite.

Current data context:
- Today is ${today}
- Today's menu: Breakfast: ${todayM.breakfast} | Lunch: ${todayM.lunch} | Dinner: ${todayM.dinner}
- Total students: ${students.length}, Unpaid dues: ${unpaidCount} students
- Low stock items: ${lowItems}

You help with: meal planning, nutritional advice, stock management suggestions, billing reminders, student diet queries, and general mess operations. Be concise, warm, and helpful. Use emojis occasionally. Keep responses under 120 words.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:300,
          system: systemPrompt,
          messages:[...messages.filter(m=>m.role!=="ai").map(m=>({ role:"user", content:m.text })), { role:"user", content:q }]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c=>c.text||"").join(" ") || "Sorry, I couldn't process that. Please try again!";
      setMessages(prev => [...prev, { role:"ai", text:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"ai", text:"⚠️ Connection error. Please check your network and try again." }]);
    }
    setLoading(false);
  };

  const quickQ = ["What's today's menu?", "Which items are low in stock?", "Suggest a healthy breakfast", "How many students have pending dues?"];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">AI Assistant ✦</div>
        <div className="page-sub">Powered by Claude — your smart mess companion</div>
      </div>

      <div className="card">
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          {quickQ.map(q => (
            <button key={q} className="btn btn-ghost btn-sm" onClick={()=>{ setInput(q); }}>{q}</button>
          ))}
        </div>

        <div className="chat-wrap">
          <div className="chat-messages" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role==="user"?"msg-user":"msg-ai"}>
                {m.role==="ai" && <div className="ai-label">✦ HomeBite AI</div>}
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="msg-ai">
                <div className="ai-label">✦ HomeBite AI</div>
                <span style={{ color:"#7a5030" }}>Thinking...</span>
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input
              placeholder="Ask about menu, stock, nutrition, billing..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}
            />
            <button className="btn btn-primary" onClick={send} disabled={loading} style={{ whiteSpace:"nowrap", opacity:loading?0.6:1 }}>
              Send ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [inventory, setInventory] = useState(initialInventory);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id:"dashboard", icon:"⊞", label:"Dashboard" },
    { id:"menu", icon:"🍽", label:"Menu & Schedule" },
    { id:"attendance", icon:"📋", label:"Attendance & Billing" },
    { id:"inventory", icon:"📦", label:"Inventory" },
    { id:"feedback", icon:"⭐", label:"Feedback" },
    { id:"nearby", icon:"📍", label:"Nearby" },
    { id:"ai", icon:"✦", label:"AI Assistant" },
  ];

  const renderPage = () => {
    switch(activeTab) {
      case "dashboard": return <Dashboard students={students} inventory={inventory} />;
      case "menu": return <MenuPage />;
      case "attendance": return <AttendancePage students={students} setStudents={setStudents} showToast={showToast} />;
      case "inventory": return <InventoryPage inventory={inventory} setInventory={setInventory} showToast={showToast} />;
      case "feedback": return <FeedbackPage showToast={showToast} />;
      case "nearby": return <NearbyPage />;
      case "ai": return <AIPage inventory={inventory} students={students} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="hb-root">
        <nav className="sidebar">
          <div className="logo">
            <div className="logo-title">HomeBite</div>
            <div className="logo-sub">Mess Management</div>
          </div>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item${activeTab===item.id?" active":""}`} onClick={()=>setActiveTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id==="inventory" && inventory.filter(i=>i.stock<=i.threshold).length>0 &&
                <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", borderRadius:"99px", fontSize:10, padding:"1px 7px", fontWeight:700 }}>
                  {inventory.filter(i=>i.stock<=i.threshold).length}
                </span>
              }
            </div>
          ))}
          <div className="sidebar-footer">
            <div>🏠 HomeBite v1.0</div>
            <div style={{ marginTop:4 }}>College Hostel Mess System</div>
          </div>
        </nav>

        <main className="main">
          {renderPage()}
        </main>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
