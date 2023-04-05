const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || '6379',
});

redisClient.on('error', (e) => console.error('Redis Client Error', e));
redisClient.connect();

const redisSet = async (key, values, expire) => {
  try {
    await redisClient.set(key, values, 'EX', expire);
    return;
  } catch (e) {
    console.error('redisSet: ', e);
  }
};

const redisGet = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (e) {
    console.error('redisSet: ', e);
  }
};

module.exports = { redisClient, redisSet, redisGet };
