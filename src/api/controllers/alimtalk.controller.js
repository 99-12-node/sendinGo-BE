const { logger } = require('../../middlewares/logger');
const AlimtalkService = require('../services/alimtalk.service');
const ClientService = require('../services/client.service');
const TalkTemplateService = require('../services/talktemplate.service');

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkService = new AlimtalkService();
    this.clientService = new ClientService();
    this.talkTemplateService = new TalkTemplateService();
  }
  // 토큰 생성
  generateSendToken = async (_req, res, next) => {
    logger.info(`AlimtalkController.generateSendToken`);
    try {
      const result = await this.alimtalkService.generateSendToken();
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 내용 저장
  saveTalkContents = async (req, res, next) => {
    logger.info(`AlimtalkController.saveTalkContents`);
    const { clientId, templateCode, ...talkContentData } = req.body;

    try {
      const confirm = await Promise.allSettled([
        await this.clientService.getClientById({ clientId }),
        await this.talkTemplateService.verifyTemplateData({
          talkTemplateCode: templateCode,
          ...talkContentData,
        }),
      ]);
      if (confirm) {
        // 알림톡 전송 내용 저장
        const result = await this.alimtalkService.saveTalkContents({
          clientId,
          ...talkContentData,
        });
        return res.status(201).json(result);
      }
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송
  sendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.sendAlimTalk`);
    const { data } = req.body;
    try {
      const result = await this.alimtalkService.sendAlimTalk({ data });
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과
  getAlimTalkResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkResult`);
    // const filter = req.query;
    try {
      const result = await this.alimtalkService.getAlimTalkResult();
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  getAlimTalkDetailResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkDetailResult`);
    const { mid } = req.query;
    try {
      const result = await this.alimtalkService.getAlimTalkDetailResult({
        mid,
      });
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };
};
