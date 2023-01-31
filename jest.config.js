module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.js"
  ],
  coveragePathIgnorePatterns: [
    '.*\\.d\\.ts',
    'index\\.ts',
    'polyfilled\\.ts',
    'createAction.ts',
    'jest.config.js',
    'webpack.*\\.js',
    './coverage',
    './public',
    '/test-utils',
    '/types',
  ],
  "roots": [
    "<rootDir>"
  ],
  "modulePaths": [
    "<rootDir>"
  ],
}