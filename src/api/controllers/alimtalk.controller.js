const { logger } = require('../../middlewares/logger');
const AlimtalkService = require('../services/alimtalk.service');

const COMPANY = 'sendigo';

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkService = new AlimtalkService();
  }
  // 토큰 생성
  generateSendToken = async (req, res, next) => {
    logger.info(`AlimtalkController.generateSendToken`);
    try {
      const result = await this.alimtalkService.generateSendToken();
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송
  sendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.sendAlimTalk`);
    const { tpl_code, recvname_1, subject_1, message_1, testMode } = req.body;
    // [[{"이름": "김김김", "연락처": "01011111111"}], [{"이름": "이이이", "연락처": "01022222222"}], [{"이름": "박박박", "연락처": "01012345678"}]]
    try {
      // 1. 그룹을 먼저 저장한다. (1)
      // 2. 클라이언트 데이터를 저장한다. (DB: N*col)
      // 3. 그 과정에서, 전송할 템플릿/메시지 등의 데이터를 파라미터에 할당한다.
      // 4. Aligo API 에 요청을 보낸다 (N)
      // 최소 O(N^2)
      const result = await this.alimtalkService.sendAlimTalk({
        tpl_code,
        recvname_1,
        subject_1,
        message_1,
        testMode,
      });
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과
  getAlimTalkResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkResult`);
    const filter = req.query;
    try {
      const result = await this.alimtalkService.getAlimTalkResult(filter);
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  getAlimTalkDetailResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkDetailResult`);
    const { mid } = req.params;
    try {
      const result = await this.alimtalkService.getAlimTalkResult({ mid });
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };
};
