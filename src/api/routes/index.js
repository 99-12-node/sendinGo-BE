const express = require('express');
const router = express.Router();

const userGroupRouter = require('./usergroup.route');
const userRouter = require('./user.route');
// const clientRouter = require('./client.route');
const alimtalkRouter = require('./alimtalk.route');

router.use('/talk', [alimtalkRouter]);
router.use('/users', [userGroupRouter]);
// router.use('/clients', [clientRouter]);
router.use('/users', [userRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
