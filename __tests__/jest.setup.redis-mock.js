const redis = require('redis-mock');

// RedisMock 인스턴스 생성
const redisMock = redis.createClient();

// Redis 클라이언트 대신 RedisMock을 사용하도록 변경
redisMock.createClient = jest.fn(() => redisMock);

describe('Redis mocking test', () => {
  it('should set and get value', () => {
    const key = 'foo';
    const value = 'bar';

    // RedisMock을 사용하여 set 명령어 실행
    redisMock.set(key, value, (err, reply) => {
      expect(reply).toBe('OK');
    });

    // RedisMock을 사용하여 get 명령어 실행
    redisMock.get(key, (err, reply) => {
      expect(reply).toBe(value);
    });
  });
});
