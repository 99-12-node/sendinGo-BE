const express = require('express');
const router = express.Router();
const { logger } = require('../../middlewares/logger');
const AlimtalkController = require('../controllers/alimtalk.controller');
const alimtalkController = new AlimtalkController();

// API 호출을 위한 토큰 생성
router.get('/auth', alimtalkController.generateSendToken);

// 알림톡 보내기
router.post('/send', alimtalkController.sendAlimTalk);

// 알림톡 전송 결과
router.get('/result', alimtalkController.getAlimTalkResult);

// 알림톡 전송 결과 상세
router.get('/result/detail', alimtalkController.getAlimTalkDetailResult);

module.exports = router;
