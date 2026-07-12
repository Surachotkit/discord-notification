# webhook-discord

สคริปต์ Node.js สำหรับส่งข้อความแจ้งเตือนพร้อมรูปภาพเข้า Discord ผ่าน Webhook โดยรันแบบครั้งเดียวแล้วจบ (one-shot) เหมาะกับการตั้ง cron/launchd ให้เรียกตามเวลาที่ต้องการ

## Events ที่รองรับ

กำหนดไว้ใน [`events.js`](./events.js):

| Mode | คำอธิบาย |
| --- | --- |
| `bear` | แจ้งเตือน BEAR HUNT รันแบบวันเว้นวัน นับจาก `START_DATE` |
| `cesares` | แจ้งเตือน CESARES FURY event |
| `sword_land` | แจ้งเตือน SWORD LAND event |

## การติดตั้ง

```bash
npm install
```

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (ดูตัวอย่างค่าที่ต้องมีด้านล่าง):

```env
WEBHOOK_DISCORD_BEAR=https://discord.com/api/webhooks/...
WEBHOOK_DISCORD_CESARES=https://discord.com/api/webhooks/...
WEBHOOK_DISCORD_SWORD_LAND=https://discord.com/api/webhooks/...
```

## การใช้งาน

รันแบบระบุ event ตรงๆ (ข้ามการเช็ควันเว้นวัน ส่งทันที):

```bash
npm run bear
npm run cesares
npm run sword_land
```

หรือรันแบบ default โดยไม่ระบุ mode — จะส่ง `events.bear` เฉพาะวันที่ตรงกับตารางวันเว้นวัน (นับจาก `START_DATE` ใน `events.js`):

```bash
node index.js
```

บังคับให้ส่งทันทีโดยข้ามการเช็ควันเว้นวัน ด้วย `FORCE_SEND=true`:

```bash
FORCE_SEND=true node index.js
```

## โครงสร้างโปรเจกต์

```
index.js              จุดเริ่มต้นโปรแกรม เช็ค mode / วันเว้นวัน แล้วเรียกส่งแจ้งเตือน
events.js              config ของแต่ละ event (webhook url, รูปภาพ, ข้อความ)
utils/discord.js        ฟังก์ชันส่งข้อความ + รูปภาพเข้า Discord webhook
utils/date.js           คำนวณวันเว้นวันจาก START_DATE (เวลาไทย)
src/image/              รูปภาพประกอบของแต่ละ event
```

## หมายเหตุ

- โปรเจกต์นี้ไม่ได้ตั้งเวลารันเอง (ไม่มี scheduler ในตัว) ต้องอาศัยตัวจับเวลาภายนอก เช่น `cron` หรือ `launchd` เรียกคำสั่งข้างต้นตามเวลาที่ต้องการ
- ไฟล์ log ของ launchd (`launchd.out.log`, `launchd.err.log`) ถูก ignore ไว้แล้วใน `.gitignore`
