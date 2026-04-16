// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { db } from "./db";

const lightVars = `
  :root {
    --bg: #fefcf9;
    --bg2: #ffffff;
    --card-bg: rgba(255, 255, 255, 0.85);
    --card-border: rgba(249, 115, 22, 0.15);
    --sidebar-bg: #fffbf5;
    --sidebar-border: #f5eadd;
    --text: #1a1510;
    --text-sub: #5c4d3e;
    --text-muted: #9c8b7b;
    --input-bg: #ffffff;
    --input-border: #e8dfd5;
    --nav-hover: #fcf6ef;
    --nav-active-bg: linear-gradient(90deg, #fff7ed 0%, #ffeedd 100%);
    --table-row-hover: #fdfaf7;
    --table-border: #f0e6da;
    --meal-card: #ffffff;
    --inv-bar-bg: #f0e6da;
    --scrollbar-track: #fefcf9;
    --scrollbar-thumb: #f97316;
    --shadow-soft: 0 4px 20px rgba(0,0,0,0.04);
    --shadow-card: 0 10px 40px rgba(26, 21, 16, 0.05);
    --primary: #f97316;
  }`;

const darkVars = `
  :root {
    --bg: #0d0a07;
    --bg2: #140f0a;
    --card-bg: rgba(24, 18, 12, 0.8);
    --card-border: rgba(249, 115, 22, 0.1);
    --sidebar-bg: #140f0a;
    --sidebar-border: #241c14;
    --text: #f9f5f0;
    --text-sub: #b8a898;
    --text-muted: #8c7d6d;
    --input-bg: #1a140f;
    --input-border: #2d241c;
    --nav-hover: #1f1812;
    --nav-active-bg: linear-gradient(90deg, #241c14 0%, #1a140f 100%);
    --table-row-hover: #1a140f;
    --table-border: #241c14;
    --meal-card: #1a140f;
    --inv-bar-bg: #2d241c;
    --scrollbar-track: #0d0a07;
    --scrollbar-thumb: #c45c1a;
    --shadow-soft: 0 4px 20px rgba(0,0,0,0.4);
    --shadow-card: 0 10px 40px rgba(0,0,0,0.5);
    --primary: #f97316;
  }`;

const getStyle = (theme) => (theme === 'light' ? lightVars : darkVars) + `
  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
    transition: background 0.3s, color 0.3s;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--scrollbar-track); }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }

  .hb-root {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
  }

  /* SIDEBAR */
  .sidebar {
    width: 260px;
    min-height: 100vh;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    display: flex;
    flex-direction: column;
    padding: 32px 0 24px;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 1000;
  }

  .logo {
    padding: 0 28px 32px;
    margin-bottom: 20px;
  }

  .logo-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 1000;
    color: var(--primary);
    letter-spacing: -0.8px;
    line-height: 1;
  }

  .logo-sub {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 6px;
    font-weight: 700;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 28px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid transparent;
    margin: 2px 12px;
    border-radius: 12px;
  }

  .nav-item:hover { background: var(--nav-hover); color: var(--text); }
  .nav-item.active {
    color: var(--primary);
    background: var(--nav-active-bg);
    border-left-color: var(--primary);
  }

  .nav-icon { font-size: 18px; width: 24px; display: flex; align-items: center; justify-content: center; opacity: 0.8; }

  .sidebar-footer {
    margin-top: auto;
    padding: 24px 28px;
    border-top: 1px solid var(--sidebar-border);
  }

  /* MAIN */
  .main {
    margin-left: 260px;
    flex: 1;
    padding: 48px;
    min-height: 100vh;
    max-width: 1400px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 1000;
    color: var(--text);
    line-height: 1.1;
    letter-spacing: -1px;
  }

  .page-sub {
    font-size: 15px;
    color: var(--text-muted);
    margin-top: 8px;
  }

  /* CARDS */
  .card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 24px;
    padding: 32px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: var(--shadow-card);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 12px;
    opacity: 0.8;
  }

  .card-value {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 1000;
    color: var(--text);
    line-height: 1;
    margin-bottom: 8px;
  }

  .card-note {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

  /* BADGE */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .badge-green { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
  .badge-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
  .badge-orange { background: rgba(249, 115, 22, 0.15); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.2); }
  .badge-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }

  /* BUTTON */
  .btn {
    padding: 14px 28px;
    border-radius: 16px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.2px;
  }
  .btn-primary { 
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); 
    color: #fff; 
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  }
  .btn-primary:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  }
  .btn-ghost { 
    background: var(--input-bg); 
    color: var(--primary); 
    border: 1px solid var(--input-border); 
  }
  .btn-ghost:hover { 
    background: var(--nav-hover); 
    border-color: var(--primary);
  }
  .btn-sm { padding: 8px 16px; font-size: 12px; border-radius: 10px; }

  /* TABLE */
  .table-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid var(--table-border); }
  table { width: 100%; border-collapse: collapse; background: var(--bg2); }
  th {
    text-align: left;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 20px 24px;
    background: var(--bg);
    border-bottom: 1px solid var(--table-border);
  }
  td { padding: 20px 24px; font-size: 15px; color: var(--text-sub); border-bottom: 1px solid var(--table-border); }
  tr:hover td { background: var(--table-row-hover); }
  tr:last-child td { border-bottom: none; }

  /* INPUT */
  input, select, textarea {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 10px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    width: 100%;
    transition: border 0.2s, background 0.3s;
  }
  input:focus, select:focus, textarea:focus { border-color: #f97316; }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }
  select option { background: var(--input-bg); }

  /* MEAL TAG */
  .meal-card {
    background: var(--meal-card);
    border: 1px solid var(--card-border);
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
  .meal-items { font-size: 13px; color: var(--text-sub); line-height: 1.6; }

  /* INVENTORY */
  .inv-bar-bg {
    height: 6px;
    background: var(--inv-bar-bg);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 8px;
  }
  .inv-bar { height: 100%; border-radius: 99px; transition: width 0.6s; }

  /* STAR */
  .star { cursor: pointer; font-size: 22px; transition: transform 0.1s; }
  .star:hover { transform: scale(1.2); }


  /* MAP placeholder */
  .map-box {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
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
    background: var(--card-bg);
    border: 1px solid #f97316;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: var(--text);
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
    border: 1px solid var(--card-border);
    background: var(--input-bg);
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .day-tab.active { background: #f97316; color: #fff; border-color: #f97316; }
  .day-tab:hover:not(.active) { background: var(--nav-hover); color: var(--text-sub); }

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
    color: var(--text);
    margin-bottom: 14px;
  }

  .divider { border: none; border-top: 1px solid var(--card-border); margin: 20px 0; }

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

  /* CHAT & AI WIDGET STYLES */
  .ai-widget-toggle {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(249, 115, 22, 0.4);
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255,255,255,0.1);
  }
  .ai-widget-toggle:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 12px 40px rgba(249, 115, 22, 0.6);
  }
  .ai-widget-toggle.open {
    transform: scale(0.9) rotate(-90deg);
  }
  .ai-widget-window {
    position: fixed;
    bottom: 100px;
    right: 28px;
    width: 380px;
    height: 520px;
    background: rgba(44, 21, 0, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(249, 115, 22, 0.3);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    z-index: 1001;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    overflow: hidden;
    transform-origin: bottom right;
    animation: widgetPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes widgetPop { from { transform: scale(0.5) translateY(40px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
  .ai-widget-header {
    padding: 20px;
    background: linear-gradient(90deg, rgba(249, 115, 22, 0.1) 0%, transparent 100%);
    border-bottom: 1px solid rgba(249, 115, 22, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ai-widget-header .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 18px; color: #f97316; }
  .ai-widget-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth; }
  .ai-widget-footer { padding: 16px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(249, 115, 22, 0.1); }
  .ai-widget-input-wrap { background: rgba(26, 15, 0, 0.6); border: 1px solid rgba(249, 115, 22, 0.2); border-radius: 12px; padding: 4px 4px 4px 12px; display: flex; align-items: center; gap: 8px; }
  .ai-widget-input-wrap input { background: transparent; border: none; padding: 8px 0; font-size: 13px; width: 100%; color: #fff; outline: none; }
  .ai-msg-bubble { max-width: 85%; padding: 12px 14px; font-size: 13px; line-height: 1.5; border-radius: 16px; }
  .ai-msg-ai { align-self: flex-start; background: rgba(255,255,255,0.05); border: 1px solid rgba(249, 115, 22, 0.1); border-radius: 16px 16px 16px 4px; color: #f5c89a; }
  .ai-msg-user { align-self: flex-end; background: #f97316; color: #fff; border-radius: 16px 16px 4px 16px; }
  .ai-msg-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; color: #f97316; }

  /* ENROLLED MESS BOX */
  .enroll-box {
    background: linear-gradient(135deg, #2a1500 0%, #1a0c00 100%);
    border: 1px solid #f9731633;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
    overflow: hidden;
  }
  .enroll-box::after {
    content: 'ENROLLED';
    position: absolute;
    top: 10px; right: -25px;
    background: #f97316;
    color: #fff;
    font-size: 9px;
    font-weight: 900;
    padding: 4px 30px;
    transform: rotate(45deg);
  }
  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(8px);
  }
  .modal-content {
    background: var(--bg2);
    border: 1px solid var(--card-border);
    border-radius: 24px;
    width: 100%;
    max-width: 440px;
    padding: 32px;
    position: relative;
    box-shadow: 0 32px 64px rgba(0,0,0,0.8);
  }

  /* ONBOARDING BANNER */
  .onboard-banner {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%);
    border-radius: 20px;
    padding: 28px 32px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.5s ease;
  }
  .onboard-banner::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }

  /* SETTINGS */
  .theme-toggle {
    display: flex;
    align-items: center;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 40px;
    padding: 4px;
    gap: 4px;
    width: fit-content;
    cursor: pointer;
  }
  .theme-option {
    padding: 8px 18px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    color: var(--text-muted);
  }
  .theme-option.active {
    background: #f97316;
    color: #fff;
    box-shadow: 0 4px 12px rgba(249,115,22,0.3);
  }

  /* MESS MANAGEMENT */
  .mess-action-btn {
    padding: 12px 20px;
    border-radius: 12px;
    border: 1px solid var(--card-border);
    background: var(--input-bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mess-action-btn:hover { border-color: #f97316; color: #f97316; transform: translateY(-2px); }
  .mess-action-btn.danger:hover { border-color: #ef4444; color: #ef4444; }

  /* NOTIFICATIONS */
  .notif-bell {
    position: relative;
    cursor: pointer;
    width: 36px; height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: var(--input-bg);
    border: 1px solid var(--card-border);
    color: var(--text);
    transition: all 0.2s;
  }
  .notif-bell:hover { background: var(--nav-hover); color: #f97316; }
  .notif-badge {
    position: absolute;
    top: -5px; right: -5px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 900;
    padding: 2px 5px;
    border-radius: 20px;
    border: 2px solid #1a0f00;
  }
  .notif-dropdown {
    position: absolute;
    top: 50px; left: 0;
    width: 320px;
    max-height: 400px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    overflow-y: auto;
    z-index: 999;
    box-shadow: 0 16px 32px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
  }
  .notif-item { padding: 14px; border-bottom: 1px solid var(--card-border); cursor: pointer; }
  .notif-item:hover { background: var(--nav-hover); }
  .notif-item.unread { border-left: 3px solid #f97316; background: var(--nav-active-bg); }

  /* PROFILE */
  .profile-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
  .profile-section {
    background: var(--meal-card);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .user-avatar-large {
    width: 120px; height: 120px;
    background: var(--input-bg);
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    border: 1px solid var(--card-border);
    margin-bottom: 20px;
  }
  .profile-field { margin-bottom: 16px; }
  .profile-field label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
  .live-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #22c55e;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
    padding: 8px 12px;
    background: rgba(34, 197, 94, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 8px;
  }
  .pulse-dot {
    width: 6px; height: 6px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px #22c55e;
    animation: livePulse 2s infinite;
  }
  @keyframes livePulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

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

const initialOffers = [
  { id: 1, title: "10% Off on Annual Plan", description: "Pay for the whole year upfront and get a flat 10% discount on your mess fees.", validTill: "15th May", code: "YEAR10" },
  { id: 2, title: "Sunday Grand Thali Add-on", description: "Get the special Sunday feast for 4 weeks at just ₹500 extra.", validTill: "30th April", code: "SUNDAY500" }
];

const messesList = [
  { id: 1, name: "HomeBite (Central)", type: "General Mess", open: "7:30 AM", close: "10:30 PM", status: "Open", rating: 4.8, distance: "0 m", plan: "₹3000/month", offers: ["10% off annually"], menu: "Standard Indian Thali", address: "Ground Floor, Central Hostel Block", img: "/login_bg.png", isVeg: true, contact: "+91 98765-43210" },
  { id: 2, name: "Annapurna Mess", type: "Pure Veg Meal", open: "8:00 AM", close: "9:30 PM", status: "Open", rating: 4.5, distance: "120 m", plan: "₹2500/month", offers: ["First week free demo"], menu: "Gujarati & Punjabi Veg Thali", address: "Behind Library, East Wing", img: "/mess_veg.png", isVeg: true, contact: "+91 98765-43211" },
  { id: 3, name: "Student Point Canteen", type: "Snacks & Fast Food", open: "10:00 AM", close: "11:00 PM", status: "Open", rating: 4.2, distance: "300 m", plan: "Pay per item", offers: ["Free chai with ₹100 order"], menu: "Samosa, Maggi, Burgers", address: "Near North Gate Entrance", img: "/mess_canteen.png", isVeg: false, contact: "+91 98765-43212" },
  { id: 4, name: "Night Owl Cafe", type: "Late Night", open: "8:00 PM", close: "3:00 AM", status: "Closed", rating: 4.9, distance: "450 m", plan: "Pay per item", offers: ["No delivery fee"], menu: "Coffee, Sandwiches, Fries", address: "Rooftop, Block D Recreation Center", img: "/login_bg.png", isVeg: false, contact: "+91 98765-43213" },
  { id: 5, name: "Spice Route Mess", type: "Non-Veg", open: "12:00 PM", close: "10:00 PM", status: "Open", rating: 4.4, distance: "500 m", plan: "₹3500/month", offers: ["Free Sunday special add-on"], menu: "Chicken Biryani, Curries, Rotis", address: "Basement Level, South Block", img: "/mess_premium.png", isVeg: false, contact: "+91 98765-43214" },
];

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
  { name: "Campus Canteen", type: "Canteen", dist: "200m", rating: 4.2, lat: 18.5590, lng: 73.8165, open: true, address: "University Campus, Pune" },
  { name: "Sharma Dhaba", type: "Restaurant", dist: "450m", rating: 4.5, lat: 18.5600, lng: 73.8180, open: true, address: "Gate No.2, Near Campus" },
  { name: "Green Bowl Café", type: "Café", dist: "600m", rating: 4.1, lat: 18.5575, lng: 73.8190, open: false, address: "Senapati Bapat Road" },
  { name: "SuperMart Grocery", type: "Grocery", dist: "800m", rating: 4.3, lat: 18.5570, lng: 73.8155, open: true, address: "Near Symbiosis, Pune" },
  { name: "Spice Garden", type: "Restaurant", dist: "1.1km", rating: 4.7, lat: 18.5560, lng: 73.8200, open: true, address: "FC Road, Pune" },
  { name: "City Bakery", type: "Bakery", dist: "1.3km", rating: 4.0, lat: 18.5610, lng: 73.8210, open: true, address: "Deccan Gymkhana, Pune" },
];

// HomeBite Hostel center coords
const HOSTEL_LAT = 18.5585;
const HOSTEL_LNG = 73.8170;

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
  const totalGuestMeals = students.reduce((acc, s) => acc + (s.guestMeals || 0), 0);
  const guestRevenue = totalGuestMeals * 150;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span className="live-dot" />
        <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>LIVE</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>{new Date().toLocaleString()}</span>
      </div>
      <div className="page-header">
        <div className="page-title">Welcome back, Admin 👋</div>
        <div className="page-sub">Here's what's happening at HomeBite today</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 24 }}>
        <StatCard label="Total Students" value={students.length} note="Enrolled members" color="#f97316" />
        <StatCard label="Pending Dues" value={unpaid} note={`₹${students.filter(s=>!s.paid).reduce((a,b)=>a+b.balance,0).toLocaleString()} total`} color="#ef4444" />
        <StatCard label="Low Stock Items" value={lowStock.length} note="Alerts active" color="#eab308" />
        <StatCard label="Avg Rating" value="4.2★" note="Based on latest reviews" color="#22c55e" />
        <StatCard label="Guest Meals" value={totalGuestMeals} note="Today's bookings" color="#a855f7" />
        <StatCard label="Guest Revenue" value={`₹${guestRevenue.toLocaleString()}`} note="Today's total" color="#10b981" />
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
            ? <div style={{ color: "#4ade80", fontSize: 13, padding: 10 }}>✅ All stock levels are healthy!</div>
            : lowStock.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--table-border)" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.stock} {item.unit} remaining</div>
                </div>
                <span className="badge badge-red">Critical</span>
              </div>
            ))
          }
          <hr className="divider" />
          <div className="section-title" style={{ marginBottom: 10 }}>Pending Dues</div>
          {students.filter(s => !s.paid).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--table-border)" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.room} · {s.plan}</div>
              </div>
              <span style={{ color: "#ef4444", fontWeight: 800 }}>₹{s.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Recent Feedback</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {feedbacks.slice(0,3).map(f => (
            <div key={f.id} style={{ background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 13 }}>{f.student}</span>
                <span style={{ color: "#eab308", fontSize: 13 }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", margin: "3px 0 6px" }}>{f.meal} · {f.time}</div>
              <div style={{ fontSize: 13, color: "var(--text-sub)" }}>"{f.comment}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ student, enrolledMess, setEnrolledMess, setActiveTab, showToast, setStudents }) {
  const todayMenu = weekMenu[today] || weekMenu["Monday"];
  const isPaid = student.paid;
  const isEnrolled = !!enrolledMess;
  const [showChangeMess, setShowChangeMess] = useState(false);
  const [showStopMess, setShowStopMess] = useState(false);
  const [messPaused, setMessPaused] = useState(false);
  const [selectedNewMess, setSelectedNewMess] = useState("");

  const handleBookGuestMeal = () => {
    if (!setStudents) return;
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return { ...s, guestMeals: (s.guestMeals || 0) + 1, balance: s.balance + 150, paid: false };
      }
      return s;
    }));
    showToast("Guest meal booked successfully! ₹150 added to your dues.");
  };

  const handleChangeMess = () => {
    if (!selectedNewMess) return;
    const mess = messesList.find(m => m.id === parseInt(selectedNewMess));
    setEnrolledMess(mess);
    setShowChangeMess(false);
    showToast(`Mess changed to ${mess.name} ✓ Effective immediately!`);
  };

  const handleStopMess = () => {
    setMessPaused(true);
    setShowStopMess(false);
    showToast("Mess subscription paused. You can re-activate from dashboard.");
  };

  const handleResumeMess = () => {
    setMessPaused(false);
    showToast("Mess subscription re-activated! 🎉");
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Welcome, {student.name} 🍽️</div>
        <div className="page-sub">Room: {student.room} | Plan: {student.plan}</div>
      </div>

      {/* ONBOARDING BANNER — shown if no mess enrolled */}
      {!isEnrolled && (
        <div className="onboard-banner">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🍴</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
              You're not enrolled in any mess yet!
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, maxWidth: 480 }}>
              Browse our mess directory, explore menus, compare meal plans, and enroll in seconds — your first home-cooked meal is just a tap away.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1, flexShrink: 0 }}>
            <button className="btn" style={{ background: "#fff", color: "#f97316", fontWeight: 800 }} onClick={() => setActiveTab("messDirectory")}>
              🏢 Explore Messes
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }} onClick={() => setActiveTab("messDirectory")}>
              + Enroll Now
            </button>
          </div>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <StatCard label="Next Meal" value="Lunch" note="12:00 PM - 2:30 PM" color="#f97316" />
        <StatCard
          label="Mess Status"
          value={!isEnrolled ? "None" : messPaused ? "Paused" : "Active"}
          note={!isEnrolled ? "Not enrolled" : messPaused ? "Subscription paused" : enrolledMess?.name || student.plan}
          color={!isEnrolled ? "var(--text-muted)" : messPaused ? "#eab308" : "#22c55e"}
        />
        <StatCard label="Pending Dues" value={isPaid ? "₹0" : `₹${student.balance.toLocaleString()}`} note={isPaid ? "All cleared!" : "Please pay soon"} color={isPaid ? "#22c55e" : "#ef4444"} />
      </div>

      {/* MESS MANAGEMENT SECTION */}
      {isEnrolled && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Mess Management 🏢</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Currently Enrolled</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316" }}>{enrolledMess?.name || "HomeBite (Central)"}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{enrolledMess?.plan} · {enrolledMess?.address}</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {messPaused ? (
                  <button className="mess-action-btn" onClick={handleResumeMess}>▶️ Resume Mess</button>
                ) : (
                  <>
                    <button className="mess-action-btn" onClick={() => setShowChangeMess(true)}>🔄 Change Mess</button>
                    <button className="mess-action-btn danger" onClick={() => setShowStopMess(true)}>⏹️ Pause Mess</button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title">Guest Meal Booking 👥</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 10, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ color: "var(--text)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Book an extra meal</div>
                <div style={{ color: "var(--text-sub)", fontSize: 13, lineHeight: 1.5 }}>
                  Having a friend over? Book an extra meal for ₹150. This will be automatically added to your current dues.
                </div>
                {student.guestMeals > 0 && <div style={{ color: "#f97316", fontSize: 13, marginTop: 6, fontWeight: "bold" }}>You have booked {student.guestMeals} guest meal(s) today.</div>}
              </div>
              <button className="btn btn-primary" onClick={handleBookGuestMeal} disabled={messPaused}>+ Book Meal (₹150)</button>
            </div>
          </div>
        </>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Today's Highlights 🍽</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["breakfast","lunch","dinner"].map(m => (
              <div className="meal-card" key={m}>
                <div className="meal-time">{m === "breakfast" ? "☀️ BREAKFAST" : m === "lunch" ? "🌤 LUNCH" : "🌙 DINNER"}</div>
                <div className="meal-items">{todayMenu[m]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Announcements 📢</div>
          <div style={{ padding: 14, background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 10, marginBottom: 12 }}>
            <div style={{ color: "#f97316", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Reminder: Clear pending dues</div>
            <div style={{ color: "var(--text-sub)", fontSize: 13, lineHeight: 1.5 }}>Please clear all your pending mess dues by the 5th of this month.</div>
          </div>
          <div style={{ padding: 14, background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 10 }}>
            <div style={{ color: "#f97316", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Special Sunday Menu 🎉</div>
            <div style={{ color: "var(--text-sub)", fontSize: 13, lineHeight: 1.5 }}>This Sunday, Grand Thali and Ice Cream for dinner!</div>
          </div>
        </div>
      </div>

      {/* CHANGE MESS MODAL */}
      {showChangeMess && (
        <div className="modal-overlay" onClick={() => setShowChangeMess(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="section-title" style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>🔄 Change Your Mess</div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", marginBottom: 20 }}>Select a mess below to switch. The change takes effect immediately.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {messesList.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedNewMess(String(m.id))}
                  style={{
                    padding: "14px 16px",
                    border: "2px solid " + (selectedNewMess === String(m.id) ? "#f97316" : "var(--card-border)"),
                    borderRadius: 12,
                    cursor: "pointer",
                    background: selectedNewMess === String(m.id) ? "rgba(249,115,22,0.08)" : "var(--meal-card)",
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{m.plan} · {m.type}</div>
                  </div>
                  <span className={"badge " + (m.isVeg ? "badge-green" : "badge-red")}>{m.isVeg ? "VEG" : "NON-VEG"}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={handleChangeMess}>Confirm Change</button>
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => setShowChangeMess(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* STOP MESS CONFIRMATION */}
      {showStopMess && (
        <div className="modal-overlay" onClick={() => setShowStopMess(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏹️</div>
            <div className="section-title" style={{ fontSize: 22, marginBottom: 8 }}>Pause Mess Subscription?</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              This will immediately pause your meals at <strong style={{ color: "#f97316" }}>{enrolledMess?.name}</strong>. You can re-activate at any time from your dashboard.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowStopMess(false)}>Keep Active</button>
              <button className="btn" style={{ flex: 1, background: "#ef4444", color: "#fff" }} onClick={handleStopMess}>Yes, Pause Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuPage({ user, showToast }) {
  const [selectedDay, setSelectedDay] = useState(today in weekMenu ? today : "Monday");
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    setEditValues(weekMenu[selectedDay]);
    setEditMode(false);
  }, [selectedDay]);

  const saveMenu = () => {
    weekMenu[selectedDay] = editValues;
    setEditMode(false);
    if(showToast) showToast(`Menu updated for ${selectedDay} ✓`);
  };

  const menu = weekMenu[selectedDay];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Menu & Meal Schedule 🍽</div>
        <div className="page-sub">Weekly meal plan for all students</div>
      </div>
      <div className="enroll-box fade-in">
        <div className="enroll-icon">🏢</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>You are enrolled in:</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", fontFamily: "'Playfair Display', serif" }}>HomeBite (Central)</div>
          <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            <span>🕒 7:30 AM – 10:30 PM</span>
            <span>📍 Ground Floor, Central Block</span>
            <span>💳 Plan: Full Mess (₹3000/mo)</span>
          </div>
        </div>
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
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="section-title" style={{ margin: 0 }}>{selectedDay}'s Menu</div>
            {selectedDay === today && <span className="badge badge-green">Today</span>}
          </div>
          {user?.role === "admin" && (
            editMode ? (
              <div style={{display:"flex", gap:8}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>setEditMode(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={saveMenu}>Save</button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={()=>{setEditValues(menu); setEditMode(true);}}>Edit Menu</button>
            )
          )}
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
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{m.time}</div>
              </div>
              <div style={{ flex: 1, background: "var(--bg)", border: "1px solid #3d2000", borderRadius: 10, padding: "12px 16px", color: "#c49060", fontSize: 13.5, lineHeight: 1.7 }}>
                {editMode ? (
                  <textarea 
                    value={editValues[m.key] || ""} 
                    onChange={e => setEditValues({...editValues, [m.key]: e.target.value})}
                    style={{ width:"100%", background:"transparent", border:"none", color:"#c49060", fontSize:13.5, resize:"vertical", outline:"none", fontFamily:"inherit" }} 
                    rows={2} 
                  />
                ) : (
                  menu[m.key]
                )}
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
                  <td style={{ fontWeight: 700, color: d===today?"#f97316":"var(--text)" }}>{d} {d===today?"🔴":""}</td>
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

function AIChatWidget({ inventory, students }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role:"ai", text:"Hey! HomeBite AI Dietitian Coach here. How can I help you today? Ask me about smart nutrient tracking, healthy alternatives, today's menu, your dues, or stock levels! ✦" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isOpen]);

  const send = async () => {
    const q = input.trim();
    if(!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:q }]);
    setLoading(true);

      setTimeout(() => {
        let reply = "";
        const lq = q.toLowerCase();
        if(lq.includes("menu")) reply = "Today's menu looks delicious! We have special items scheduled for Lunch and Dinner. Check the 'Menu & Schedule' tab for the full breakdown! 🍽";
        else if(lq.includes("nutrient") || lq.includes("diet") || lq.includes("health") || lq.includes("calorie") || lq.includes("track") || lq.includes("protein")) {
          reply = "Looking at today's menu, your lunch is approx 650 kcal with 18g of protein (from Dal/Paneer). Would you like me to log this in your Smart Nutrient Tracker? 🥗";
        }
        else if(lq.includes("stock") || lq.includes("inventory")) {
          const low = inventory.filter(i => i.stock <= i.threshold);
          reply = low.length > 0 ? `Stock Alert: We are running low on ${low.map(l=>l.name).join(", ")}. I've already notified the admin! 📦` : "Great news! All stock levels are currently healthy. ✅";
        }
      else if(lq.includes("dues") || lq.includes("bill") || lq.includes("money")) {
        const unpaid = students.filter(s => !s.paid);
        reply = `There are currently ${unpaid.length} students with outstanding dues. The total pending amount is ₹${unpaid.reduce((a,b)=>a+b.balance,0).toLocaleString()}. 💳`;
      }
      else reply = "That's a great question! As your HomeBite AI, I'm here to make mess management smoother. I'm currently analyzing your data to provide the best advice! ✨";

      setMessages(prev => [...prev, { role:"ai", text:reply }]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <div className={`ai-widget-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '✦'}
      </div>
      {isOpen && (
        <div className="ai-widget-window">
          <div className="ai-widget-header">
            <span style={{ fontSize: 24 }}>✦</span>
            <div className="title">HomeBite AI</div>
            <div className="status" style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, color:"#4ade80", fontSize:11 }}>
              <span className="live-dot" /> Online
            </div>
          </div>
          <div className="ai-widget-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg-bubble ${m.role === 'ai' ? 'ai-msg-ai' : 'ai-msg-user'}`}>
                {m.role === 'ai' && <div className="ai-msg-label">✦ HomeBite AI Dietitian</div>}
                {m.text}
              </div>
            ))}
            {loading && <div className="ai-msg-bubble ai-msg-ai"><div className="ai-msg-label">✦ HomeBite AI Dietitian</div><span style={{ opacity: 0.6 }}>Thinking...</span></div>}
          </div>
          <div className="ai-widget-footer">
            <div className="ai-widget-input-wrap">
              <input placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
              <button className="btn btn-primary btn-sm" onClick={send} disabled={loading} style={{ borderRadius: 8, padding: '6px 10px' }}>↑</button>
            </div>
          </div>
        </div>
      )}
    </>
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
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{s.name}</td>
                  <td>{s.room}</td>
                  <td><span className="badge badge-blue">{s.plan}</span></td>
                  {["breakfast","lunch","dinner"].map(m => (
                    <td key={m}>
                      <input type="checkbox" checked={attendance[s.id]?.[m]||false} onChange={()=>toggleMeal(s.id,m)}
                        style={{ width:16, height:16, cursor:"pointer", accentColor:"#f97316", padding:0, background:"transparent", border:"none" }} />
                    </td>
                  ))}
                  <td><span className={"badge " + (s.paid?"badge-green":"badge-red")}>{s.paid?"Paid":"Unpaid"}</span></td>
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
                    <span style={{ fontWeight:600, color:"var(--text)", fontSize:13 }}>{item.name}</span>
                    <span style={{ fontSize:11, color:"var(--text-muted)", marginLeft:8 }}>{item.category}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color: isLow?"#ef4444":"var(--text-sub)" }}>{item.stock} / {item.capacity} {item.unit}</span>
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

function FeedbackPage({ user, showToast }) {
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

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20 }}>
        {user?.role !== "admin" && (
          <div className="card">
            <div className="section-title">Submit Feedback</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input placeholder="Your name" value={form.student} onChange={e=>setForm({...form,student:e.target.value})} />
              <select value={form.meal} onChange={e=>setForm({...form,meal:e.target.value})}>
                <option value="">Select meal...</option>
                {days.flatMap(d => ["Breakfast","Lunch","Dinner"].map(m => <option key={`${d}-${m}`}>{d} {m}</option>))}
              </select>
              <div>
                <div style={{ fontSize:12, color:"var(--text-muted)", marginBottom:6 }}>Your Rating</div>
                <div style={{ display:"flex", gap:4 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="star"
                      style={{ color: s<=(hover||rating)?"#eab308":"var(--card-border)" }}
                      onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                      onClick={()=>setRating(s)}>★</span>
                  ))}
                </div>
              </div>
              <textarea placeholder="Share your experience..." rows={3} value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} style={{ resize:"vertical" }} />
              <button className="btn btn-primary" onClick={submit}>Submit Feedback</button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="section-title">Recent Reviews</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:450, overflowY:"auto", paddingRight: 4 }}>
            {allFeedbacks.map(f => (
              <div key={f.id} style={{ background:"var(--meal-card)", border:"1px solid var(--card-border)", borderRadius:10, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, color:"var(--text)", fontSize:13 }}>{f.student}</span>
                  <span style={{ color:"#eab308" }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
                </div>
                <div style={{ fontSize:11, color:"var(--text-muted)", margin:"3px 0 6px" }}>{f.meal} · {f.time}</div>
                {f.comment && <div style={{ fontSize:13, color:"var(--text-sub)" }}>"{f.comment}"</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NearbyPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const typeColor = { Canteen:"#f97316", Restaurant:"#22c55e", Café:"#3b82f6", Grocery:"#eab308", Bakery:"#a78bfa" };

  const filteredPlaces = nearbyPlaces.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Nearby Food Places 📍</div>
        <div className="page-sub">Real-time map powered by OpenStreetMap · Pune, India</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))", gap:20 }}>
        <div className="card" style={{ height: 480, position:"relative", padding:0, overflow:"hidden", borderRadius:16, minWidth:"100%" }}>
          <ReactLeafletMap filteredPlaces={filteredPlaces} selected={selected} setSelected={setSelected} typeColor={typeColor} />
        </div>

        <div className="card">
          <div className="section-title" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            Nearby Locations
            <span style={{ fontSize: 12, color:"var(--text-muted)", fontWeight:400, fontFamily:"'DM Sans',sans-serif" }}>{filteredPlaces.length} found</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              placeholder="Search by name or type..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight: 360, overflowY: "auto" }}>
            {filteredPlaces.length === 0 && <div style={{ color: "var(--text-sub)", textAlign: "center", padding: 20 }}>No places found.</div>}
            {filteredPlaces.map((p, i) => (
              <div key={i} onClick={() => setSelected(i===selected?null:i)}
                style={{ background: selected===i?"var(--input-bg)":"var(--bg)", border:`1px solid ${selected===i?"#f97316":"var(--card-border)"}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:700, color:selected===i?"#f97316":"var(--text)", fontSize:13 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>
                      <span style={{ color: typeColor[p.type]||"#f97316" }}>{p.type}</span> · {p.dist} · {p.address}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0, marginLeft:8 }}>
                    <div style={{ color:"#eab308", fontWeight:700 }}>★ {p.rating}</div>
                    <span className={"badge " + (p.open?"badge-green":"badge-red")}>{p.open?"Open":"Closed"}</span>
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

function ReactLeafletMap({ filteredPlaces, selected, setSelected, typeColor }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Wait for Leaflet CSS then init map
    const initMap = () => {
      if (!window.L || mapRef.current?._leaflet_id) return;
      const L = window.L;

      const map = L.map(mapRef.current, { zoomControl: true }).setView([HOSTEL_LAT, HOSTEL_LNG], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // HomeBite marker
      const hostelIcon = L.divIcon({
        className: "",
        html: `<div style="background:#f97316;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 10px #f97316aa;"></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9]
      });
      L.marker([HOSTEL_LAT, HOSTEL_LNG], { icon: hostelIcon })
        .addTo(map)
        .bindPopup("<b>🏠 HomeBite Hostel</b><br/>You are here")
        .openPopup();

      // Place markers
      filteredPlaces.forEach((p, i) => {
        const color = p.open ? (typeColor[p.type] || "#f97316") : "#888888";
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px ${color}88;cursor:pointer;"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7]
        });
        L.marker([p.lat, p.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${p.name}</b><br/><span style="color:${color};font-weight:600">${p.type}</span> · ${p.dist}<br/>★ ${p.rating} · ${p.open ? "Open ✅" : "Closed ❌"}<br/><small>${p.address}</small>`);
      });

      mapRef.current._leafletMap = map;
    };

    // Load Leaflet JS if not already loaded
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current?._leafletMap) {
        mapRef.current._leafletMap.remove();
        delete mapRef.current._leafletMap;
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%", borderRadius: 16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"var(--text-muted)", fontSize:13 }}>
        Loading real map...
      </div>
    </div>
  );
}


function RSVPPage({ showToast }) {
  const [rsvpState, setRsvpState] = useState({
    today: { breakfast: true, lunch: true, dinner: true },
    tomorrow: { breakfast: true, lunch: true, dinner: true }
  });

  const toggleRSVP = (day, meal) => {
    setRsvpState(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: !prev[day][meal] }
    }));
  };

  const saveRSVP = () => {
    showToast("RSVP successfully updated! Thank you for reducing food waste 🌍");
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Meal RSVP 📅</div>
        <div className="page-sub">Opt-out of meals if you're not eating in the mess to save food</div>
      </div>
      
      <div className="grid-2">
        {["today", "tomorrow"].map(day => (
          <div className="card" key={day}>
            <div className="section-title" style={{ textTransform: "capitalize" }}>{day}'s Meals</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["breakfast", "lunch", "dinner"].map(meal => (
                <div key={meal} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)", border: "1px solid #3d2000", padding: "14px", borderRadius: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text)", textTransform: "capitalize", fontSize: 14 }}>{meal}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      {rsvpState[day][meal] ? "✅ You are attending" : "❌ You are skipping"}
                    </div>
                  </div>
                  <label style={{ position:"relative", display:"inline-block", width:44, height:24 }}>
                    <input type="checkbox" checked={rsvpState[day][meal]} onChange={() => toggleRSVP(day, meal)} style={{ opacity:0, width:0, height:0 }} />
                    <span style={{ position:"absolute", cursor:"pointer", top:0, left:0, right:0, bottom:0, backgroundColor: rsvpState[day][meal] ? "#22c55e" : "#ef4444", borderRadius:34, transition:"0.4s" }}>
                      <span style={{ position:"absolute", content:'""', height:16, width:16, left: rsvpState[day][meal] ? 24 : 4, bottom:4, backgroundColor:"white", borderRadius:"50%", transition:"0.4s", boxShadow:"0 2px 4px rgba(0,0,0,0.2)" }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary" onClick={saveRSVP}>Save RSVP Preferences</button>
      </div>
    </div>
  );
}

function OffersPage({ user, offers, setOffers, showToast }) {
  const [form, setForm] = useState({ title: "", description: "", validTill: "", code: "" });

  const addOffer = () => {
    if(!form.title || !form.description) return;
    setOffers(prev => [{ id: Date.now(), ...form }, ...prev]);
    setForm({ title: "", description: "", validTill: "", code: "" });
    showToast("Offer created successfully! 🎁");
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    showToast("Offer deleted successfully.");
  };

  const claimOffer = (code) => {
    showToast(`Offer ${code || "claimed"} applied successfully! 🎉`);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Special Offers 🎁</div>
        <div className="page-sub">Exclusive deals and discounts on meal plans</div>
      </div>

      <div className={user?.role === "admin" ? "grid-2" : ""}>
        {user?.role === "admin" && (
          <div className="card">
            <div className="section-title">Create New Offer</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input placeholder="Offer Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <textarea placeholder="Description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ resize:"vertical" }} />
              <div style={{ display:"flex", gap:10 }}>
                <input placeholder="Promo Code (e.g. SAVE10)" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
                <input placeholder="Valid Till (e.g. 15th May)" value={form.validTill} onChange={e=>setForm({...form,validTill:e.target.value})} />
              </div>
              <button className="btn btn-primary" onClick={addOffer}>Publish Offer</button>
            </div>
          </div>
        )}

        <div className="card" style={{ maxWidth: user?.role === "admin" ? "none" : 800, margin: user?.role === "admin" ? 0 : "0 auto" }}>
          <div className="section-title">Active Offers</div>
          {offers.length === 0 ? (
            <div style={{ color:"var(--text-sub)" }}>No active offers at the moment. Check back later!</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {offers.map(o => (
                <div key={o.id} style={{ border:"1px solid #f97316", background:"var(--input-bg)", padding:16, borderRadius:12, position:"relative" }}>
                  <div style={{ fontWeight:700, fontSize:16, color:"#f97316", marginBottom:4 }}>{o.title}</div>
                  <div style={{ color:"var(--text-sub)", fontSize:13, lineHeight:1.5, marginBottom:12 }}>{o.description}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      {o.code && <span className="badge badge-green" style={{ fontSize:12 }}>{o.code}</span>}
                      {o.validTill && <span style={{ fontSize:11, color:"var(--text-sub)" }}>Valid till: {o.validTill}</span>}
                    </div>
                    {user?.role === "admin" ? (
                      <button className="btn btn-ghost btn-sm" onClick={()=>deleteOffer(o.id)} style={{ color:"#ef4444" }}>Delete</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={()=>claimOffer(o.code)}>Claim Offer</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserProfilePage({ profile, setProfile, showToast }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(profile);

  const save = () => {
    setProfile(form);
    setEdit(false);
    showToast("Profile updated successfully! ✓");
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">My Profile 👤</div>
        <div className="page-sub">Manage your personal information and preferences</div>
      </div>

      <div className="profile-grid">
        <div style={{ textAlign: "center" }}>
          <div className="user-avatar-large" style={{ margin: "0 auto 20px" }}>🎒</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f97316", fontFamily: "'Playfair Display', serif" }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>ID: {profile.id}</div>
          <button className="btn btn-ghost" style={{ marginTop: 20, width: "100%" }} onClick={() => setEdit(!edit)}>{edit ? "Cancel Edit" : "Edit Profile"}</button>
        </div>

        <div>
          <div className="profile-section">
            <div className="section-title">Personal Details</div>
            <div className="grid-2">
              <div className="profile-field">
                <label>Full Name</label>
                {edit ? <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /> : <div style={{ color:"var(--text)" }}>{profile.name}</div>}
              </div>
              <div className="profile-field">
                <label>Home Address</label>
                {edit ? <textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /> : <div style={{ color:"var(--text)" }}>{profile.address}</div>}
              </div>
              <div className="profile-field">
                <label>Current Location</label>
                {edit ? <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /> : <div style={{ color:"var(--text)" }}>{profile.location}</div>}
              </div>
              <div className="profile-field">
                <label>Contact Email</label>
                {edit ? <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /> : <div style={{ color:"var(--text)" }}>{profile.email}</div>}
              </div>
            </div>
            {edit && <button className="btn btn-primary" onClick={save} style={{ marginTop:10 }}>Save Changes</button>}
          </div>

          <div className="profile-section">
            <div className="section-title">Payment Options 💳</div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              {["Visa ending in 4242", "UPI: aanyasharma@okaxis", "Apple Pay"].map((p, i) => (
                <div key={i} style={{ background: "var(--card-bg)", border: "1px solid #3d2000", padding: "12px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{p.includes("UPI") ? "📱" : "💳"}</span>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{p}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Primary Method</div>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" style={{ borderStyle: "dashed" }}>+ Add New Method</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessDirectoryPage({ showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({ name: "", email: "", phone: "", plan: "Monthly" });

  const filteredMesses = messesList.filter(m => 
    (filter === "All" || (filter === "Veg" ? m.isVeg : !m.isVeg)) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!enrollForm.password) {
      showToast("Please provide a password for your account.");
      return;
    }
    const res = await db.signup({
      username: enrollForm.email,
      password: enrollForm.password,
      name: enrollForm.name,
      role: "student",
      phone: enrollForm.phone,
      plan: enrollForm.plan
    });

    if (res.success) {
      showToast(`Welcome aboard, ${enrollForm.name}! 🎉 You are now enrolled.`);
      setShowEnrollModal(false);
    } else {
      showToast(res.message || "Enrollment failed.");
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Mess Directory 🏢</div>
        <div className="page-sub">Explore different messes, timings, and details</div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <input 
              placeholder="Search by mess name or type..." 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
            />
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ width: 140 }}>
            <option>All</option>
            <option>Veg</option>
            <option>Non-Veg</option>
          </select>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {filteredMesses.map(m => (
            <div key={m.id} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} style={{ background:"var(--bg)", border:`1px solid ${expandedId === m.id ? "#f97316" : "var(--card-border)"}`, padding:16, borderRadius:12, cursor:"pointer", transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  {m.img && (
                    <img src={m.img} alt={m.name} style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontWeight:700, fontSize:16, color:"var(--text)" }}>{m.name}</div>
                      <span className={"badge " + (m.isVeg ? "badge-green" : "badge-red")} style={{ padding: "1px 6px", fontSize: 9 }}>{m.isVeg ? "VEG" : "NON-VEG"}</span>
                    </div>
                    <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:4 }}>{m.type} · {m.distance}</div>
                    <div style={{ fontSize:12, color:"var(--text-sub)", marginBottom:12 }}>📍 {m.address}</div>
                    
                    <div style={{ display:"flex", gap:16, fontSize:13, color:"var(--text-sub)" }}>
                      <div><span style={{color:"#f97316"}}>🌅 Opens:</span> {m.open}</div>
                      <div><span style={{color:"#f97316"}}>🌙 Closes:</span> {m.close}</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:"#eab308", fontWeight:700, marginBottom:8 }}>★ {m.rating}</div>
                  <span className={"badge " + (m.status==="Open"?"badge-green":"badge-red")}>{m.status}</span>
                </div>
              </div>
              
              {expandedId === m.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--card-border)", animation: "fadeIn 0.3s ease-out" }}>
                  <div className="grid-3" style={{ gap: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                    <div style={{ background: "var(--card-bg)", padding: 12, borderRadius: 8, border: "1px solid var(--card-border)" }}>
                      <div style={{ color: "#f97316", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>📋 Meal Plan</div>
                      <div style={{ color: "var(--text-sub)", fontSize: 13 }}>{m.plan}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", padding: 12, borderRadius: 8, border: "1px solid var(--card-border)" }}>
                      <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🎁 Offers & Deals</div>
                      <div style={{ color: "var(--text-sub)", fontSize: 13 }}>{m.offers.join(", ")}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", padding: 12, borderRadius: 8, border: "1px solid var(--card-border)" }}>
                      <div style={{ color: "#eab308", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🍽 Menu Highlights</div>
                      <div style={{ color: "var(--text-sub)", fontSize: 13 }}>{m.menu}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", padding: 12, borderRadius: 8, border: "1px solid var(--card-border)" }}>
                      <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>📞 Contact Details</div>
                      <div style={{ color: "var(--text-sub)", fontSize: 13 }}>{m.contact}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowEnrollModal(true);
                      }}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showEnrollModal && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="section-title" style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>Enroll & Sign In 🍽</div>
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", marginBottom: 24 }}>Enter your details to enroll in this mess and create your student account.</p>
            <form onSubmit={handleEnroll} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Full Name" value={enrollForm.name} onChange={e=>setEnrollForm({...enrollForm,name:e.target.value})} required />
              <input type="email" placeholder="Email Address" value={enrollForm.email} onChange={e=>setEnrollForm({...enrollForm,email:e.target.value})} required />
              <input type="password" placeholder="Create Password" value={enrollForm.password || ""} onChange={e=>setEnrollForm({...enrollForm,password:e.target.value})} required />
              <input placeholder="Phone Number" value={enrollForm.phone} onChange={e=>setEnrollForm({...enrollForm,phone:e.target.value})} required />
              <select value={enrollForm.plan} onChange={e=>setEnrollForm({...enrollForm,plan:e.target.value})}>
                <option>Monthly (Full Mess)</option>
                <option>Lunch Only</option>
                <option>Dinner Only</option>
              </select>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Complete Enrollment</button>
            </form>
            <button className="btn btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => setShowEnrollModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────

function SettingsPage({ theme, setTheme }) {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Settings ⚙️</div>
        <div className="page-sub">Customize your HomeBite experience</div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="section-title">Appearance</div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Choose your preferred theme. The entire interface will update instantly.</div>
          <div className="theme-toggle">
            <div className={`theme-option ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
              🌙 Dark Mode
            </div>
            <div className={`theme-option ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
              ☀️ Light Mode
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="section-title">Notifications</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["Meal reminders", "Low stock alerts", "Dues payment reminders", "New offers & deals"].map(item => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 12 }}>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{item}</span>
              <div
                style={{ width: 44, height: 24, borderRadius: 99, background: "#f97316", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", right: 3, top: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
          ))}
        </div>

        <hr className="divider" />

        <div className="section-title">About</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "App Version", value: "HomeBite v1.0" },
            { label: "Backend Status", value: "Connected ✅" },
            { label: "Database", value: "Real-time Socket.io" },
            { label: "Last Sync", value: new Date().toLocaleTimeString() },
          ].map(d => (
            <div key={d.label} style={{ padding: "14px 16px", background: "var(--meal-card)", border: "1px solid var(--card-border)", borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{d.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

function AdminLoginPage({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("Please enter username and password.");
    const res = await db.login(username, password);
    if (res.success && res.role === "admin") {
      onLogin("admin", res.id);
    } else {
      setError(res.message || "Invalid Admin credentials");
    }
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"url('/homefood_bg.png') center/cover no-repeat", position: "relative", width:"100vw" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(20, 10, 0, 0.8)", zIndex: 0 }} />
      <style>{getStyle('dark')}</style>
      <div className="card" style={{ width: 400, position: "relative", zIndex: 1, padding: 32, borderTop: "4px solid #eab308", borderBottom: "4px solid #eab308", boxShadow: "0 24px 64px rgba(234, 179, 8, 0.15)" }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ position: "absolute", top: 16, left: 16, padding: "4px 8px" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 24, marginTop: 12 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🛡️</div>
          <h2 style={{ margin: 0, color: "#eab308", fontFamily: "'Playfair Display', serif", fontSize: 26 }}>Admin Portal Access</h2>
          <div style={{ color: "var(--text-sub)", fontSize: 13, marginTop: 4 }}>Restricted area for authorized personnel</div>
        </div>
        
        {error && <div style={{ background: "rgba(220, 38, 38, 0.1)", color: "#f87171", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 20, border: "1px solid rgba(220, 38, 38, 0.3)", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-sub)", marginLeft: 4, fontWeight: 600 }}>Administrator Username <span style={{color:"#ef4444"}}>*</span></label>
            <input placeholder="Enter admin username" value={username} onChange={e=>setUsername(e.target.value)} style={{ marginTop: 6, padding: "12px 16px" }} required />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-sub)", marginLeft: 4, fontWeight: 600 }}>Authorized Password <span style={{color:"#ef4444"}}>*</span></label>
            <input type="password" placeholder="••••••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{ marginTop: 6, padding: "12px 16px" }} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12, padding: "14px", fontSize: 15, background: "#eab308", color: "var(--bg)", border: "none" }}>Secure Login</button>
        </form>
        <div style={{ marginTop: 20, fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
          Hint: User "admin", password "admin123"
        </div>
      </div>
    </div>
  );
}

function StudentLoginPage({ onLogin, onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (isSignUp) {
      if (!username || !password || !name) return setError("Please fill all required fields.");
      const res = await db.signup({ username, password, name, role: "student" });
      if (res.success) onLogin(res.role, res.id);
      else setError(res.message);
    } else {
      if (!username || !password) return setError("Please enter username and password.");
      const res = await db.login(username, password);
      if (res.success && res.role === "student") onLogin(res.role, res.id);
      else setError(res.message || "Invalid Student credentials");
    }
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"url('/homefood_bg.png') center/cover no-repeat", position: "relative", width:"100vw" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,15,0,0.75)", zIndex: 0 }} />
      <style>{getStyle('dark')}</style>
      <div className="card" style={{ width: 360, position: "relative", zIndex: 1, padding: 32, boxShadow: "0 24px 64px rgba(249, 115, 22, 0.15)", borderTop: "4px solid #f97316" }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ position: "absolute", top: 16, left: 16, padding: "4px 8px" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 24, marginTop: 12 }}>
          <div style={{ fontSize: 44, marginBottom: 8, filter: "drop-shadow(0 4px 8px rgba(249,115,22,0.4))" }}>🍽️</div>
          <h2 style={{ margin: 0, color: "#f97316", fontFamily: "'Playfair Display', serif", fontSize: 24 }}>{isSignUp ? "Create Account" : "Student Login"}</h2>
          <div style={{ color: "var(--text-sub)", fontSize: 13, marginTop: 4 }}>Access your mess dashboard</div>
        </div>
        
        {error && <div style={{ background:"rgba(220, 38, 38, 0.1)", color:"#f87171", padding:12, borderRadius:8, fontSize:13, marginBottom:16, border:"1px solid rgba(220, 38, 38, 0.3)", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize:12, color:"var(--text-sub)", marginLeft:4, fontWeight: 600 }}>Full Name <span style={{color:"#ef4444"}}>*</span></label>
              <input placeholder="Aanya Sharma" value={name} onChange={e=>setName(e.target.value)} style={{ marginTop:6 }} required />
            </div>
          )}
          <div>
            <label style={{ fontSize:12, color:"var(--text-sub)", marginLeft:4, fontWeight: 600 }}>{isSignUp ? "Choose User ID" : "User ID"} <span style={{color:"#ef4444"}}>*</span></label>
            <input placeholder="E.g., HB001" value={username} onChange={e=>setUsername(e.target.value)} style={{ marginTop:6 }} required />
          </div>
          <div>
            <label style={{ fontSize:12, color:"var(--text-sub)", marginLeft:4, fontWeight: 600 }}>Password <span style={{color:"#ef4444"}}>*</span></label>
            <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{ marginTop:6 }} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 10, padding: 12, fontSize: 14 }}>{isSignUp ? "Sign Up Now" : "Sign In"}</button>
        </form>
        <div style={{ marginTop: 24, fontSize:13, color:"var(--text-sub)", textAlign:"center" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"} <span style={{ color: "#f97316", fontWeight: "bold", cursor:"pointer", textDecoration:"underline" }} onClick={()=>{setIsSignUp(!isSignUp); setError("");}}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </div>
        <div style={{ marginTop: 12, fontSize:11, color:"var(--text-muted)", textAlign:"center" }}>
          Hint: User "HB001" / any password
        </div>
      </div>
    </div>
  );
}

function PortalSelector({ onSelect }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"url('/homefood_bg.png') center/cover no-repeat", position: "relative", width:"100vw" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,15,0,0.7)", zIndex: 0 }} />
      <style>{getStyle('dark')}</style>
      <div style={{ textAlign:"center", marginBottom:48, position: "relative", zIndex: 1 }}>
        <div className="logo-title" style={{ fontSize:52, marginBottom: 8 }}>HomeBite</div>
        <div className="logo-sub" style={{ fontSize:15, letterSpacing: 4, color:"var(--text-sub)" }}>SELECT YOUR PORTAL</div>
      </div>
      <div style={{ display:"flex", gap:32, flexWrap:"wrap", justifyContent:"center", position: "relative", zIndex: 1 }}>
        <div
          className="card"
          style={{ width: 260, padding: 32, cursor:"pointer", textAlign:"center", transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", borderTop: "4px solid #f97316", background: "rgba(37, 18, 0, 0.8)", backdropFilter: "blur(10px)" }}
          onClick={() => onSelect("student")}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-10px)"; e.currentTarget.style.boxShadow="0 24px 48px rgba(249,115,22,0.3)"; e.currentTarget.style.background="var(--sidebar-bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.background="rgba(37, 18, 0, 0.8)"; }}
        >
          <div style={{ fontSize:64, marginBottom:20, filter: "drop-shadow(0 8px 16px rgba(249,115,22,0.4))" }}>🍽️</div>
          <div className="section-title" style={{ color:"#f97316", margin:0, fontSize: 22 }}>Student Portal</div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 8, lineHeight: 1.5 }}>View menus, track dues, and order meals</div>
        </div>
        <div
          className="card"
          style={{ width: 260, padding: 32, cursor:"pointer", textAlign:"center", transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", borderTop: "4px solid #eab308", background: "rgba(37, 18, 0, 0.8)", backdropFilter: "blur(10px)" }}
          onClick={() => onSelect("admin")}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-10px)"; e.currentTarget.style.boxShadow="0 24px 48px rgba(234,179,8,0.3)"; e.currentTarget.style.background="var(--sidebar-bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.background="rgba(37, 18, 0, 0.8)"; }}
        >
          <div style={{ fontSize:64, marginBottom:20, filter: "drop-shadow(0 8px 16px rgba(234,179,8,0.4))" }}>🛡️</div>
          <div className="section-title" style={{ color:"#eab308", margin:0, fontSize: 22 }}>Admin Portal</div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 8, lineHeight: 1.5 }}>Manage inventory, users, and mess plans</div>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, marginTop: 48, fontSize: 12, color: "#5a3820", textAlign: "center" }}>
        Powered by HomeBite v1.2 · Real-time Backend Active
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [portalSelect, setPortalSelect] = useState(null);

  if (!portalSelect) return <PortalSelector onSelect={setPortalSelect} />;
  if (portalSelect === "admin") return <AdminLoginPage onLogin={onLogin} onBack={() => setPortalSelect(null)} />;
  return <StudentLoginPage onLogin={onLogin} onBack={() => setPortalSelect(null)} />;
}

// ─── SPLASH SCREEN ─────────────────────────────────────────────────────────────

function SplashScreen({ theme }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", position: "relative", width: "100vw", overflow: "hidden",
      background: "url('/homefood_bg.png') center/cover no-repeat",
      color: "#fff"
    }}>
      <div style={{ position: "absolute", inset: 0, background: theme === 'dark' ? "rgba(26,15,0,0.8)" : "rgba(255,248,240,0.85)", zIndex: 0 }} />
      <style>{getStyle(theme)}</style>
      
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{
          width: 120, height: 120, margin: "0 auto 24px auto", background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          borderRadius: "30%", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: theme === 'dark' ? "0 20px 40px rgba(249,115,22,0.4)" : "0 20px 40px rgba(249,115,22,0.3)",
          transform: "rotate(-10deg)",
          animation: "float 4s ease-in-out infinite"
        }}>
          <span style={{ fontSize: 64, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))", transform: "rotate(10deg)" }}>🍽️</span>
        </div>
        
        <h1 style={{ fontSize: 56, fontWeight: 900, fontFamily: "'Playfair Display', serif", margin: 0, 
                     background: "linear-gradient(to right, #f97316, #eab308)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                     letterSpacing: -1 }}>
          HomeBite
        </h1>
        <p style={{ fontSize: 18, color: theme === 'dark' ? "var(--text-sub)" : "#8a5c30", letterSpacing: 4, textTransform: "uppercase", marginTop: 8, fontWeight: 600 }}>
          Mess Management
        </p>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 8 }}>
          <div className="pulse-dot" style={{ background: "#f97316", width: 10, height: 10, animationDelay: "0s" }} />
          <div className="pulse-dot" style={{ background: "#f97316", width: 10, height: 10, animationDelay: "0.2s" }} />
          <div className="pulse-dot" style={{ background: "#f97316", width: 10, height: 10, animationDelay: "0.4s" }} />
        </div>
      </div>
      
      <style>{`
        @keyframes scaleUp {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }
      `}</style>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setThemeState] = useState(() => localStorage.getItem('hb_theme') || 'dark');
  const [enrolledMess, setEnrolledMess] = useState(() => messesList[0]); // default: HomeBite Central

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('hb_theme', t);
  };
  
  // Real-time Database State
  const [students, setStudentsState] = useState(() => db.get('students'));
  const [inventory, setInventoryState] = useState(() => db.get('inventory'));
  const [offers, setOffersState] = useState(() => db.get('offers'));
  const [notifications, setNotificationsState] = useState(() => db.get('notifications'));
  const [profile, setProfileState] = useState(() => db.get('profile') || {
    name: "Aanya Sharma",
    id: "HB001",
    address: "Block A, Room 101, Central Hostel, Campus Estate",
    location: "Mumbai, India",
    email: "aanya.s@university.edu"
  });

  const [toast, setToast] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifs]);

  // Persistence Wrappers
  const setStudents = (val) => { db.set('students', typeof val === 'function' ? val(students) : val); };
  const setInventory = (val) => { db.set('inventory', typeof val === 'function' ? val(inventory) : val); };
  const setOffers = (val) => { db.set('offers', typeof val === 'function' ? val(offers) : val); };
  const setNotifications = (val) => { db.set('notifications', typeof val === 'function' ? val(notifications) : val); };
  const setProfile = (val) => { db.set('profile', typeof val === 'function' ? val(profile) : val); };

  // Sync Listener
  useEffect(() => {
    return db.subscribe((data) => {
      setStudentsState(data.students);
      setInventoryState(data.inventory);
      setOffersState(data.offers);
      setNotificationsState(data.notifications);
      if(data.profile) setProfileState(data.profile);
    });
  }, [students, inventory, offers, notifications, profile]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  let navItems = [];
  if (user && user.role === "admin") {
    navItems = [
      { id:"dashboard", icon:"\u229e", label:"Dashboard" },
      { id:"menu", icon:"\ud83c\udf7d", label:"Menu & Schedule" },
      { id:"attendance", icon:"\ud83d\udccb", label:"Attendance & Billing" },
      { id:"inventory", icon:"\ud83d\udce6", label:"Inventory" },
      { id:"offers", icon:"\ud83c\udf81", label:"Offers & Deals" },
      { id:"feedback", icon:"\u2b50", label:"Feedback" },
      { id:"settings", icon:"\u2699\ufe0f", label:"Settings" },
    ];
  } else if (user && user.role === "student") {
    navItems = [
      { id:"studentDashboard", icon:"\ud83c\udf7d\ufe0f", label:"My Dashboard" },
      { id:"menu", icon:"\ud83d\uddd3\ufe0f", label:"Menu & Schedule" },
      { id:"messDirectory", icon:"\ud83c\udfe2", label:"Mess Directory" },
      { id:"offers", icon:"\ud83c\udf81", label:"Offers & Deals" },
      { id:"rsvp", icon:"\ud83d\udcc5", label:"Meal RSVP" },
      { id:"feedback", icon:"\u2b50", label:"Submit Feedback" },
      { id:"nearby", icon:"\ud83d\udccd", label:"Nearby Food" },
      { id:"profile", icon:"\ud83d\udc64", label:"My Profile" },
      { id:"settings", icon:"\u2699\ufe0f", label:"Settings" },
    ];
  }

  const renderPage = () => {
    switch(activeTab) {
      case "dashboard": return <Dashboard students={students} inventory={inventory} />;
      case "studentDashboard": {
        const me = students?.find(s => s.id === user.id) || students?.[0] || { id:"?", name:"Student", room:"-", plan:"Full Mess", paid:true, balance:0 };
        return <StudentDashboard student={me} enrolledMess={enrolledMess} setEnrolledMess={setEnrolledMess} setActiveTab={setActiveTab} showToast={showToast} setStudents={setStudents} />;
      }
      case "menu": return <MenuPage user={user} showToast={showToast} />;
      case "attendance": return <AttendancePage students={students} setStudents={setStudents} showToast={showToast} />;
      case "inventory": return <InventoryPage inventory={inventory} setInventory={setInventory} showToast={showToast} />;
      case "feedback": return <FeedbackPage user={user} showToast={showToast} />;
      case "offers": return <OffersPage user={user} offers={offers} setOffers={setOffers} showToast={showToast} />;
      case "nearby": return <NearbyPage />;
      case "rsvp": return <RSVPPage showToast={showToast} />;
      case "messDirectory": return <MessDirectoryPage showToast={showToast} setEnrolledMess={setEnrolledMess} />;
      case "profile": return <UserProfilePage profile={profile} setProfile={setProfile} showToast={showToast} />;
      case "settings": return <SettingsPage theme={theme} setTheme={setTheme} />;
      default: return null;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen theme={theme} />;
  }

  if (!user) {
    return <LoginPage onLogin={(role, id) => {
      setUser({ role, id });
      setActiveTab(role === "admin" ? "dashboard" : "studentDashboard");
    }} />;
  }

  return (
    <>
      <style>{getStyle(theme)}</style>
      <div className="hb-root">
        <nav className="sidebar">
          <div className="logo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 20 }}>
            <div>
              <div className="logo-title">HomeBite</div>
              <div className="logo-sub">Mess Management</div>
            </div>
            <div className="notif-bell" ref={notifRef} onClick={() => setShowNotifs(!showNotifs)}>
              🔔
              {notifications.filter(n=>n.unread).length > 0 && <span className="notif-badge">{notifications.filter(n=>n.unread).length}</span>}
              {showNotifs && (
                <div className="notif-dropdown" onClick={e=>e.stopPropagation()}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--sidebar-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, color: "var(--text)" }}>Notifications</div>
                    {notifications.filter(n=>n.unread).length > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setNotifications(prev => prev.map(n => ({...n, unread:false}))); }} style={{ padding: "4px 8px", fontSize: 11 }}>Mark all read</button>
                    )}
                  </div>
                  <div style={{ padding: 8 }}>
                    {notifications.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No notifications</div>}
                    {notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`} style={{ borderRadius: 8, marginBottom: 4 }} onClick={() => {
                          setNotifications(prev => prev.map(notif => notif.id===n.id ? {...notif, unread:false} : notif));
                      }}>
                        <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ padding: "0 20px" }}>
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              Backend Server: Connected
            </div>
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
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 8 }}>
              <div style={{ cursor: "pointer" }} onClick={() => setActiveTab("profile")}>
                <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 13 }}>
                  {user?.role === "student"
                    ? (students?.find(s => s.id === user.id)?.name || user.id)
                    : "Administrator"}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{user?.id} · {user?.role === "admin" ? "Admin" : "Student"}</div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ padding:"4px 8px", fontSize:10 }} onClick={() => setUser(null)}>Logout</button>
            </div>
            <div
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0", fontSize: 12, color: "var(--text-muted)", userSelect: "none" }}
            >
              <span>{theme === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19'}</span>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </div>
          </div>
        </nav>

        <main className="main">
          {renderPage()}
        </main>

        <AIChatWidget inventory={inventory} students={students} />

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
