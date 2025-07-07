const express = require('express');
const router = express.Router();
const { handleRedirect } = require('../controllers/redirect.controller');

router.get('/', handleRedirect);

module.exports = router;
