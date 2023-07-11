import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';
import CallbackAndVoicemail from '../../components/CallbackAndVoicemail';

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  try {
    let maxRetryAttempts = Number(process.env.FLEX_APP_CALLBACK_RETRY_ATTEMPTS || '<FLEX_APP_CALLBACK_RETRY_ATTEMPTS>');

    if (isNaN(maxRetryAttempts)) {
      maxRetryAttempts = 3;

      ErrorManager.createAndProcessError('Invalid number of retry attempts, setting it to default value of 3', {
        type: FlexPluginErrorType.programabelComponents,
        description: 'Invalid number of retry attempts, setting it to default value of 3',
        context: 'Plugin.Component.TaskInfoPanel',
      });
    }

    Flex.TaskInfoPanel.Content.replace(
      <CallbackAndVoicemail key="callback-component" maxAttempts={maxRetryAttempts} />,
      {
        sortOrder: -1,
        if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
      },
    );
  } catch (e) {
    ErrorManager.createAndProcessError('Could not replace content for Flex component', {
      type: FlexPluginErrorType.programabelComponents,
      description: e instanceof Error ? `${e.message}` : 'Could not replace content for Flex component',
      context: 'Plugin.Component.TaskInfoPanel',
      wrappedError: e,
    });
  }
}
