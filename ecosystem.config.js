require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'sendingo-app',
      script: './app.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
      },
    },
    {
      name: 'sendingo-app-dev',
      script: './app.js',
      env_development: {
        NODE_ENV: 'development',
        PORT: process.env.PORT_DEV,
      },
    },
  ],
};
