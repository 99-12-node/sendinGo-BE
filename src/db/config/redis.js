const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_URL}`,
  // host: process.env.REDIS_HOST,
  // || 'localhost',
  // port: process.env.REDIS_PORT,
  // || '6379',
});

redisClient.connect();
// Redis 클라이언트 연결 성공처리
redisClient.on('connect', () => {
  console.log(`${new Date()}: Redis Client Connected`);
});
// Redis 클라이언트 연결 에러처리
redisClient.on('error', (e) => console.error('Redis Client Error:', e));

const redisSet = async (key, values, expire) => {
  try {
    const result = await redisClient.set(key, values, 'EX', expire);
    return;
  } catch (e) {
    console.error('redisSet Error: ', e);
  }
};

const redisGet = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (e) {
    console.error('redisSet Error: ', e);
  }
};

module.exports = { redisClient, redisSet, redisGet };
