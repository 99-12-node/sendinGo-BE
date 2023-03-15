const express = require('express');
const router = express.Router();

const alimtalkRouter = require('./alimtalk.route');

router.use('/talk', [alimtalkRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
