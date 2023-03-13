const express = require('express');
const router = express.Router();

const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.ALIGO_BASE_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

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
  console.log(aligoRes);
  return res.status(201).json({ data: aligoRes.data });
});

module.exports = router;
