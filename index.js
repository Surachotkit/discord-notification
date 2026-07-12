require('dotenv').config();
const { sendDiscordNotification } = require('./utils/discord');
const { isNotifyDay } = require('./utils/date');
const { events, START_DATE } = require('./events');

// สคริปต์นี้รันครั้งเดียวแล้วจบ (ตัวจับเวลา 20:00 น. ตามเวลาไทย เป็นหน้าที่ของ GitHub Actions cron)
// FORCE_SEND=true (ตั้งจาก workflow_dispatch) ใช้ตอนสั่งรันมือเพื่อทดสอบ ข้ามการเช็ควันเว้นวัน
// MODE (เช่น node index.js cesares) สั่งส่ง event นั้นๆ ทันทีแบบแมนนวล ข้ามการเช็ควันเว้นวัน
const FORCE_SEND = process.env.FORCE_SEND === 'true';
const MODE = process.argv[2];

if (MODE && events[MODE]) {
  sendDiscordNotification(events[MODE]);
} else if (FORCE_SEND || isNotifyDay(START_DATE)) {
  sendDiscordNotification(events.bear);
} else {
  console.log(`[${new Date().toLocaleString('th-TH')}] วันนี้เป็นวันเว้น ไม่ส่งแจ้งเตือน`);
}
