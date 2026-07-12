function toUTCDateOnly(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

// วันเว้นวัน นับจาก startDate (เวลาไทย)
function isNotifyDay(startDate) {
  const todayBangkok = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const daysSinceStart = (toUTCDateOnly(todayBangkok) - toUTCDateOnly(startDate)) / 86400000;
  return daysSinceStart % 2 === 0;
}

module.exports = { isNotifyDay };
