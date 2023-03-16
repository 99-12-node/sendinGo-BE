const express = require('express');
const router = express.Router();

const clientRouter = require('./client.route');
const clientGroupRouter = require('./clientgroup.route');

router.use('/clients', [clientRouter]);
router.use('/groups', [clientGroupRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
