const express = require('express');
const router = express.Router();

const clientGroupRouter = require('./clientgroup.route');

router.use('/clients', [clientGroupRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
