const express = require('express');
const router = express.Router();
const JoiHelper = require('../helpers/user.joiHelper.js');
const UserController = require('../controllers/user.controller');
const authMiddleWare = require('../middlewares/auth.middleware');
const createStatistic = require('../utils/statistic.schedule');
const userController = new UserController();
const { controllerLogger } = require('../middlewares/logger.middleware.js');

router.use(controllerLogger);

/**
 * Request.body.SignUp type
 * @typedef {object} SignUp
 * @property {string} email.required - 이메일 (아이디)
 * @property {string} password.required - 비밀번호
 * @property {string} name.required - 담당자 이름
 * @property {string} phoneNumber.required - 담당자 연락처
 * @property {string} companyName.required - 소속 이름
 * @property {string} companyNumber.required - 소속 연락처
 * @property {string} companyEmail.required - 소속 이메일
 */

/**
 * Request.body.Email type
 * @typedef {object} Email
 * @property {string} email.required - 이메일 (아이디)
 */

/**
 * Response
 * @typedef {object} Response
 * @property {string} message - 결과 메시지
 */

/**
 * POST /users/signup
 * @summary 회원가입
 * @tags Users
 * @param {SignUp} request.body.required - 회원가입 Request Body
 * @return {object<Response>} 200 - success response - application/json
 * @return {object<Response>} 400 - Bad request response
 * @example response - 200 - 회원가입 성공
 * {
 *     "message": "회원가입이 완료되었습니다"
 * }
 * @example response - 400 - 이메일 형식 오류
 * {
 *     "message": "이메일 형식에 맞춰 입력바랍니다."
 * }
 */
router.post('/signup', JoiHelper.signUpCheck, userController.createUser);

/**
 * POST /users/signup/existemail
 * @summary 이메일 중복확인
 * @tags Users
 * @param {Email} request.body.required - 이메일
 * @return {object} 200 - success response
 * @return {object} 400 - Bad request response
 */
router.post(
  '/signup/existemail',
  JoiHelper.existEmailCheck,
  userController.checkUserEmail
);
router.post('/login', JoiHelper.loginCheck, userController.loginUser);

/**
 * GET /users/{userId}
 * @summary 회원정보 조회 (마이페이지)
 * @tags Users
 * @param {number} userId.path.required - userId param description
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 * @security Authorization
 */
router.get(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.userIdAndRequestIdCheck,
  userController.getUser
);
router.patch(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.editInfoCheck,
  userController.editUser
);
router.delete(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.userIdAndRequestIdCheck,
  userController.deleteUser
);

module.exports = router;
