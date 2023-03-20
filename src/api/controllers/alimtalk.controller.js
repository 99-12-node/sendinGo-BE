const { logger } = require('../../middlewares/logger');
const AlimtalkService = require('../services/alimtalk.service');
const AligoService = require('../services/aligo.service');

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkService = new AlimtalkService();
    this.aligoService = new AligoService();
  }
  // 토큰 생성
  generateSendToken = async (_req, res, next) => {
    logger.info(`AlimtalkController.generateSendToken`);
    try {
      const result = await this.aligoService.generateSendToken();
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 내용 저장
  saveTalkContents = async (req, res, next) => {
    logger.info(`AlimtalkController.saveTalkContents`);
    const datas = req.body.data;
    try {
      let result = [];
      for (const data of datas) {
        const { clientId, templateCode, ...talkContentData } = data;
        // 알림톡 전송 내용 저장
        const createdData = await this.alimtalkService.saveTalkContents({
          clientId,
          talkTemplateCode: templateCode,
          ...talkContentData,
        });
        result.push(createdData);
      }
      return res
        .status(201)
        .json({ message: '성공적으로 저장 하였습니다.', data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 발송
  sendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.sendAlimTalk`);
    const datas = req.body.data;
    try {
      const result = await this.alimtalkService.sendAlimTalk(datas);
      return res
        .status(201)
        .json({ message: '성공적으로 전송 하였습니다.', data: result });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 발송 요청 응답 데이터 저장
  saveSendAlimTalkResult = async (req, res, next) => {
    logger.info(`AlimtalkController.saveSendAlimTalkResult`);
    const datas = req.body.data;
    try {
      // let result = [];
      // for (const data of datas) {
      //   const { talkContentId, clientId, talkTemplateId, groupId } = data;
      const result = await this.alimtalkService.sendAlimTalk(datas);
      // result.push(sendRequest);
      // }
      return res
        .status(201)
        .json({ message: '성공적으로 전송 하였습니다.', data: result });
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
