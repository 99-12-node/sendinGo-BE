const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');

const ClientGroupController = require('../controllers/clientGroup.controller');
const clientGroupController = new ClientGroupController();
const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

/**
 * Request.parameter.ClientGroup type
 * @typedef {object} ClientGroup
 * @property {number} clientId.required - clientId
 * @property {number} groupId.required - groupId
 */

/**
 * Request.parameter.GroupId type
 * @typedef {object} GroupId
 * @property {number} groupId.required - 그룹Id
 */

/**
 * Request.parameter.GroupIds type
 * @typedef {object} GroupIds
 * @property {number} existGroupId.required - 이전 그룹Id
 * @property {number} newGroupId.required - 옮길 그룹Id
 */

/**
 * Request.body.ClientIds type
 * @typedef {object} ClientIds
 * @property {number} clientIds.required - clientIds
 */

/**
 * Request.body.Clients type
 * @typedef {object} AddClients
 * @property {number} clientIds.required - 클라이언트Id
 * @property {string} groupName.required - 그룹명
 * @property {string} groupDescription - 그룹 설명
 */

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

/**
 * POST /batch/clients/{clientId}/groups/{groupId}
 * @summary 클라이언트 그룹 추가/해제
 * @tags ClientGroups
 * @param {number} clientId.path.required
 * @param {number} groupId.path.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 201 - 그룹 추가 성공
 * {
 *     "message": "그룹 추가가 완료되었습니다.",
 *     "groupId": 3
 * }
 * @example response - 200 - 그룹 해제 성공
 * {
 *     "message": "그룹 해제가 완료되었습니다."
 * }
 * @example response - 404 - 그룹 조회 실패
 * {
 *     "message": "그룹 조회에 실패했습니다."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "존재하지 않는 고객입니다."
 * }
 * @security Authorization
 */

// 클라이언트 기존 그룹에 추가 및 해제
router.post(
  '/clients/:clientId/groups/:groupId',
  authMiddleware,
  JoiHelper.clientGroupCheck,
  clientGroupController.createClientGroup
);

/**
 * POST /batch/clients/{clientId}/groups/{existGroupId}/move/{newGroupId}
 * @summary 클라이언트 그룹 이동
 * @tags ClientGroups
 * @param {number} clientId.path.required
 * @param {number} existGroupId.path.required
 * @param {number} newGroupId.path.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 201 - 그룹 이동 성공
 * {
 *     "message": "클라이언트 이동이 완료되었습니다."
 * }
 * @example response - 400 - 동일 그룹 존재
 * {
 *     "message": "이미 존재하는 그룹입니다."
 * }
 * @example response - 404 - 존재하지 않는 그룹
 * {
 *     "message": "존재하지 않는 그룹입니다."
 * }
 * @security Authorization
 */
// 클라이언트 다른 그룹으로 이동
router.post(
  '/clients/:clientId/groups/:existGroupId/move/:newGroupId',
  authMiddleware,
  JoiHelper.groupIdCheck,
  clientGroupController.moveClientGroup
);

/**
 * POST /batch/clients/{clientId}/groups/{existGroupId}/copy/{newGroupId}
 * @summary 클라이언트 그룹 복사
 * @tags ClientGroups
 * @param {number} clientId.path.required
 * @param {number} existGroupId.path.required
 * @param {number} newGroupId.path.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 201 - 그룹 복사 성공
 * {
 *     "message": "클라이언트 복사가 완료되었습니다."
 * }
 * @example response - 400 - 동일 그룹 존재
 * {
 *     "message": "이미 존재하는 그룹입니다."
 * }
 * @example response - 404 - 존재하지 않는 그룹
 * {
 *     "message": "존재하지 않는 그룹입니다."
 * }
 * @security Authorization
 */
// 클라이언트 다른 그룹으로 복사
router.post(
  '/clients/:clientId/groups/:existGroupId/copy/:newGroupId',
  authMiddleware,
  JoiHelper.groupIdCheck,
  clientGroupController.copyClientGroup
);

/**
 * POST /batch/groups/{groupId}
 * @summary 대량 클라이언트 기존 그룹 추가/해제
 * @tags ClientGroups
 * @param {number} groupId.path.required
 * @param {ClientIds} request.body.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 201 - 그룹 추가 성공
 * {
 *      "message": "그룹 추가가 완료되었습니다."
 *      "groupId" : 1
 * }
 * @example response - 200 - 그룹 해제 성공
 * {
 *     "message": "그룹 해제가 완료되었습니다."
 * }
 * @example response - 400 - 입력값 요청 오류
 * {
 *     "message": "입력값을 확인해주세요."
 * }
 * @example response - 404 - 그룹 조회 실패
 * {
 *     "message": "그룹 조회에 실패하였습니다."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "클라이언트 조회에 실패하였습니다."
 * }
 * @security Authorization
 */
// 대량 클라이언트 기존 그룹에 추가 및 해제
router.post(
  '/groups/:groupId',
  authMiddleware,
  clientGroupController.createClientGroupBulk
);

/**
 * POST /batch/groups
 * @summary 대량 클라이언트 신규 그룹 추가/해제
 * @tags ClientGroups
 * @param {AddClients} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 201 - 그룹 추가 성공
 * {
 *      "message": "신규 그룹에 클라이언트 추가가 완료되었습니다.",
 *      "groupId" : 1
 * }
 * @example response - 400 - 입력값 요청 오류
 * {
 *     "message": "입력값을 확인해주세요."
 * }
 * @example response - 404 - 클라이언트 조회 실패
 * {
 *     "message": "클라이언트 조회에 실패하였습니다."
 * }
 * @security Authorization
 */
// 대량 클라이언트 신규 그룹에 추가 및 해제
router.post(
  '/groups',
  authMiddleware,
  clientGroupController.createNewClientGroupBulk
);

module.exports = router;
