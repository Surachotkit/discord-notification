const crypto = require('crypto');

// URL และ secret key สำหรับยิงแลกรับ Gift Code ของเกม KingShot
const REDEEM_URL = "https://kingshot-giftcode.centurygame.com/api/gift_code";
const SIGN_SECRET = "mN4!pQs6JrYwV9";

// แปลง msg ที่ API ตอบกลับ เป็นข้อความที่อ่านง่าย
const RESULT_MESSAGES = {
  SUCCESS: 'แลกรับโค้ดสำเร็จ',
  'SAME TYPE EXCHANGE': 'แลกรับโค้ดสำเร็จ (same type)',
  RECEIVED: 'แลกไปแล้ว',
  'TIME ERROR': 'โค้ดหมดอายุแล้ว',
  'CDK NOT FOUND': 'ไม่พบโค้ดนี้ หรือโค้ดผิด',
  USED: 'ถึงจำนวนจำกัดการแลกแล้ว',
  'TOO FREQUENT': 'ถูก rate limit ลองใหม่อีกครั้งทีหลัง',
  'USER INFO ERROR': 'kingdom ไม่ตรงกับ player นี้',
  'ROLE NOT EXIST': 'ไม่พบ player นี้',
  'STOVE_LV ERROR': 'Town Center level ต่ำเกินไปสำหรับโค้ดนี้',
  'RECHARGE_MONEY ERROR': 'ยอดเติมเงินไม่พอสำหรับโค้ดนี้',
  'RECHARGE_MONEY_VIP ERROR': 'VIP level ต่ำเกินไปสำหรับโค้ดนี้',
  'SIGN ERROR': 'sign ผิด (request encoding ผิด)',
  'NOT LOGIN': 'session ถูกปฏิเสธจาก server',
};

const SUCCESS_STATUSES = ['SUCCESS', 'SAME TYPE EXCHANGE'];

// เรียง key ตามตัวอักษร ต่อ secret ท้าย แล้ว md5 ตามที่ API ต้องการ 
// รูปแบบ key=value&key=value... แล้วต่อ SIGN_SECRET ไว้ท้ายสุด จากนั้น MD5 hash ทั้งก้อน → ได้ค่า sign 
function sign(params) {
  const base = Object.keys(params).sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('md5').update(base + SIGN_SECRET).digest('hex');
}

async function redeemCode(playerId, kingdomId, name, code) {
  const payload = {
    fid: playerId,
    cdk: code,
    kid: String(kingdomId),
    time: String(Math.floor(Date.now() / 1000)),
  };
  payload.sign = sign(payload);
  const label = `(ID: ${playerId}, NAME: ${name}, K${kingdomId})`;

  try {
    const response = await fetch(REDEEM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(payload).toString()
    });

    const resJson = await response.json();
    // API ตอบ msg มาพร้อมจุดต่อท้าย เช่น "CDK NOT FOUND." ต้องตัดออกก่อนเทียบกับ RESULT_MESSAGES
    const status = String(resJson.msg || '').trim().replace(/\.+$/, '');
    const message = RESULT_MESSAGES[status] || status || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
    const success = SUCCESS_STATUSES.includes(status);

    if (success) {
      console.log(`✅ [สำเร็จ] ${label} -> ${message}`);
    } else {
      console.log(`❌ [ล้มเหลว] ${label} -> ${message}`);
    }

    return { success, playerId, name, message };
  } catch (error) {
    console.error(`⚠️ [Error] ${label} -> เชื่อมต่อล้มเหลว (${error.message})`);
    return { success: false, playerId, name, message: error.message };
  }
}

module.exports = { redeemCode };
