const { logger } = require('../../middlewares/logger');
const AlimtalkService = require('../services/alimtalk.service');
const AligoService = require('../services/aligo.service');
const axios = require('axios');
const { BadRequestError } = require('../../exceptions/errors');
require('dotenv').config();
const { PORT } = process.env;

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
      const { message, ...data } = await this.alimtalkService.sendAlimTalk(
        datas
      );
      const redirectSaveResponse = await axios.post(
        `http://localhost:${PORT}/api/talk/sends/response`,
        {
          message,
          data,
        }
      );
      return res
        .status(redirectSaveResponse.status)
        .json(redirectSaveResponse.data);
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 발송 요청 응답 데이터 저장
  saveSendAlimTalkResponse = async (req, res, next) => {
    logger.info(`AlimtalkController.saveSendAlimTalkResponse`);
    const { message, ...data } = req.body;
    try {
      if (!data) {
        return res.status(400).json({ message });
      }
      const result = await this.alimtalkService.saveSendAlimTalkResponse(data);
      return res.status(201).json({
        message,
        // data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과
  getAlimTalkResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkResult`);
    const { page, limit, startdate, enddate } = req.query;

    try {
      const result = await this.aligoService.getAlimTalkResult({
        page,
        limit,
        startdate: startdate ?? '',
        enddate,
      });

      const redirectSaveResult = await axios.post(
        `http://localhost:${PORT}/api/talk/results/list/save`,
        {
          data: result,
        }
      );

      return res
        .status(redirectSaveResult.status)
        .json(redirectSaveResult.data);
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과 리스트 DB 저장
  saveSendAlimTalkResult = async (req, res, next) => {
    logger.info(`AlimtalkController.saveSendAlimTalkResult`);

    const { data } = req.body;
    try {
      if (!data) {
        return res.status(400).json({ message: '결과 조회에 실패하였습니다.' });
      }

      const result = await this.alimtalkService.saveAlimTalkResult(data);
      return res.status(201).json({
        data: {
          message: '결과조회 성공하였습니다.',
          list: result,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과 상세
  getAlimTalkDetailResult = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkDetailResult`);
    const { mid } = req.query;
    try {
      if (!mid) {
        throw new BadRequestError('입력값을 확인해주세요.');
      }
      const result = await this.aligoService.getAlimTalkDetailResult({
        mid,
      });
      return res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  };
};
