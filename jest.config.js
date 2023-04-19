module.exports = {
  // 테스트 무시 패턴 경로
  testPathIgnorePatterns: ['/node_modules/'],
  // 테스트 실행 시 각 TestCase에 대한 출력 true
  verbose: true,
  // 테스트 전 미리 만들어야 하는 모킹 파일
  setupFilesAfterEnv: ['./__tests__/jest.setup.redis-mock.js'],
};
