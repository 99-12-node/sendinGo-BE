const express = require('express');
const router = express.Router();
const AlimtalkController = require('../controllers/alimtalk.controller');
const alimtalkController = new AlimtalkController();
const authMiddleware = require('../middlewares/auth.middleware');
const talkJoiHelper = require('../helpers/talk.joi.helper');
const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

/**
 * Request.body.GetContentByClientIds type
 * @typedef {object} GetContentByClientIds
 * @property {number} groupId.required - 그룹Id
 * @property {number} clientId.required - 고객Id
 * @property {string} organizationName - 회사명
 * @property {string} orderNumber - 주문번호
 * @property {string} region - 지역구, 면
 * @property {string} regionDetail - 동, 리
 * @property {string} deliveryDate - 배송월일
 * @property {number} paymentPrice - 금액
 * @property {string} deliveryCompany - 택배회사명
 * @property {string} deliveryTime - 택배배송시간
 * @property {string} deliveryNumber - 송장번호
 * @property {number} talkContentId.required
 * @property {number} talkTemplateId.required
 */

/**
 * Request.parameter.GroupId type
 * @typedef {object} GroupId
 * @property {number} groupId.required - 그룹Id
 */

/**
 * Request.parameter.SendTalk type
 * @typedef {object} SendTalk
 * @property {number} talkContentId.required - 메시지Id
 * @property {number} clientId.required - 고객Id
 * @property {number} talkTemplateId.required - 템플릿Id
 * @property {number} groupId.required - 그룹Id
 */

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

// API 호출을 위한 토큰 생성
router.get('/auth', alimtalkController.generateSendToken);

/**
 * POST /talk/contents
 * @summary  알림톡 전송 내용 저장
 * @tags Talk
 * @param {GetContentByClientIds} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found
 * @example response - 201 -  알림톡 전송 내용 저장에 성공 시
 * {
 * "message": "성공적으로 저장 하였습니다.",
 * "data":
 * [
 * {
 * "talkContentId": 18,
 * "clientId": 1,
 * "groupId": 3,
 * "talkTemplateId": 3
 * },
 * {
 * "talkContentId": 19,
 * "clientId": 2,
 * "groupId": 3,
 * "talkTemplateId": 3
 * }
 * ]
 * }
 * @example response - 400 - 템플릿과 불일치
 * {
 *     "message": "입력 데이터가 템플릿과 일치하지 않습니다"
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "클라이언트 조회에 실패하였습니다"
 * }
 * @example response - 404 - 그룹 조회 실패
 * {
 *     "message": "그룹 조회에 실패하였습니다"
 * }
 * @example response - 404 - 템플릿 조회 실패
 * {
 *     "message": "템플릿 조회에 실패하였습니다"
 * }
 * @example response - 404 - 전송내용 조회 실패
 * {
 *     "message": "전송내용 조회에 실패하였습니다"
 * }
 * @security Authorization
 */
// 알림톡 전송 내용 일괄 저장
router.post(
  '/contents',
  authMiddleware,
  talkJoiHelper.contentReqBodyCheck,
  alimtalkController.saveTalkContents
);

/**
 * POST /talk/clients/contents
 * @summary 클라이언트 알림톡 전송 내용 조회
 * @tags Talk
 * @param {GroupId} request.body.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 클라이언트 조회 성공
 * {
 * "data": [
 * {
 * "client": {
 * "clientId": 7,
 * "clientName": "고객이름",
 * "contact": "01012341234",
 * "clientEmail": "email@email.com",
 * "groupId": 5,
 * "groupName": "그룹이름"
 * },
 * "talkContent": {
 * "talkContentId": 1,
 * "organizationName": "센딩고",
 * "customerName": "2고객",
 * "orderNumber": null,
 * "region": null,
 * "regionDetail": null,
 * "deliveryDate": null,
 * "paymentPrice": null,
 * "deliveryCompany": null,
 * "deliveryTime": null,
 * "deliveryNumber": null
 * }
 * }
 * ]
 * }

 * @example response - 400 - 잘못된 요청
 * {
 *     "message": "올바르지 않은 요청입니다."
 * }
 * @example response - 404 - 그룹 조회 실패
 * {
 *     "message": "그룹 조회에 실패하였습니다."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "클라이언트 조회에 실패하였습니다"
 * }
 * @security Authorization
 */
// 클라이언트 전송 내용 조회
router.post(
  '/clients/contents',
  authMiddleware,
  talkJoiHelper.clientContentReq,
  alimtalkController.getContentByClientIds
);

/**
 * GET /talk/templates
 * @summary 템플릿 전체 조회
 * @tags Talk
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 200 - 템플릿 조회 성공
 *{
 * "message": "성공적으로 조회 하였습니다.",
 * "data": [
 *   {
 *     "talkTemplateId": 2,
 *     "talkTemplateName": "택배배송 안내",
 *     "talkTemplateContent": "#{고객명} 고객님! #{택배회사명}입니다. #{택배배송시간} 택배를 배달할 예정입니다. 등기번호(운송장번호) : #{송장번호}"
 *   }
 * ]
 * }
 * @example response - 400 - 템플릿 조회 실패
 * {
 *     "message": "조회에 실패하였습니다"
 * }
 * @security Authorization
 */
// 알림톡 템플릿 목록 조회
router.get('/templates', authMiddleware, alimtalkController.getTemplatesList);

/**
 * GET /talk/templates/{talkTemplateId}
 * @summary 템플릿 상세 조회
 * @tags Talk
 * @param {number} talkTemplateId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 200 - 템플릿 상세 조회 성공
 *{
 * "message": "성공적으로 조회 하였습니다.",
 * "data": [
 *   {
 *     "talkVariableId": 1,
 *     "talkVariableEng": "organizationName",
 *     "talkVariableKor": "회사명",
 *     "talkTemplateId": 6,
 *     "talkTemplateCode": "TM_2223",
 *     "talkTemplateName": "회원가입완료 안내"
 *   },
 *   {
 *     "talkVariableId": 10,
 *     "talkVariableEng": "customerName",
 *     "talkVariableKor": "고객명",
 *     "talkTemplateId": 6,
 *     "talkTemplateCode": "TM_2223",
 *     "talkTemplateName": "회원가입완료 안내"
 *   }
 * ]
 *}
 * @example response - 400 - 템플릿 조회 실패
 * {
 *     "message": "조회에 실패하였습니다"
 * }
 * @security Authorization
 */
// 알림톡 템플릿 상세 조회
router.get(
  '/templates/:talkTemplateId',
  authMiddleware,
  talkJoiHelper.templateIdParamsCheck,
  alimtalkController.getTemplateVariablesById
);

/**
 * POST /talk/sends
 * @summary 알림톡 전송
 * @tags Talk
 * @param {SendTalk} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 201 - 알림톡 전송 성공
 * {
 *     "message": "성공적으로 전송요청 하였습니다."
 * }
 * @example response - 400 - 전송 요청 실패
 * {
 *     "message": "전송요청 실패하였습니다."
 * }
 * @example response - 400 - 메시지와 템플릿의 불일치
 * {
 *     "message": "메시지가 템플릿과 일치하지 않음."
 * }
 * @security Authorization
 */
// 알림톡 보내기
router.post(
  '/sends',
  authMiddleware,
  talkJoiHelper.talkSendBody,
  alimtalkController.sendAlimTalk
);

// 알림톡 발송 요청 응답 데이터 저장
router.post('/sends/response', alimtalkController.saveSendAlimTalkResponse);

/**
 * GET /talk/results/list
 * @summary 알림톡 전송 결과 목록(리스트) 조회
 * @tags Talk
 * @param {number} groupId.query.required
 * @param {string} startDate.query
 * @param {string} endDate.query
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 200 - 전송결과 조회 성공
 *{
 * "data": {
 *   "message": "결과조회 성공하였습니다.",
 *   "list": [
 *     {
 *       "talkSendId": 31,
 *       "scnt": 100,
 *       "fcnt": 0,
 *       "msgCount": "1",
 *       "sendState": "전송완료",
 *       "sendDate": "2023-03-13 19:00:21",
 *       "groupId": 1,
 *       "groupName": "그룹이름"
 *     }
 *   ]
 * }
 *}
 * @example response - 400 - 전송 결과 조회 실패
 * {
 *     "message": "결과조회에 실패하였습니다"
 * }
 * @security Authorization
 */
// 알림톡 전송 결과 목록(리스트) 조회
router.get(
  '/results/list',
  authMiddleware,
  talkJoiHelper.sendResultParams,
  alimtalkController.getAlimTalkResult
);

// 알림톡 전송 결과 데이터 저장
router.post('/results/list/save', alimtalkController.saveSendAlimTalkResult);

/**
 * GET /talk/results/detail/{talkSendId}
 * @summary 알림톡 전송 결과 상세 조회
 * @tags Talk
 * @param {number} talkSendId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 전송결과 상세 조회 성공
 *{
 * "message": "상세결과 조회에 성공하였습니다.",
 * "data": [
 *   {
 *     "talkResultDetailId": 1,
 *     "msgid": 189952192,
 *     "phone": "01012341234",
 *     "msgContent": "일영현님께서 주문하신 물품이 배송완료 되었습니다. \n\n구매확정 부탁드립니다.",
 *     "buttonContent": "",
 *     "sendDate": "2023-03-24 16:29:02",
 *     "resultState": "0",
 *     "resultMessage": "성공",
 *     "resultDate": "2023-03-24 16:29:04",
 *     "clientId": 3,
 *     "groupId": 2,
 *     "clientName": "일영현"
 *   },
 *   {
 *     "talkResultDetailId": 2,
 *     "msgid": 189952191,
 *     "phone": "01012341234",
 *     "msgContent": "이영현님께서 주문하신 물품이 배송완료 되었습니다. \n\n구매확정 부탁드립니다.",
 *     "buttonContent": "naver.com",
 *     "sendDate": "2023-03-24 16:29:02",
 *     "resultState": "0",
 *     "resultMessage": "성공",
 *     "resultDate": "2023-03-24 16:29:03",
 *     "clientId": 1,
 *     "groupId": 2,
 *     "clientName": "이영현"
 *   }
 * ]
 *}
 * @example response - 400 - 상세 결과 조회 실패
 * {
 *     "message": "상세결과 조회에 실패하였습니다."
 * }
 * @example response - 400 - 입력값 오류
 * {
 *     "message": "입력값을 확인해주세요."
 * }
 * @example response - 404 - 전송 데이터 조회 실패
 * {
 *     "message": "해당하는 전송 데이터를 찾을 수 없습니다."
 * }
 * @example response - 404 - 상세 데이터 조회 실패
 * {
 *     "message": "해당하는 상세 데이터를 찾을 수 없습니다."
 * }
 * @security Authorization
 */
// 알림톡 전송 결과 상세 조회
router.get(
  '/results/detail/:talkSendId',
  authMiddleware,
  talkJoiHelper.sendResultDetailParams,
  alimtalkController.getAlimTalkResultDetail
);

// 알림톡 전송 결과 상세 데이터 저장
router.post('/results/detail/save', alimtalkController.saveTalkResultDetail);

// [클라이언트용] 알림톡 버튼 클릭 로그 생성
router.get('/click/:uuid', alimtalkController.saveTalkClick);

module.exports = router;
