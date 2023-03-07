module.exports = {
  rootDir: '.',
  clearMocks: true,
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.js"
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '.*\\.d\\.ts',
    '/components/.*./index\\.ts',
    'polyfilled\\.ts',
    'createAction.ts',
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