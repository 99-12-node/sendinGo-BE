const { logger } = require('../middlewares/logger');
const AlimtalkSendService = require('../services/alimtalkSend.service');
const AlimtalkResultService = require('../services/alimitalkResult.service');
const TalkTemplateService = require('../services/talktemplate.service');
const AligoService = require('../services/aligo.service');
const axios = require('axios');
const { BadRequestError, ForbiddenError } = require('../exceptions/errors');
require('dotenv').config();
const { PORT } = process.env;

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkSendService = new AlimtalkSendService();
    this.alimtalkResultService = new AlimtalkResultService();
    this.talkTemplateService = new TalkTemplateService();
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
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const datas = req.body.data;
    try {
      const result = [];
      for (const data of datas) {
        const { groupId, clientId, talkTemplateId, ...talkContentData } = data;
        // 알림톡 전송 내용 저장
        const createdData = await this.alimtalkSendService.saveTalkContents({
          userId,
          companyId,
          groupId,
          clientId,
          talkTemplateId,
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
  getContentByClientIds = async (req, res, next) => {
    logger.info(`AlimtalkController.getContentByClientId Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { groupId, clientIds } = req.body;

    try {
      if (!groupId || clientIds.length < 1) {
        throw new BadRequestError('올바르지 않은 요청입니다.');
      }

      const allData = await this.alimtalkSendService.getContentByClientIds({
        userId,
        companyId,
        groupId,
        clientIds,
      });

      return res.status(200).json({ data: allData });
    } catch (error) {
      next(error);
    }
  };

  // 알림톡 템플릿 목록 조회
  getTemplatesList = async (req, res, next) => {
    logger.info(`AlimtalkController.getTemplatesList Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

    try {
      if (!(userId && companyId)) {
        throw new ForbiddenError('접근 권한이 없습니다.');
      }

      const allData = await this.talkTemplateService.getTemplatesList();

      return res
        .status(200)
        .json({ message: '성공적으로 조회하였습니다.', data: allData });
    } catch (error) {
      next(error);
    }
  };

  // 알림톡 템플릿 Id로 변수들 상세 조회
  getTemplateVariablesById = async (req, res, next) => {
    logger.info(`AlimtalkController.getTemplateVariablesById Request`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { talkTemplateId } = req.params;

    try {
      if (!(userId && companyId)) {
        throw new ForbiddenError('접근 권한이 없습니다.');
      }

      const data = await this.talkTemplateService.getTemplateVariablesById({
        talkTemplateId,
      });

      return res
        .status(200)
        .json({ message: '성공적으로 조회하였습니다.', data });
    } catch (error) {
      next(error);
    }
  };
  // 알림톡 발송
  sendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.sendAlimTalk`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const datas = req.body.data;
    try {
      // 알림톡 발송을 위한 데이터, 파라미터 생성
      const { talksendAligoParams, talkSendDatas } =
        await this.alimtalkSendService.setSendAlimTalkData(
          userId,
          companyId,
          datas
        );

      // 파라미터로 알리고에 알림톡 전송 요청
      const aligoResult = await this.aligoService.sendAlimTalk(
        talksendAligoParams
      );

      const data = {
        message: '성공적으로 전송요청 하였습니다.',
        aligoResult,
        talkSend: talkSendDatas,
      };

      // 알림톡 전송 요청 데이터 저장
      const redirectSaveResponse = await axios.post(
        `http://localhost:${PORT}/api/talk/sends/response`,
        {
          message: data.message,
          data,
          userId,
          companyId,
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
    const { message, userId, companyId, data } = req.body;
    try {
      if (!data) {
        return res.status(400).json({ message });
      }
      const result = await this.alimtalkSendService.saveSendAlimTalkResponse({
        userId,
        companyId,
        data,
      });
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
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;

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
          userId,
          companyId,
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

    const { data, groupId, userId, companyId } = req.body;
    try {
      if (!data) {
        throw new BadRequestError('결과 조회에 실패하였습니다.');
      }

      const result = await this.alimtalkResultService.saveAlimTalkResult(
        data,
        groupId,
        userId,
        companyId
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
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const { talkSendId } = req.params;
    try {
      if (!talkSendId) {
        throw new BadRequestError('입력값을 확인해주세요.');
      }
      // talkSendId로 전송 데이터 존재 여부 확인
      const talkSendData = await this.alimtalkResultService.getTalkSendBySendId(
        {
          talkSendId,
          userId,
          companyId,
        }
      );

      // mid 있는 경우,결과 상세 조회 요청
      const results = await this.aligoService.getAlimTalkResultDetail({
        mid: talkSendData.mid,
      });

      const saveResultDetails = await axios
        .post(`http://localhost:${PORT}/api/talk/results/detail/save`, {
          data: { results, talkSendData, userId, companyId },
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
    const { results, talkSendData, userId, companyId } = req.body.data;
    try {
      if (!results.length) {
        throw new BadRequestError('상세결과 조회에 실패하였습니다.');
      }

      const response = await this.alimtalkResultService.saveTalkResultDetail({
        results,
        talkSendData,
        userId,
        companyId,
      });

      return res
        .status(200)
        .json({ message: '상세결과 조회에 성공하였습니다.', data: response });
    } catch (e) {
      next(e);
    }
  };

  // [임시] 알림톡 전송 내용 '저장' + 발송
  saveTalkContentsAndSend = async (req, res, next) => {
    logger.info(`AlimtalkController.saveTalkContentsAndSend`);
    const { userId } = res.locals.user;
    const { companyId } = res.locals.company;
    const datas = req.body.data;
    try {
      const result = [];
      for (const data of datas) {
        const { groupId, clientId, templateCode, ...talkContentData } = data;
        // 알림톡 전송 내용 저장
        const createdData = await this.alimtalkSendService.saveTalkContents({
          userId,
          companyId,
          groupId,
          clientId,
          talkTemplateCode: templateCode,
          ...talkContentData,
        });
        result.push(createdData);
      }

      const sendResult = await axios.post(
        `http://localhost:${PORT}/api/talk/both/sends`,
        {
          data: result,
          userId,
          companyId,
        }
      );

      return res.status(sendResult.status).json(sendResult.data);
    } catch (e) {
      next(e);
    }
  };

  // [임시] 알림톡 전송 내용 저장 + '발송'
  saveContentsAndSendAlimTalk = async (req, res, next) => {
    logger.info(`AlimtalkController.saveContentsAndSendAlimTalk`);
    const datas = req.body.data;
    const { userId, companyId } = req.body;
    try {
      const { message, ...data } = await this.alimtalkSendService.sendAlimTalk(
        userId,
        companyId,
        datas
      );

      const redirectSaveResponse = await axios.post(
        `http://localhost:${PORT}/api/talk/sends/response`,
        {
          message,
          data,
          userId,
          companyId,
        }
      );
      return res
        .status(redirectSaveResponse.status)
        .json(redirectSaveResponse.data);
    } catch (e) {
      next(e);
    }
  };
};
