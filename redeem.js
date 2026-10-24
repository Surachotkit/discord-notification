require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { redeemCode } = require('./utils/giftcode');
const { sendGiftCodeNotification } = require('./utils/discord');

const GIFTCODE_WEBHOOK = process.env.WEBHOOK_DISCORD_GIFTCODE;

// หน่วงเวลา (Delay) เพื่อป้องกันการยิงรัวจนโดนบล็อก
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// รวมผลลัพธ์ทุกไอดีเป็นข้อความสรุปข้อความเดียว สำหรับแจ้งเตือน Discord
function buildSummary(code, results) {
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const line = (r) => `- ID: ${r.playerId}, ${r.name}, K${r.kid} -> ${r.message}`;

  return [
    `🎁 Gift-code: "${code}"`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `✨ Total: ${results.length}`,
    `✅ Success: ${success.length}`,
    `❌ Failed: ${failed.length}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `✅ Success (${success.length})`,
    ...success.map(line),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `❌ Failed (${failed.length})`,
    ...failed.map(line),
  ].join('\n');
}

async function redeemGiftCodeForAllPlayers() {
  // แสดง prompt แล้ว "รอ" ให้ผู้ใช้พิมพ์ทาง terminal — พอ Enter จะเรียก callback พร้อมค่าที่พิมพ์เป็น code
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('🎁 กรุณากรอก Gift Code ที่ต้องการแลก: ', async (code) => {
    code = code.trim();
    rl.close();

    if (!code) {
      console.log('❌ กรุณาใส่โค้ดให้ถูกต้อง');
      return;
    }

    // อ่านไฟล์รายชื่อ Player ID จาก users.txt
    try {
      if (!fs.existsSync('users.txt')) {
        console.log('⚠️ ไม่พบไฟล์ users.txt กรุณาสร้างไฟล์และใส่ Player ID ก่อนครับ');
        return;
      }

      const data = fs.readFileSync('users.txt', 'utf8');

      // แต่ละบรรทัดเป็น "fid,kid,name" เช่น 987654321,512,JohnDoe
      const players = data.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [fid, kid, name] = line.split(',').map(part => part.trim());
          return { fid, kid, name: name || fid };
        })
        .filter(({ fid, kid }) => fid && kid);

      if (players.length === 0) {
        console.log('⚠️ ไม่มี Player ID ในไฟล์ users.txt (ตรวจสอบว่าแต่ละบรรทัดเป็น fid,kid,name)');
        return;
      }

      console.log(`\n🚀 เริ่มส่งโค้ด "${code}" ให้ทั้งหมด ${players.length} ไอดี...\n`);

      // วนลูปส่งข้อมูลทีละไอดี เก็บผลลัพธ์ไว้สรุปทีเดียวตอนจบ
      const results = [];
      for (let i = 0; i < players.length; i++) {
        const { fid, kid, name } = players[i];
        const result = await redeemCode(fid, kid, name, code);
        results.push({ ...result, kid });

        // หน่วงเวลา 3 วินาทีก่อนไปไอดีถัดไป (ปรับเพิ่ม/ลดได้ตามต้องการ)
        if (i < players.length - 1) {
          await sleep(3000);
        }
      }

      console.log('\n✨ ทำรายการครบทุกไอดีเรียบร้อยแล้ว!');

      if (GIFTCODE_WEBHOOK) {
        await sendGiftCodeNotification(GIFTCODE_WEBHOOK, buildSummary(code, results));
      }
    } catch (err) {
      console.error('⚠️ เกิดข้อผิดพลาดในการอ่านไฟล์:', err.message);
    }
  });
}

redeemGiftCodeForAllPlayers();
