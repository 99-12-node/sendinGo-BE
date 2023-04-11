const express = require('express');
const router = express.Router();
const JoiHelper = require('../helpers/joi.Helper');
const authMiddleware = require('../middlewares/auth.middleware');

const ClientController = require('../controllers/client.controller');
const clientController = new ClientController();

/**
 * Request.body.Client type
 * @typedef {object} Clients
 * @property {string} clientName.required - 이름
 * @property {string} contact.required - 연락처
 * @property {string} clientEmail.required - 이메일
 */
/**
 * Request.body.ClientTemplate type
 * @typedef {object} ClientTemplate
 * @property {number} talkTemplateId.required - 템플릿Id
 * @property {string} clientName.required - 이름
 * @property {string} contact.required - 연락처
 * @property {string} clientEmail.required - 이메일
 * @property {string} deliveryCompany.required - 택배회사명
 * @property {string} deliveryTime.required - 택배배송시간
 */
/**
 * Request.parameter.Index type
 * @typedef {object} Index
 * @property {number} index.required - Index페이지 번호
 */

/**
 * Request.parameter.GroupId type
 * @typedef {object} GroupId
 * @property {number} groupId.required - 그룹Id
 */

/**
 * Request.parameter.ClientId type
 * @typedef {object} ClientId
 * @property {number} clientId.required - 클라이언트Id
 */

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

/**
 * POST /clients
 * @summary 클라이언트 등록
 * @tags Clients
 * @param {Clients} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 201 - 클라이언트 등록 성공
 * { "cliendtId" : 1,
 * "message": "등록이 완료되었습니다."
 * }
 * @example response - 400 - 클라이언트 등록 실패
 * {
 *     "message": "클라이언트 등록에 실패하였습니다"
 * }
 * @security Authorization
 */
router.post(
  '/',
  authMiddleware,
  JoiHelper.clientCheck,
  clientController.createClient
);
/**
 * POST /clients/contents/bulk
 * @summary 클라이언트 대량 등록
 * @tags Clients
 * @param {ClientTemplate} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found
 * @example response - 201 - 클라이언트 대량 등록 성공
 * {
 *      "clientId" : [1,2,3,… ],
 *      "message": "대량 등록이 완료되었습니다."
 * }
 * @example response - 400 - 입력값 오류
 * {
 *     "message": "입력 값을 확인해주세요."
 * }
 * @example response - 400 - 클라이언트 대량 등록 실패
 * {
 *     "message": "클라이언트 대량 등록에 실패하였습니다."
 * }
 * @example response - 400 - 클라이언트 전송 등록 실패
 * {
 *     "message": "전송 데이터 등록에 실패하였습니다."
 * }
 * @example response - 404 - 템플릿 조회 실패
 * {
 *     "message": "템플릿 조회에 실패했습니다."
 * }
 * @security Authorization
 */
router.post(
  '/contents/bulk',
  authMiddleware,
  clientController.createClientBulk
);
/**
 * GET /clients
 * @summary 클라이언트 조회
 * @tags Clients
 * @param {number} Index.query.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 클라이언트 조회 성공
 * { "data": {
 * "clients": [
 * {
 * "clientId": 2,
 * "clientName": "이고객",
 * "contact": "01021212121",
 * "clientEmail": "client2@clinet.com",
 * "createdAt": "2023-03-23T13:35:01.000Z",
 * "groupId": 1,
 * "groupName": "회사1 관리자 테스트"
 * }],
 * "clientCount": 400}
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "조회에 실패하였습니다"
 * }
 * @security Authorization
 */
router.get(
  '/',
  authMiddleware,
  JoiHelper.checkIndex,
  clientController.getClients
);
/**
 * GET /clients/{groupId}
 * @summary 그룹별 클라이언트 조회
 * @tags Clients
 * @param {number} groupId.path.required - groupId Request parameter
 * @param {number} Index.query.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 그룹별 클라이언트 조회 성공
 * {
 * "data": [
 * {
 * "clientId": 1,
 * "clientName": "일고객",
 * "contact": "01012121212",
 * "clientEmail": "client1@clinet.com",
 * "createdAt": "2023-03-23T13:35:01.000Z",
 * "groupId": 1,
 * "groupName": "회사1 관리자 테스트",
 * "groupDescription" : "그룹 설명란입니다."},
 * … {}
 * ]
 * }
 * @example response - 404 - 그룹별 클라이언트 조회 실패
 * {
 * "message": "그룹 조회에 실패하였습니다."
 * }
 * @security Authorization
 */
router.get(
  '/:groupId',
  authMiddleware,
  JoiHelper.groupId,
  JoiHelper.checkIndex,
  clientController.getClientsByGroup
);
/**
 * PATCH /clients/{clientId}
 * @summary 클라이언트 수정
 * @tags Clients
 * @param {Clients} request.body.required
 * @param {number} clientId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request
 * @return {object<Response>} 403 - Forbidden
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 클라이언트 정보 수정 성공
 *{
 * "message": "수정이 완료되었습니다."
 * }
 * @example response - 400 - 클라이언트 수정 실패
 *{
 * "message": "수정이 실패하였습니다."
 * }
 * @example response - 403 - 클라이언트 수정 권한 없음
 *{
 * "message": "수정 권한이 없습니다."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 *{
 * "message": "클라이언트 조회에 실패하였습니다."
 * }
 * @security Authorization
 *
 */
router.patch(
  '/:clientId',
  authMiddleware,
  JoiHelper.clientId,
  clientController.editClientInfo
);
/**
 * DELETE /clients/{clientId}
 * @summary 클라이언트 삭제
 * @tags Clients
 * @param {number} clientId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad Request
 * @return {object<Response>} 403 - Forbidden
 * @return {object<Response>} 404 - Not found
 * @example response - 200 - 클라이언트 삭제 성공
 *{
 * "message": "삭제가 완료되었습니다."
 * }
 * @example response - 400 - 클라이언트 삭제 실패
 *{
 * "message": "삭제에 실패하였습니다."
 * }
 * @example response - 403 - 클라이언트 삭제 권한 없음
 *{
 * "message": "삭제 권한이 없습니다."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 *{
 * "message": "클라이언트 조회에 실패했습니다."
 * }
 * @security Authorization
 */
router.delete(
  '/:clientId',
  authMiddleware,
  JoiHelper.clientId,
  clientController.deleteClient
);

module.exports = router;
