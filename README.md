# webhook-discord

สคริปต์ Node.js สำหรับส่งข้อความแจ้งเตือนพร้อมรูปภาพเข้า Discord ผ่าน Webhook โดยรันแบบครั้งเดียวแล้วจบ (one-shot) เหมาะกับการตั้ง cron/launchd ให้เรียกตามเวลาที่ต้องการ

## Events ที่รองรับ

กำหนดไว้ใน [`events.js`](./events.js):

| Mode | คำอธิบาย |
| --- | --- |
| `bear` | แจ้งเตือน BEAR HUNT event |
| `cesares` | แจ้งเตือน CESARES FURY event |
| `sword_land` | แจ้งเตือน SWORD LAND event |
| `viking` | แจ้งเตือน VIKING event |

แต่ละ event มี webhook URL, รูปภาพ, และข้อความของตัวเอง แก้ไขได้ตรงใน `events.js`

## การติดตั้ง

```bash
npm install
```

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (ดูตัวอย่างค่าที่ต้องมีด้านล่าง):

```env
WEBHOOK_DISCORD_BEAR=https://discord.com/api/webhooks/...
WEBHOOK_DISCORD_CESARES=https://discord.com/api/webhooks/...
WEBHOOK_DISCORD_SWORD_LAND=https://discord.com/api/webhooks/...
WEBHOOK_DISCORD_VIKING=https://discord.com/api/webhooks/...
```

## การใช้งาน

รันแบบระบุ event ตรงๆ ผ่าน npm script:

```bash
npm run bear
npm run cesares
npm run sword_land
npm run viking
```

หรือเรียก `node index.js` พร้อมชื่อ mode โดยตรง:

```bash
node index.js bear
```

ถ้าไม่ระบุ mode หรือระบุ mode ที่ไม่มีใน `events.js` สคริปต์จะไม่ส่งแจ้งเตือนและพิมพ์ log แจ้งเฉยๆ

ตั้ง cron/launchd ให้เรียก `npm run <mode>` ตามเวลาที่ต้องการแจ้งเตือนของแต่ละ event

## แลก Gift Code (KingShot)

`redeem.js` ใช้สำหรับยิงแลก Gift Code ของเกม KingShot ให้กับ Player ID หลายคนพร้อมกัน

สร้างไฟล์ `users.txt` ที่ root ของโปรเจกต์ ใส่ `playerId,kingdomId,characterName` ทีละบรรทัด (แต่ละคนอยู่คนละ kingdom ได้, ชื่อตัวละครใส่ไว้เพื่อให้อ่านผลลัพธ์ง่ายขึ้น ถ้าไม่ใส่จะใช้ playerId แทน):

```
987654321,512,JohnDoe
```

รันคำสั่ง:

```bash
npm run redeem
```

โปรแกรมจะถามโค้ดที่ต้องการแลก แล้ววนส่งคำขอแลกโค้ดให้ทุก Player ID ใน `users.txt` ทีละคน (หน่วงเวลา 3 วินาทีต่อคน เพื่อลดโอกาสโดนบล็อก) และแจ้งผลลัพธ์ (สำเร็จ/ไม่สำเร็จ) เข้า Discord ผ่าน `WEBHOOK_DISCORD_GIFTCODE` ทุกครั้ง

## โครงสร้างโปรเจกต์

```
index.js              จุดเริ่มต้นโปรแกรม อ่าน mode จาก argument แล้วเรียกส่งแจ้งเตือน
redeem.js             จุดเริ่มต้นโปรแกรมแลก Gift Code ให้ Player ID ทุกคนใน users.txt
events.js             config ของแต่ละ event (webhook url, รูปภาพ, ข้อความ)
utils/discord.js      ฟังก์ชันส่งข้อความ + รูปภาพเข้า Discord webhook
utils/giftcode.js     ฟังก์ชันยิงแลก Gift Code ไปที่ API ของ KingShot
src/image/            รูปภาพประกอบของแต่ละ event
users.txt             รายชื่อ Player ID สำหรับแลก Gift Code (ไม่ commit เข้า git)
```
