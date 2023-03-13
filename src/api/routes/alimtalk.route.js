const express = require('express');
const router = express.Router();

const axios = require('axios');

// API 호출을 위한 토큰 생성
router.get('/talk/auth', async (req, res) => {
  const aligoRes = await axios.post(
    process.env.ALIGO_BASE_URL +
      '/akv10/token/create/' +
      process.env.ALIGO_AUTH_MIN +
      '/i/',
    {
      apikey: process.env.ALIGO_APIKEY,
      userid: process.env.ALIGO_USERID,
    }
  );
  console.log('/akv10/token/create/ >>>', aligoRes);
  res.status(201).json(aligoRes);
});

// API 호출을 위한 토큰 생성
router.get('/talk/auth', async (req, res) => {});

module.exports = router;
