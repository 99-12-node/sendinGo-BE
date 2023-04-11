const express = require('express');
const router = express.Router();
const JoiHelper = require('../helpers/user.joiHelper.js');
const UserController = require('../controllers/user.controller');
const authMiddleWare = require('../middlewares/auth.middleware');
const createStatistic = require('../utils/statistic.schedule');
const userController = new UserController();

/**
 * Request.body.SignUp type
 * @typedef {object} SignUp
 * @property {string} email.required - 이메일 (아이디)
 * @property {string} password.required - 비밀번호
 * @property {string} confirmPassword.required - 비밀번호 확인
 * @property {string} name.required - 담당자 이름
 * @property {string} phoneNumber.required - 담당자 연락처
 * @property {string} companyName.required - 소속 이름
 * @property {string} companyNumber.required - 소속 연락처
 * @property {string} companyEmail.required - 소속 이메일
 */

/**
 * Request.body.Login type
 * @typedef {object} Login
 * @property {string} email.required - 이메일
 * @property {string} password.required - 비밀번호
 */

/**
 * Request.body.EditClientInfo type
 * @typedef {object} EditClientInfo
 * @property {string} email.required - 이메일 (아이디)
 * @property {string} password.required - 비밀번호
 * @property {string} name.required - 담당자 이름
 * @property {string} phoneNumber.required - 담당자 연락처
 * @property {string} companyName.required - 소속 이름
 * @property {string} companyNumber.required - 소속 연락처
 * @property {string} companyEmail.required - 소속 이메일
 * @property {integer} role.required - 관리자/일반
 */

/**
 * Request.body.Email type
 * @typedef {object} Email
 * @property {string} email.required - 이메일 (아이디)
 */

/**
 * Request.parameter.UserId type
 * @typedef {object} UserId
 * @property {number} userId.required - 유저Id
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
 * @return {object<Response>} 201 - success response - application/json
 * @return {object<Response>} 400 - Bad request response
 * @example response - 201 - 회원가입 성공
 * {
 *     "message": "회원가입이 완료되었습니다"
 * }
 * @example response - 400 - 이메일 형식 오류
 * {
 *     "message": "이메일 형식에 맞춰 입력바랍니다."
 * }
 * @example response - 400 - 비밀번호 확인 불일치
 * {
 *     "message": "비밀번호와 비밀번호 확인이 일치하지 않습니다."
 * }
 * @example response - 400 - 이름 형식 오류
 * {
 *     "message": "이름 입력란을 다시 확인해주세요."
 * }
 *  @example response - 400 - 비밀번호 형식 오류
 * {
 *     "message": "비밀번호는 영문 대소문자, 숫자 포함 8~20자리 조합입니다."
 * }
 * @example response - 400 - 핸드폰번호 형식 오류
 * {
 *     "message": "핸드폰 번호는 - 를 제외한 10~11 자리 입니다."
 * }
 */
router.post('/signup', JoiHelper.signUpCheck, userController.createUser);

/**
 * POST /users/signup/existemail
 * @summary 이메일 중복확인
 * @tags Users
 * @param {Email} request.body.required - 이메일
 * @return {object<Response>} 200 - success response
 * @return {object<Response>} 400 - Bad request response
 */
router.post(
  '/signup/existemail',
  JoiHelper.existEmailCheck,
  userController.checkUserEmail
);

/**
 * POST /users/login
 * @summary 로그인
 * @tags Users
 * @param {Login} request.body.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 200 - 로그인 성공
 * {
 * "message": "로그인이 정상적으로 처리되었습니다."
 * }
 * @example response - 400 - 로그인 실패
 * {
 *     "message": "로그인에 실패하였습니다"
 * }
 * @example response - 400 - 이메일 형식 오류
 * {
 *     "message": "이메일 형식에 맞춰 입력바랍니다."
 * }
 * @example response - 400 - 비밀번호 형식 오류
 * {
 *     "message": "비밀번호는 영문 대소문자, 숫자 포함 8~20자리 조합입니다."
 * }
 * @example response - 404 - 아이디 불일치
 * {
 *     "message": "일치하는 아이디가 없습니다."
 * }
 *  @example response - 404 - 비밀번호 불일치
 * {
 *     "message": "비밀번호가 일치하지 않습니다."
 * }
 * @security Authorization
 */
router.post('/login', JoiHelper.loginCheck, userController.loginUser);

/**
 * GET /users/{userId}
 * @summary 회원 정보 조회(마이페이지)
 * @tags Users
 * @param {number} userId.path.required - userId param description
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 401 - Bad request response
 * @return {object<Response>} 403 - Forbidden response
 * @return {object<Response>} 404 - Not found response
 * @example response - 200 - 마이페이지 조회 성공
 * {
 * "data": {
 * "user": {
 * "name": "edit2123.123123",
 * "phoneNumber": "01012481578",
 * "email": "te156156st@test.com"
 * },
 * "company": {
 * "companyName": "Company123123",
 * "companyNumber": "0221778997",
 * "companyEmail": "test12312351@test.com"
 * }
 * }
 * }
 * @example response - 400 - 마이페이지 조회 실패
 * {
 *     "message": "회원 조회에 실패하였습니다."
 * }
 * @example response - 401 - 토큰 기간 만료
 * {
 *     "message": "토큰에 해당하는 사용자가 존재하지 않습니다."
 * }
 * @example response - 403 - 토큰 권한없음/정보 불일치
 * {
 *     "message": "요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다."
 * }
 * @example response - 404 - 사용자가 존재하지 않음
 * {
 *     "message": "요청한 사용자 정보가 존재하지 않습니다."
 * }
 * @security Authorization
 */
router.get(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.userIdAndRequestIdCheck,
  userController.getUser
);

/**
 * PATCH /users/{userId}
 * @summary 회원 정보 수정
 * @tags Users
 * @param {number} userId.path.required - userId param description
 * @param {EditClientInfo} request.body.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 401 - Bad request response
 * @return {object<Response>} 403 - Forbidden response
 * @return {object<Response>} 404 - Not found response
 * @example response - 200 - 마이페이지 조회 성공
 * {
 * "message" : "회원 정보 수정이 완료 되었습니다."
 * }
 * @example response - 400 - 회원 정보 수정 실패
 * {
 *     "message": "회원 정보 수정에 실패하였습니다."
 * }
 * @example response - 400 - 이메일 형식 오류
 * {
 *     "message": "이메일 형식에 맞춰 입력바랍니다."
 * }
 * @example response - 400 - 이름 형식 오류
 * {
 *     "message": "이름 입력난을 다시 확인해주세요."
 * }
 * @example response - 400 - 비밀번호 형식 오류
 * {
 *     "message": "비밀번호는 영문 대소문자, 숫자 포함 8~20자리 조합입니다."
 * }
 * @example response - 400 - 연락처 번호 형식 오류
 * {
 *     "message": "핸드폰 번호는 - 를 제외한 10~11 자리 입니다."
 * }
 * @example response - 401 - 토큰 기간 만료
 * {
 *     "message": "토큰에 해당하는 사용자가 존재하지 않습니다."
 * }
 * @example response - 403 - 토큰 권한없음/정보 불일치
 * {
 *     "message": "요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다."
 * }
 * @example response - 404 - 사용자가 존재하지 않음
 * {
 *     "message": "요청한 사용자 정보가 존재하지 않습니다."
 * }
 * @security Authorization
 */
router.patch(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.editInfoCheck,
  userController.editUser
);

/**
 * DELETE /users/{userId}
 * @summary 회원 탈퇴
 * @tags Users
 * @param {number} userId.path.required
 * @return {object<Response>} 200 - Success response
 * @return {object<Response>} 400 - Bad request response
 * @return {object<Response>} 401 - Bad request response
 * @return {object<Response>} 403 - Bad request response
 * @return {object<Response>} 404 - Not found response
 * @example response - 200 - 탈퇴 성공
 * {
 * "message": "회원 탈퇴가 완료 되었습니다."
 * }
 * @example response - 400 - 탈퇴 실패
 * {
 *     "message": "회원 탈퇴에 실패하였습니다"
 * }
 * @example response - 401 - 토큰기간 만료/로그인 필요
 * {
 *     "message": "토큰에 해당하는 사용자가 존재하지 않습니다."
 * }
 * @example response - 403 - 토큰 권한 없음/정보 불일치
 * {
 *     "message": "요청하신 회원의 정보와 토큰의 정보가 일치하지 않습니다."
 * }
 * @example response - 404 - 존재하지 않는 유저
 * {
 *     "message": "요청한 사용자 정보가 존재하지 않습니다."
 * }
 * @security Authorization
 */
router.delete(
  '/:userId',
  authMiddleWare,
  createStatistic,
  JoiHelper.userIdAndRequestIdCheck,
  userController.deleteUser
);

module.exports = router;
