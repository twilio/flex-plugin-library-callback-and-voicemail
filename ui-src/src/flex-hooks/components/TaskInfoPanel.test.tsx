import { replaceViewForCallbackAndVoicemail } from './TaskInfoPanel';
import * as Flex from '@twilio/flex-ui';
import CallbackAndVoicemail from '../../components/CallbackAndVoicemail';
import React from 'react';
import { ErrorManager } from '../../utils/ErrorManager';

describe('number of callback attempts', () => {
  it('should be taken from env variable', () => {
    process.env.FLEX_APP_CALLBACK_RETRY_ATTEMPTS = '5';

    const flex: typeof Flex = Flex;
    const manager: Flex.Manager = Flex.Manager.getInstance();
    const contentReplaceSpy = jest.spyOn(flex.TaskInfoPanel.Content, 'replace');

    replaceViewForCallbackAndVoicemail(flex, manager);
    expect(contentReplaceSpy.mock.calls[0][0]).toEqual(
      <CallbackAndVoicemail key="callback-component" maxAttempts={5} />,
    );
  });

  it('should create error if no. of attempts in invalid and use default value', () => {
    process.env.FLEX_APP_CALLBACK_RETRY_ATTEMPTS = 'abc';

    const flex: typeof Flex = Flex;
    const manager: Flex.Manager = Flex.Manager.getInstance();
    const contentReplaceSpy = jest.spyOn(flex.TaskInfoPanel.Content, 'replace');
    const errorManagerSpy = jest.spyOn(ErrorManager, 'createAndProcessError');

    replaceViewForCallbackAndVoicemail(flex, manager);
    expect(errorManagerSpy.mock.calls[0][0]).toEqual(
      'Invalid number of retry attempts, setting it to default value of 3',
    );
    expect(contentReplaceSpy.mock.calls[0][0]).toEqual(
      <CallbackAndVoicemail key="callback-component" maxAttempts={3} />,
    );
  });
});
