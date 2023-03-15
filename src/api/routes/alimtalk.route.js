const express = require('express');
const router = express.Router();
const { logger } = require('../../middlewares/logger');
const AlimtalkController = require('../controllers/alimtalk.controller');
const alimtalkController = new AlimtalkController();

// API 호출을 위한 토큰 생성
router.get('/talk/auth', alimtalkController.generateSendToken);

// 알림톡 보내기
router.post('/talk/send', alimtalkController.sendAlimTalk);

// 알림톡 전송 결과
router.get('/talk/result', alimtalkController.getAlimTalkResult);

// 알림톡 전송 결과 상세
router.get('/talk/result/detail', async (req, res) => {
  const params = new URLSearchParams({
    apikey: process.env.ALIGO_APIKEY,
    userid: process.env.ALIGO_USERID,
    token: process.env.ALIGO_TOKEN,
    mid: req.query.mid,
    page: '1',
    limit: '10',
  });

  const aligoRes = await instance.post(
    process.env.ALIGO_BASE_URL +
      '/akv10/history/detail/' +
      process.env.ALIGO_AUTH_MIN +
      '/i/',
    params
  );
  return res.status(200).json({ data: aligoRes.data });
});

module.exports = router;
