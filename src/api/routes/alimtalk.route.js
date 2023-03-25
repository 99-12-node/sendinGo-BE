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
router.post('/sends', alimtalkController.sendAlimTalk);

// 알림톡 발송 요청 응답 데이터 저장
router.post('/sends/response', alimtalkController.saveSendAlimTalkResponse);

// 알림톡 전송 결과
router.get('/results/list', alimtalkController.getAlimTalkResult);

// 알림톡 전송 결과 데이터 저장
router.post('/results/list/save', alimtalkController.saveSendAlimTalkResult);

// 알림톡 전송 결과 상세
router.get('/results/detail', alimtalkController.getAlimTalkResultDetail);

// 알림톡 전송 결과 상세 데이터 저장
router.post('/results/detail/save', alimtalkController.saveTalkResultDetail);

module.exports = router;
