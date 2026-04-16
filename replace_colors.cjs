const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { p: /"#1a0f00"/g, r: '"var(--bg)"' },
  { p: /"#1e0f00"/g, r: '"var(--bg2)"' },
  { p: /"#251200"/g, r: '"var(--card-bg)"' },
  { p: /"#3d2000"/g, r: '"var(--card-border)"' },
  { p: /"#2c1500"/g, r: '"var(--input-bg)"' },
  { p: /"#2a1500"/g, r: '"var(--table-border)"' },
  { p: /"#fdf3e3"/g, r: '"var(--text)"' },
  { p: /"#f5c89a"/g, r: '"var(--text)"' },
  { p: /"#7a5030"/g, r: '"var(--text-muted)"' },
  { p: /"#a07050"/g, r: '"var(--text-sub)"' },
  { p: /"#d4a57a"/g, r: '"var(--text-sub)"' },
  { p: /"#8a6040"/g, r: '"var(--text-muted)"' },
  { p: /"rgba\(26,\s*15,\s*0,\s*0\.6\)"/g, r: '"var(--input-bg)"' },
  { p: /"rgba\(44,\s*21,\s*0,\s*0\.9\)"/g, r: '"var(--sidebar-bg)"' }
];

replacements.forEach(({p, r}) => {
  content = content.replace(p, r);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Colors replaced successfully.");
