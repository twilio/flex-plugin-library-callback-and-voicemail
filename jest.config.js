module.exports = {
  rootDir: '.',
  clearMocks: true,
  automock:false,
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.js"
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '.*\\.d\\.ts',
    'index\\.ts',
    'jest.config.js',
    'webpack.*\\.js',
    './coverage',
    './public',
    '/test-utils',
    '/types',
    '/strings',
    '/utils',
    '/build',
    'assets',
    './functions/setup.js',
    '/redux',
  ],
  "roots": [
    "<rootDir>"
  ],
  "modulePaths": [
    "<rootDir>"
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  testResultsProcessor: 'jest-junit',
  reporters: ['default', 'jest-junit'],
  testTimeout: 15000
}