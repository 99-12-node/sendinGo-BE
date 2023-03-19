const express = require('express');
const router = express.Router();
const { logger } = require('../../middlewares/logger');
const AlimtalkController = require('../controllers/alimtalk.controller');
const alimtalkController = new AlimtalkController();

// API 호출을 위한 토큰 생성
router.get('/auth', alimtalkController.generateSendToken);

// 알림톡 전송 내용 일괄 저장
router.post('/contents', alimtalkController.saveTalkContents);

// 알림톡 보내기
router.post('/groups', alimtalkController.sendAlimTalk);

// 알림톡 전송 결과
router.get('/result/list', alimtalkController.getAlimTalkResult);

// 알림톡 전송 결과 상세
router.get('/result/detail', alimtalkController.getAlimTalkDetailResult);

module.exports = router;
