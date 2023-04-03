const express = require('express');
const router = express.Router();
const { logger } = require('../middlewares/logger');
const AlimtalkController = require('../controllers/alimtalk.controller');
const alimtalkController = new AlimtalkController();
const authMiddleware = require('../middlewares/auth.middleware');

// API 호출을 위한 토큰 생성
router.get('/auth', alimtalkController.generateSendToken);

// 알림톡 전송 내용 일괄 저장
router.post('/contents', authMiddleware, alimtalkController.saveTalkContents);

// 클라이언트 전송 내용 조회
router.post(
  '/clients/lists',
  authMiddleware,
  alimtalkController.getTalkContentsByClientId
);

// 알림톡 템플릿 목록 조회
router.get('/templates', authMiddleware, alimtalkController.getTemplatesList);

// 알림톡 템플릿 상세 조회
router.get(
  '/templates/:talkTemplateId',
  authMiddleware,
  alimtalkController.getTemplateVariablesById
);

// 알림톡 보내기
router.post('/sends', authMiddleware, alimtalkController.sendAlimTalk);

// 알림톡 발송 요청 응답 데이터 저장
router.post('/sends/response', alimtalkController.saveSendAlimTalkResponse);

// 알림톡 전송 결과 목록(리스트) 조회
router.get(
  '/results/list',
  authMiddleware,
  alimtalkController.getAlimTalkResult
);

// 알림톡 전송 결과 데이터 저장
router.post('/results/list/save', alimtalkController.saveSendAlimTalkResult);

// 알림톡 전송 결과 상세 조회
router.get(
  '/results/detail/:talkSendId',
  authMiddleware,
  alimtalkController.getAlimTalkResultDetail
);

// 알림톡 전송 결과 상세 데이터 저장
router.post('/results/detail/save', alimtalkController.saveTalkResultDetail);

// [임시] 알림톡 전송 내용 저장 및 알림톡 발송
router.post(
  '/both/contents/send',
  authMiddleware,
  alimtalkController.saveTalkContentsAndSend
);

// [임시] 전송 내용 저장 및 알림톡 발송 리다이렉트 URL
router.post('/both/sends', alimtalkController.saveContentsAndSendAlimTalk);

module.exports = router;
