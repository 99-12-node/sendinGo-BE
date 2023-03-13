const express = require('express');
const router = express.Router();

const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.ALIGO_BASE_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const COMPANY = 'sendigo';

// API 호출을 위한 토큰 생성
router.get('/talk/auth', async (req, res) => {
  const params = new URLSearchParams({ apikey: process.env.ALIGO_APIKEY });
  params.append('userid', String(process.env.ALIGO_USERID));
  const aligoRes = await instance.post(
    process.env.ALIGO_BASE_URL +
      '/akv10/token/create/' +
      process.env.ALIGO_AUTH_MIN +
      '/i/',
    params
  );
  return res.status(200).json({ data: aligoRes.data });
});

// 알림톡 보내기
router.post('/talk/send', async (req, res) => {
  const params = new URLSearchParams({
    apikey: process.env.ALIGO_APIKEY,
    userid: process.env.ALIGO_USERID,
    token: process.env.ALIGO_TOKEN,
    senderkey: process.env.ALIGO_SENDERKEY,
    tpl_code: 'TM_2048',
    sender: process.env.SENDER,
    receiver_1: process.env.RECEIVER_1,
    recvname_1: '홍길동',
    subject_1: '제목',
    message_1: `[${COMPANY}] 주문완료안내\n
    □ 주문번호 : 123412314123\n
    □ 배송지 : 어느구 어느동\n
    □ 배송예정일 : 03월 10일 \n
    □ 결제금액 : 10,000 원`,
    failover: 'Y',
    fsubject_1: '문자제목1',
    fmessage_1: `[${COMPANY}] 주문완료안내\n
    □ 주문번호 : 123412314123\n
    □ 배송지 : 어느구 어느동\n
    □ 배송예정일 : 03월 10일 \n
    □ 결제금액 : 10,000 원`,
    testMode: 'Y',
  });

  const aligoRes = await instance.post(
    process.env.ALIGO_BASE_URL +
      '/akv10/alimtalk/send/' +
      process.env.ALIGO_AUTH_MIN +
      '/i/',
    params
  );
  return res.status(201).json({ data: aligoRes.data });
});

module.exports = router;
