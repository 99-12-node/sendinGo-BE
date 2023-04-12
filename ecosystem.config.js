require('dotenv').config();

module.exports = {
  apps: [
    // 배포용
    {
      name: 'sendingo-app',
      script: './app.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    // 개발용
    {
      name: 'sendingo-dev',
      script: './app.js',
      env: {
        NODE_ENV: 'development',
        PORT: process.env.PORT_DEV,
      },
    },
  ],
};
