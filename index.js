require('dotenv').config();
const { sendDiscordNotification } = require('./utils/discord');
const { events } = require('./events');

// MODE (เช่น node index.js cesares) สั่งส่ง event นั้นๆ ทันทีแบบแมนนวล ข้ามการเช็ควันเว้นวัน
const FORCE_SEND = process.env.FORCE_SEND === 'true';
const MODE = process.argv[2]; // npm run bear

if (MODE && events[MODE]) {
  sendDiscordNotification(events[MODE]);
} else {
  console.log(`[${new Date().toLocaleString('th-TH')}] วันนี้เป็นวันเว้น ไม่ส่งแจ้งเตือน`);
}
