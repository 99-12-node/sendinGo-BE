const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const clientRouter = require('./client.route');

router.use('/talk', [alimtalkRouter]);
router.use('/clients', [clientRouter]);
router.use('/users', [userRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
