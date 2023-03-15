const express = require('express');
const router = express.Router();

const userGroupRouter = require('./usergroup.route');

router.use('/users', [userGroupRouter]);

router.get('/', (_req, res) => {
  res.send('정상적으로 요청되었습니다.');
});

module.exports = router;
