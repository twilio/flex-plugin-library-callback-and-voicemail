import helpers from '../../../test-utils/test-helper';

jest.mock('functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareStudioFunction: (_, fn) => fn,
}));
jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  TaskRouterUtils: jest.fn(),
}));

import { TaskRouterUtils } from '@twilio/flex-plugins-library-utils';

describe('Create callback', () => {
  const mockTaskSid = 'WTxxx';
  const mockTask = {
    sid: mockTaskSid,
    attributes: '{"taskType": "callback"}',
  };

  const mockEvent = {
    numberToCall: '+111',
    numberToCallFrom: '+1222',
    flexFlowSid: 'SIDxxx',
    workflowSid: 'WWxxx',
    timeout: 10,
    priority: 1,
    attempts: 1,
    conversation_id: 'ID',
    message: 'message',
    utcDateTimeReceived: null,
    RecordingSid: null,
    RecordingUrl: null,
    TranscriptionSid: null,
    TranscriptionText: null,
    isDeleted: false,
    taskChannel: 'TCxxx',
  };
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction('twilio-wrappers/taskrouter', './functions/twilio-wrappers/taskrouter.private.js');
  });

  it('createCallback is called successfully', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        createTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              sid: mockTaskSid,
              attributes: '{}',
            },
            success: true,
          }),
        ),
      };
    });
    const createCallback = require('../../../../functions/callback/studio/create-callback.protected.js');
    const handlerFn = createCallback.handler;
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn((err) => {
      throw err;
    });

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body.taskSid).toBe(mockTaskSid);
    };

    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });

  it('createCallback error handler is called', async () => {
    const createCallback = require('../../../../functions/callback/studio/create-callback.protected.js');
    const handlerFn = createCallback.handler;

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();
    const mockErrorObject = jest.fn();

    await handlerFn({}, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);

    expect(mockErrorObject).toHaveBeenCalledTimes(1);
  });
});
