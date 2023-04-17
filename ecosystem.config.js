require('dotenv').config();

module.exports = {
  apps: [
    // 배포용
    {
      name: 'sendingo-app',
      script: './app.js',
      instance_var: 'INSTANCE_ID',
      instances: 2,
      exec_mode: 'cluster',
      min_uptime: 5000,
      max_restart: 5,
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
