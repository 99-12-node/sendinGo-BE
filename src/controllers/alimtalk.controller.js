const { logger } = require('../middlewares/logger');
const AlimtalkSendService = require('../services/alimtalkSend.service');
const AlimtalkResultService = require('../services/alimitalkResult.service');
const AligoService = require('../services/aligo.service');
const axios = require('axios');
const { BadRequestError } = require('../exceptions/errors');
require('dotenv').config();
const { PORT } = process.env;

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkSendService = new AlimtalkSendService();
    this.alimtalkResultService = new AlimtalkResultService();
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
        const createdData = await this.alimtalkSendService.saveTalkContents({
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

  // 클라이언트 알림톡 전송 내용 조회
  getTalkContentsByClientId = async (req, res, next) => {
    logger.info(`AlimtalkController.getTalkContentsByClientId Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId, clientIds } = req.body;

    try {
      if (!groupId || clientIds.length < 1) {
        throw new BadRequestError('올바르지 않은 요청입니다.');
      }

      const allClients =
        await this.alimtalkSendService.getTalkContentsByClientId({
          userId,
          companyId,
          groupId,
          clientIds,
        });

      return res.status(200).json({ data: allClients });
    } catch (error) {
      next(error);
    }
  };

  // 알림톡 발송
  sendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.sendAlimTalk`);
    const datas = req.body.data;
    try {
      const { message, ...data } = await this.alimtalkSendService.sendAlimTalk(
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
      const result = await this.alimtalkSendService.saveSendAlimTalkResponse(
        data
      );
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
    const { page, limit, startdate, enddate, groupId } = req.query;

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
          groupId,
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

    const { data, groupId } = req.body;
    try {
      if (!data) {
        throw new BadRequestError('결과 조회에 실패하였습니다.');
      }

      const result = await this.alimtalkResultService.saveAlimTalkResult(
        data,
        groupId
      );
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
  getAlimTalkResultDetail = async (req, res, next) => {
    logger.info(`AlimtalkController.getAlimTalkResultDetail`);
    const { talkSendId } = req.params;
    try {
      if (!talkSendId) {
        throw new BadRequestError('입력값을 확인해주세요.');
      }
      // talkSendId로 전송 데이터 존재 여부 확인
      const talkSendData = await this.alimtalkResultService.getTalkSendBySendId(
        {
          talkSendId,
        }
      );

      // mid 있는 경우,결과 상세 조회 요청
      const results = await this.aligoService.getAlimTalkResultDetail({
        mid: talkSendData.mid,
      });

      const saveResultDetails = await axios
        .post(`http://localhost:${PORT}/api/talk/results/detail/save`, {
          data: { results, talkSendData },
        })
        .catch((err) => {
          console.error(err.response.data);
          return err.response;
        });

      // return res.status(200).json({ data: results });
      return res.status(saveResultDetails.status).json(saveResultDetails.data);
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 전송 결과 상세 DB 저장
  saveTalkResultDetail = async (req, res, next) => {
    logger.info(`AlimtalkController.saveTalkResultDetail`);
    const { results, talkSendData } = req.body.data;
    try {
      if (!results.length) {
        throw new BadRequestError('상세결과 조회에 실패하였습니다.');
      }

      const response = await this.alimtalkResultService.saveTalkResultDetail({
        results,
        talkSendData,
      });

      return res
        .status(200)
        .json({ message: '상세결과 조회에 성공하였습니다.', data: response });
    } catch (e) {
      next(e);
    }
  };
};
