jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  TaskRouterUtils: jest.fn(),
}));

import { TaskRouterUtils } from '@twilio/flex-plugins-library-utils';

describe('Taskrouter create task', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createTask gives success', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        createTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              sid: 'TSxxxxxx',
              attributes: '{}',
            },
            success: true,
          }),
        ),
      };
    });
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      workflowSid: '123',
      taskChannel: '87678',
      priority: 1,
      timeout: 898,
      attributes: {},
      attempts: 0,
    };

    const task = await createTask({ ...payload });

    expect(task).toEqual({
      success: true,
      taskSid: 'TSxxxxxx',
      task: { sid: 'TSxxxxxx', attributes: {} },
      status: 200,
    });
  });

  it('createTask gives error', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        createTask: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      workflowSid: '123',
      taskChannel: 87678,
      priority: {
        overriddenPriority: 1,
      },
      timeOut: { overriddenTimeout: 898 },
      attributes: {},
      attempts: 0,
    };

    const errTask = await createTask({ ...payload });

    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});
