const fs = require('fs');

async function sendDiscordNotification({ webhookUrl, imagePath, imageName, content }) {
  try {
    const form = new FormData();
    form.append('payload_json', JSON.stringify({
      content,
      embeds: [{ image: { url: `attachment://${imageName}` } }],
      allowed_mentions: { parse: ["everyone"] }
    }));
    form.append('files[0]', new Blob([fs.readFileSync(imagePath)]), imageName);

    const res = await fetch(webhookUrl, {
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

async function sendGiftCodeNotification(webhookUrl, content) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      console.error(`ส่งแจ้งเตือน Discord ไม่สำเร็จ: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดตอนส่งแจ้งเตือน Discord:", err);
  }
}

module.exports = { sendDiscordNotification, sendGiftCodeNotification };
