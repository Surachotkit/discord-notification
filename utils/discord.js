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

module.exports = { sendDiscordNotification };
