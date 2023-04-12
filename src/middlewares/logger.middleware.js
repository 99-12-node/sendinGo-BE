const { logger } = require('./logger');

const routerLogger = (req, res, next) => {
  logger.info(
    `[${req.method}] ${req.originalUrl} - ${
      req.originalUrl.split('/')[2]
    }.router`
  );
  next();
};

const controllerLogger = (req, res, next) => {
  logger.info(
    `[${req.method}] ${req.originalUrl} - ${
      req.originalUrl.split('/')[2]
    }.controller`
  );
  next();
};

module.exports = { routerLogger, controllerLogger };
