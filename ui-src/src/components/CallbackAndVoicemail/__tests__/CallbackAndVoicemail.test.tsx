import React from 'react';
import { render } from '@testing-library/react';
import { CallbackAndVoicemail } from '../CallbackAndVoicemail';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CallbackService from '../../../service/CallbackService';
import { DateTime } from 'luxon';

jest.mock('react-redux', () => ({
  useSelector: () => ({
    isCompletingCallbackAction: {},
    isRequeueingCallbackAction: {},
  }),
  useDispatch: () => jest.fn(),
}));

const mockTask = {
  taskStatus: 'assigned',
  attributes: {
    taskType: 'voicemail',
    callBackData: {
      attempts: 0,
      mainTimeZone: 'UTC',
      RecordingUrl:
        'https://api.twilio.com/2010-04-01/Accounts/ACf688a0f5957274af34831c0b5e0cdbaa/Recordings/RE13186709605f710e008c1fe04541f469',
      isDeleted: false,
      numberToCall: '111',
      utcDateTimeReceived: '2023-01-22T07:06:18.928Z',
    },
  },
};

describe('Callback and Voicemail plugin', () => {
  let mockDate;
  beforeAll(() => {
    mockDate = jest.spyOn(DateTime.prototype, 'toLocaleString').mockReturnValue('1/22/2023, 7:06:18 AM UTC');
  });

  it('should render correct snapshot for voicemail', () => {
    const wrapper = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct snapshot for transcription text', () => {
    const mockTranscriptTask = {
      taskStatus: 'assigned',
      attributes: {
        taskType: 'voicemail',
        callBackData: {
          attempts: 0,
          mainTimeZone: 'UTC',
          RecordingUrl:
            'https://api.twilio.com/2010-04-01/Accounts/ACf688a0f5957274af34831c0b5e0cdbaa/Recordings/RE13186709605f710e008c1fe04541f469',
          isDeleted: false,
          numberToCall: '111',
          utcDateTimeReceived: '2023-01-22T07:06:18.928Z',
          TranscriptionText: 'Test transcription text',
        },
      },
    };
    const wrapper = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTranscriptTask} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct snapshot for callback', () => {
    const mockCallbackTask = {
      taskStatus: 'assigned',
      attributes: {
        taskType: 'callback',
        callBackData: {
          attempts: 0,
          mainTimeZone: 'UTC',
          isDeleted: false,
          numberToCall: '111',
          utcDateTimeReceived: '2023-01-22T07:06:18.928Z',
        },
      },
    };

    const wrapper = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockCallbackTask} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('retry button should be disabled', () => {
    const mockTask = {
      taskStatus: 'cancelled',
      attributes: {
        taskType: 'voicemail',
        callBackData: {
          utcDateTimeReceived: '2023-01-20T05:15:10.666Z',
          attempts: 0,
          mainTimeZone: 'UTC',
          RecordingUrl:
            'https://api.twilio.com/2010-04-01/Accounts/ACf688a0f5957274af34831c0b5e0cdbaa/Recordings/RE13186709605f710e008c1fe04541f469',
          isDeleted: false,
          numberToCall: '111',
        },
      },
    };
    const { getByTestId } = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );
    expect(getByTestId('retryBtn')).toBeDisabled();
  });

  it('call button should be disabled', () => {
    const mockTask = {
      taskStatus: 'cancelled',
      attributes: {
        taskType: 'voicemail',
        callBackData: {
          utcDateTimeReceived: '2023-01-20T05:15:10.666Z',
          attempts: 0,
          mainTimeZone: 'UTC',
          RecordingUrl:
            'https://api.twilio.com/2010-04-01/Accounts/ACf688a0f5957274af34831c0b5e0cdbaa/Recordings/RE13186709605f710e008c1fe04541f469',
          isDeleted: false,
          numberToCall: '+111',
        },
      },
    };
    const { getByTestId } = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );
    expect(getByTestId('callbackBtn')).toBeDisabled();
  });

  it('call button creates outbound call', async () => {
    jest.spyOn(CallbackService, 'callCustomerBack').mockImplementation(() => {});
    const { getByTestId } = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );
    const callBtn = getByTestId('callbackBtn');
    expect(callBtn).toBeEnabled();
    await userEvent.click(callBtn);
    expect(CallbackService.callCustomerBack).toHaveBeenCalled();
  });

  it('retry button requeues callback ', async () => {
    jest.spyOn(CallbackService, 'requeueCallback').mockImplementation(() => {});
    const { getByTestId } = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );
    const retryBtn = getByTestId('retryBtn');
    expect(retryBtn).toBeEnabled();
    await userEvent.click(retryBtn);
    expect(CallbackService.requeueCallback).toHaveBeenCalled();
  });

  it('displays time correctly', async () => {
    const expectedTimeReceived = DateTime.fromISO(mockTask.attributes!.callBackData!.utcDateTimeReceived);
    const formatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    } as Intl.DateTimeFormatOptions;
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const expectedLocalTimeShort = expectedTimeReceived.toLocaleString({ ...formatOptions, timeZone: localTz });
    const expectedServerTimeShort =
      'System time: ' +
      expectedTimeReceived.toLocaleString({
        ...formatOptions,
        timeZone: mockTask.attributes!.callBackData?.mainTimeZone,
      });

    const { getByText } = render(
      <CallbackAndVoicemail key="callback-component" allowRequeue={true} maxAttempts={3} task={mockTask} />,
    );

    expect(getByText(expectedLocalTimeShort)).toBeInTheDocument();
    expect(getByText(expectedServerTimeShort)).toBeInTheDocument();
  });

  afterAll(() => {
    mockDate.mockRestore();
  });
});
