const { logger } = require('../middlewares/logger');
const AlimtalkSendService = require('../services/alimtalkSend.service');
const AlimtalkResultService = require('../services/alimitalkResult.service');
const TalkTemplateService = require('../services/talktemplate.service');
const AligoService = require('../services/aligo.service');
const TalkClickService = require('../services/talkclick.service');
const axios = require('axios');
const parser = require('ua-parser-js');
const { BadRequestError, ForbiddenError } = require('../exceptions/errors');
require('dotenv').config();
const { PORT, API_DOMAIN } = process.env;

module.exports = class AlimtalkController {
  constructor() {
    this.alimtalkSendService = new AlimtalkSendService();
    this.alimtalkResultService = new AlimtalkResultService();
    this.talkTemplateService = new TalkTemplateService();
    this.aligoService = new AligoService();
    this.talkClickService = new TalkClickService();
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
        const {
          groupId,
          clientId,
          talkTemplateId,
          talkContentId,
          useLink,
          ...talkContentReq
        } = data;
        const talkContentData = {
          useLink: useLink ? useLink.replace(/^https?:\/\//i, '') : null,
          ...talkContentReq,
        };
        // 알림톡 전송 내용 저장
        const createdData = await this.alimtalkSendService.saveTalkContents({
          userId,
          companyId,
          groupId,
          clientId,
          talkTemplateId,
          talkContentId,
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
    const { groupId } = req.body;

    try {
      const allData = await this.alimtalkSendService.getContentByClientIds({
        userId,
        companyId,
        groupId,
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
    const talkSendDatas = req.body.data;

    const talksendAligoParams = [];
    try {
      for (const tallkSendData of talkSendDatas) {
        const { talkContentId, clientId, talkTemplateId, groupId } =
          tallkSendData;
        // 알림톡 발송을 위한 데이터, 파라미터 생성
        const talksendAligoParam =
          await this.alimtalkSendService.setSendAlimTalkData({
            userId,
            companyId,
            talkContentId,
            clientId,
            talkTemplateId,
            groupId,
          });
        talksendAligoParams.push(talksendAligoParam);
      }

      // 파라미터로 알리고에 알림톡 전송 요청
      const aligoResult = await this.aligoService.sendAlimTalk(
        talksendAligoParams
      );

      const sendResponseDatas = {
        aligoResult,
        talkSendDatas,
      };

      // 알림톡 전송 요청 데이터 저장
      const redirectSaveResponse = await axios.post(
        `http://localhost:${PORT}/api/talk/sends/response`,
        {
          sendResponseDatas,
          userId,
          companyId,
        }
      );
      // return res.status(201).json(sendResponseDatas);
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
    const { userId, companyId, sendResponseDatas } = req.body;
    if (!sendResponseDatas) {
      return res.status(400).json({ message: '전송요청 실패하였습니다.' });
    }

    const { aligoResult, talkSendDatas } = sendResponseDatas;
    const result = [];
    try {
      for (const talkSend of talkSendDatas) {
        const newTalkSend =
          await this.alimtalkSendService.saveSendAlimTalkResponse({
            userId,
            companyId,
            aligoResult,
            talkSend,
          });
        result.push(newTalkSend);
      }

      return res.status(201).json({
        message: aligoResult.message,
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
      const talkResultList = await this.aligoService.getAlimTalkResult({
        page,
        limit,
        startdate: startdate ?? '',
        enddate,
      });

      const redirectSaveResult = await axios.post(
        `http://localhost:${PORT}/api/talk/results/list/save`,
        {
          talkResultList,
          groupId: parseInt(groupId),
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

    const { talkResultList, groupId, userId, companyId } = req.body;
    try {
      if (!talkResultList.length) {
        throw new BadRequestError('결과조회 실패하였습니다.');
      }

      const response = [];
      for (const talkResult of talkResultList) {
        const result = await this.alimtalkResultService.saveAlimTalkResult({
          talkResult,
          groupId,
          userId,
          companyId,
        });
        if (result) response.push(result);
      }

      return res.status(200).json({
        data: {
          message: '결과조회 성공하였습니다.',
          list: response,
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
      // talkSendId로 전송 데이터 존재 여부 확인
      const talkSendDatas =
        await this.alimtalkResultService.getTalkSendListBySendId({
          talkSendId,
          userId,
          companyId,
        });

      // mid 있는 경우,결과 상세 조회 요청
      const results = await this.aligoService.getAlimTalkResultDetail({
        mid: talkSendDatas[0].mid,
      });

      const saveResultDetails = await axios
        .post(`http://localhost:${PORT}/api/talk/results/detail/save`, {
          data: { results, talkSendDatas, userId, companyId },
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
    const { results, talkSendDatas, userId, companyId } = req.body.data;
    try {
      if (!results.length) {
        throw new BadRequestError('상세결과 조회에 실패하였습니다.');
      }

      const response = [];
      for (let i = 0; i < results.length; i++) {
        const talkResultDetail =
          await this.alimtalkResultService.saveTalkResultDetail({
            result: results[i],
            talkSendData: talkSendDatas[i],
            userId,
            companyId,
          });
        response.push(talkResultDetail);
      }

      return res
        .status(200)
        .json({ message: '상세결과 조회에 성공하였습니다.', data: response });
    } catch (e) {
      next(e);
    }
  };

  // 알림톡 버튼 클릭 DB 저장
  saveTalkClick = async (req, res, next) => {
    logger.info(`AlimtalkController.saveTalkClick`);
    const { uuid } = req.params;
    const ua = parser(req.headers['user-agent']);
    const { host } = req.headers;
    const { baseUrl, path } = req;

    try {
      const talkClickData = await this.talkClickService.createTalkClick({
        trackingUUID: uuid,
        ua,
        originUrl: host + baseUrl + path,
      });
      const { originLink } = talkClickData;
      return res.redirect(`http://${originLink}`);
    } catch (e) {
      next(e);
    }
  };
};
