import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { ErrorManager, FlexPluginErrorType } from "../../utils/ErrorManager";
import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail';

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  
  try {

  Flex.TaskInfoPanel.Content.replace(<CallbackAndVoicemail key="callback-component" maxAttempts={1} />, {
    sortOrder: -1,
    if: (props) => ['callback', 'voicemail'].includes(props.task.attributes.taskType),
  });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not replace content for Flex component", {
      type: FlexPluginErrorType.programabelComponents,
      description: e instanceof Error ? `${e.message}` : "Could not replace content for Flex component",
      context: "Plugin.Component.TaskInfoPanel",
      wrappedError: e
  });
  }
}
