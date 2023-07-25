import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import AddReducers from './flex-hooks/redux';
import Callback from './flex-hooks/notifications/Callback';
import ConfigureFlexStrings from './flex-hooks/strings/Callback';
import { autoSelectCallbackTaskWhenEndingCall } from './flex-hooks/actions/SelectTask';
import { createCallbackChannel } from './flex-hooks/channels/Callback';
import { createVoicemailChannel } from './flex-hooks/channels/Voicemail';
import { replaceViewForCallbackAndVoicemail } from './flex-hooks/components/TaskInfoPanel';
import CustomizePasteElements from './utils/PasteThemeProvider';

const PLUGIN_NAME = 'CallbackAndVoicemail';

export default class CallbackAndVoicemailPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const initializers = [
      ConfigureFlexStrings,
      CustomizePasteElements,
      autoSelectCallbackTaskWhenEndingCall,
      replaceViewForCallbackAndVoicemail,
      Callback,
      AddReducers,
      createCallbackChannel,
      createVoicemailChannel,
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
