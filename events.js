const path = require('path');

// วันที่เริ่มแจ้งเตือน BEAR HUNT (นับเป็นวันแรกของรอบ วันเว้นวัน) - เวลาไทย
const START_DATE = '2026-07-03';

// รันแบบตารางวันเว้นวัน (เป็น default เมื่อไม่ระบุ MODE) ส่วนที่เหลือรันแบบแมนนวลผ่าน node index.js <ชื่อ event>
const events = {
  bear: {
    webhookUrl: process.env.WEBHOOK_DISCORD_BEAR,
    imagePath: path.join(__dirname, 'src', 'image', 'bear', 'bear.png'),
    imageName: 'bear.png',
    content: "@everyone 🐻 BEAR HUNT is starting at 20:10 (13:10UTC) ⚔️"
  },
  cesares: {
    webhookUrl: process.env.WEBHOOK_DISCORD_CESARES,
    imagePath: path.join(__dirname, 'src', 'image', 'cesares', 'cesareslv1.png'),
    imageName: 'cesares-fury-event-icon.webp',
    content: "@everyone 🤖 CESARES FURY event is starting at 20:10 (13:10UTC)"
  },
  sword_land: {
    webhookUrl: process.env.WEBHOOK_DISCORD_SWORD_LAND,
    imagePath: path.join(__dirname, 'src', 'image', 'swordland', 'swordland.jpg'),
    imageName: 'swordland.jpg',
    // content: "@everyone ⚔️ SWORD LAND Legion 1 event is starting at 21:00 (14:00UTC)"
    content: "@everyone ⚔️ SWORD LAND Legion 2 event is starting at 02:00 (19:00UTC)"
  }
};

module.exports = { events, START_DATE };
