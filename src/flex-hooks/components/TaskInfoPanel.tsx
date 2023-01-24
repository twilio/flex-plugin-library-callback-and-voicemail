import * as Flex from '@twilio/flex-ui';
import CallbackAndVoicemail from '../../custom-components/CallbackAndVoicemail';
import { isFeatureEnabled, isAllowRequeueEnabled, getMaxAttempts } from '../../utils/Configuration';
import { ErrorManager, FlexPluginErrorType } from "../../utils/ErrorManager"

export function replaceViewForCallbackAndVoicemail(flex: typeof Flex, manager: Flex.Manager) {
  
  try {
    if (!isFeatureEnabled()) return;

  Flex.TaskInfoPanel.Content.replace(<CallbackAndVoicemail key="callback-component"  allowRequeue={isAllowRequeueEnabled()} maxAttempts={getMaxAttempts()} />, {
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
