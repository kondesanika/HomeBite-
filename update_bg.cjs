const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const result = content.replace(/premium_bg\.png/g, 'homefood_bg.png');
fs.writeFileSync('src/App.tsx', result);
console.log('Done mapping premium_bg -> homefood_bg');
