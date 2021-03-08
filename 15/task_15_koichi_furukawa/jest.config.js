module.exports = {
  roots: ['<rootDir>/src/', '<rootDir>/__tests__/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/index.ts'],
};
