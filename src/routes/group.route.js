const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const JoiHelper = require('../helpers/joi.Helper');
const createStatistic = require('../utils/statistic.schedule');

const GroupController = require('../controllers/group.controller');
const groupController = new GroupController();
const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

/**
 * Request.body.SignUp type
 * @typedef {object} Group
 * @property {string} groupName.required - 그룹명
 * @property {string} groupDescription - 그룹 설명
 */

/**
 * Request.parameter.GroupId type
 * @typedef {object} GroupId
 * @property {number} groupId.required - 그룹Id
 */

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

/**
 * POST /groups
 * @summary 빈 그룹 등록
 * @tags Groups
 * @param {Group} request.body.required
 * @return {object<Response>} 201 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 201 - 그룹 생성 성공
 * {
 *     "groupId" : 1,
 *     "message": "그룹 생성이 완료되었습니다."
 * }
 * @example response - 400 - 그룹 생성 실패
 * {
 *     "message": "그룹 생성에 실패하였습니다."
 * }
 * @example response - 400 - 그룹 이름 미입력시
 * {
 *     "message": "그룹명을 입력해주세요."
 * }
 * @security Authorization
 */
router.post(
  '/',
  authMiddleware,
  createStatistic,
  JoiHelper.groupCheck,
  groupController.createGroup
);

/**
 * GET /groups
 * @summary 그룹 조회
 * @tags Groups
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @example response - 200 - 그룹 조회 성공
 * {
 *  "data": [
 *   {
 *     "groupId": 8,
 *     "groupName": "group3",
 *     "groupDescription": "this is group3",
 *     "createdAt": "2023-04-06T06:08:07.000Z",
 *     "clientCount": 3
 *   }
 *  ]
 * }
 * @example response - 400 - 그룹 조회 실패
 * {
 *     "message": "그룹 조회에 실패하였습니다"
 * }
 * @security Authorization
 */
router.get('/', authMiddleware, createStatistic, groupController.getAllGroup);

/**
 * DELETE /groups/{groupId}
 * @summary 그룹 삭제
 * @tags Groups
 * @param {number} groupId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 200 - 그룹 삭제 성공
 * {
 *      "message": "그룹 삭제가 완료되었습니다."
 * }
 * @example response - 400 - 잘못된 파라미터 요청
 * {
 *     "message": "유효하지 않은 파라미터 요청입니다."
 * }
 * @example response - 404 - 그룹 삭제 실패
 * {
 *     "message": "그룹 삭제에 실패하였습니다."
 * }
 * @security Authorization
 */
router.delete(
  '/:groupId',
  authMiddleware,
  createStatistic,
  JoiHelper.groupId,
  groupController.deleteGroup
);

module.exports = router;
