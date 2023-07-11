import CallbackService from '../CallbackService';
import { CallbackNotification } from '../../flex-hooks/notifications/Callback';
import * as Flex from '@twilio/flex-ui';
import { setServiceConfiguration } from '../../../test-utils/flex-service-configuration';
import { Actions } from '../../flex-hooks/states';
import fetch from 'jest-fetch-mock';
import { ErrorManager } from '../../utils/ErrorManager';

const mockTask = {
  sid: 'WRxxx',
  taskSid: 'WTxxx',
  queueSid: 'WQxxx',
  attributes: {
    callBackData: {
      numberToCall: '+111',
      numberToCallFrom: '+122',
    },
  },
};

describe('callCustomerBack', () => {
  it('shows notification if outbound calling is not enabled', () => {
    const notificationSpy = jest.spyOn(Flex.Notifications, 'showNotification');
    CallbackService.callCustomerBack({}, 1);
    expect(notificationSpy).toHaveBeenCalledWith(CallbackNotification.OutboundDialingNotEnabled);
  });

  it('starts outbound call', async () => {
    setServiceConfiguration({
      outbound_call_flows: {
        default: {
          caller_id: '+111',
          enabled: true,
          location: 'US',
          queue_sid: 'WQxxx',
          workflow_sid: 'WWxx',
        },
      },
    });

    const actionSpy = jest.spyOn(Actions, 'setLastPlacedCallback');
    await CallbackService.callCustomerBack(mockTask, 1);
    expect(actionSpy).toHaveBeenCalledTimes(1);
    const outboundCallSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    expect(outboundCallSpy).toHaveBeenCalledWith('StartOutboundCall', {
      destination: '+111',
      callerId: '+122',
      queueSid: 'WQxxx',
      taskAttributes: {
        ...mockTask.attributes,
        taskType: 'callback-outbound',
        conversations: {
          conversation_id: 'WTxxx',
        },
        autoClose: true,
        parentTask: 'WRxxx',
      },
    });
  });

  it('shows error notification if number of attempts exceeds 5', async () => {
    setServiceConfiguration({
      outbound_call_flows: {
        default: {
          caller_id: '+111',
          enabled: true,
          location: 'US',
          queue_sid: 'WQxxx',
          workflow_sid: 'WWxx',
        },
      },
    });
    const notificationSpy = jest.spyOn(Flex.Notifications, 'showNotification');
    await CallbackService.callCustomerBack(mockTask, 6).catch((err) => {
      expect(notificationSpy).toHaveBeenCalled();
    });
  });

  it('attempts to call again in case of error', async () => {
    setServiceConfiguration({
      outbound_call_flows: {
        default: {
          caller_id: '+111',
          enabled: true,
          location: 'US',
          queue_sid: 'WQxxx',
          workflow_sid: 'WWxx',
        },
      },
    });
    const callCustomerSpy = jest.spyOn(CallbackService, 'callCustomerBack');
    await CallbackService.callCustomerBack({}, 1).catch((err) => {
      expect(callCustomerSpy).toHaveBeenCalledTimes(5);
    });
  });
});

describe('requeueCallback', () => {
  const mockTask = {
    attributes: {
      callBackData: {
        numberToCall: '+111',
        numberToCallFrom: '+122',
        attempts: 0,
        utcDateTimeReceived: '2023-01-24T12:43:30.865Z',
        RecordingSid: 'REb8351f9697eb9f29341a8353dd6c52b0',
        RecordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Recordings/RExxx',
        isDeleted: false,
      },
      flow_execution_sid: 'FWxxx',
      message: null,
    },
    workflowSid: 'WKxxx',
    timeout: 86400,
    priority: 0,
    taskSid: 'WTxxx',
  };

  it('creates a callback', async () => {
    const createCallbackSpy = jest.spyOn(CallbackService, 'createCallback').mockImplementation(() => 'mock response');
    await CallbackService.requeueCallback(mockTask);
    expect(createCallbackSpy).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('invokes WrapupTask action on successful callback creation', async () => {
    jest.spyOn(CallbackService, 'createCallback').mockImplementation(() => ({ success: true }));
    const actionSpy = jest.spyOn(Flex.Actions, 'invokeAction');
    await CallbackService.requeueCallback(mockTask);
    expect(actionSpy).toHaveBeenCalledWith('WrapupTask', { task: mockTask });
    jest.restoreAllMocks();
  });

  it('throws error using ErrorManager', async () => {
    const errorManagerSpy = jest.spyOn(ErrorManager, 'createAndProcessError');
    await CallbackService.requeueCallback(mockTask).catch((e) => {
      expect(errorManagerSpy).toHaveBeenCalled();
    });
  });
});

describe('createCallback', () => {
  it('calls serverless function to create callback', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'mock response' }));
    const response = await CallbackService.createCallback({});
    expect(response).toEqual({ data: 'mock response' });
  });
});
