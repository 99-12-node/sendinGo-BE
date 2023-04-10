const express = require('express');
const { logger } = require('./src/middlewares/logger');
const cookieparser = require('cookie-parser');
const errorMiddleware = require('./src/middlewares/error.middleware');
const createStatistic = require('./src/utils/statistic.schedule');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./src/routes');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const options = require('./src/api/swagger.option');

const app = express();
dotenv.config();
const port = process.env.PORT;

expressJSDocSwagger(app)(options);

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
app.use(createStatistic);

app.get('/', (_req, res) => res.send('루트 경로에 연결되었습니다.'));
app.use(errorMiddleware);

app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Listening At Port ${port}`);
