function isGoogleBot(userAgent) {
  return /googlebot|adsbot-google|mediapartners-google/i.test(userAgent);
}

exports.handleRedirect = (req, res) => {
  const ua = req.headers['user-agent'] || '';
  console.log('🔍 UA:', ua);

  const BOT_SAFE_PAGE_URL = process.env.BOT_SAFE_PAGE_URL;
  const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL;

  if (isGoogleBot(ua)) {
    console.log('🤖 Bot Google ➜ redirect đến trang sạch');
    return res.redirect(302, BOT_SAFE_PAGE_URL);
  }

  console.log('🚶 Người dùng thật ➜ redirect đến landing page');
  return res.redirect(302, LANDING_PAGE_URL);
};
