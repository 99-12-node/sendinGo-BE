const express = require('express');
const { logger } = require('./src/middlewares/logger');
const cookieparser = require('cookie-parser');
const errorMiddleware = require('./src/middlewares/error.middleware');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./src/routes');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieparser());

app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: true, // 배포 후에 도메인 추가
    credentials: true,
    exposedHeaders: ['*', 'Authorization', 'Content-Type'],
  })
);

app.use('/api', router);
app.use(errorMiddleware);

app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Listening At Port ${port}`);
