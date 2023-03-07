import 'regenerator-runtime/runtime';
import fetch from 'jest-fetch-mock';

import { resetReduxState } from './test-utils/flex-redux';
import { resetServiceConfiguration } from './test-utils/flex-service-configuration';

process.env.FLEX_APP_SERVERLESS_FUNCTONS_DOMAIN = 'mockServerlessFunctionsDomain'

// Global test lifecycle handlers
beforeAll(() => {
  fetch.enableMocks();
});

beforeEach(() => {
  fetch.resetMocks();
})

afterEach(() => {
  resetServiceConfiguration();
  resetReduxState();
});