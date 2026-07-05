require('dotenv').config();
const fs = require('fs');
const path = require('path');

const WEBHOOK_URL = process.env.WEBHOOK_DISCORD;
const IMAGE_PATH = path.join(__dirname, 'src', 'image', 'bear.png');

// วันที่เริ่มแจ้งเตือน (นับเป็นวันแรกของรอบ วันเว้นวัน) - เวลาไทย
const START_DATE = '2026-07-03';

function toUTCDateOnly(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function isNotifyDay() {
  const todayBangkok = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const daysSinceStart = (toUTCDateOnly(todayBangkok) - toUTCDateOnly(START_DATE)) / 86400000;
  return daysSinceStart % 2 === 0;
}

async function sendNotification() {
  try {
    const form = new FormData();
    form.append('payload_json', JSON.stringify({
      content: "@everyone 🐻 BEAR HUNT is starting at 20:10 Gear up and get ready to hunt! ⚔️",
      embeds: [{ image: { url: 'attachment://bear.png' } }],
      allowed_mentions: { parse: ["everyone"] }
    }));
    form.append('files[0]', new Blob([fs.readFileSync(IMAGE_PATH)]), 'bear.png');

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: form
    });

    if (res.ok) {
      console.log(`[${new Date().toLocaleString('th-TH')}] ส่งแจ้งเตือนสำเร็จ`);
    } else {
      console.error(`ส่งไม่สำเร็จ: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
  }
}

// สคริปต์นี้รันครั้งเดียวแล้วจบ (ตัวจับเวลา 20:00 น. ตามเวลาไทย เป็นหน้าที่ของ GitHub Actions cron)
// FORCE_SEND=true (ตั้งจาก workflow_dispatch) ใช้ตอนสั่งรันมือเพื่อทดสอบ ข้ามการเช็ควันเว้นวัน
const FORCE_SEND = process.env.FORCE_SEND === 'true';

if (FORCE_SEND || isNotifyDay()) {
  sendNotification();
} else {
  console.log(`[${new Date().toLocaleString('th-TH')}] วันนี้เป็นวันเว้น ไม่ส่งแจ้งเตือน`);
}