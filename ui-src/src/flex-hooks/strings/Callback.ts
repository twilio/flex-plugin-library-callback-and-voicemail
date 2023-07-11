import * as Flex from '@twilio/flex-ui';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ErrorCallBackAndVoicemail = 'PSCallbackAndVoicemailErrorNotification',
  OutboundDialingNotEnabled = 'PSCallbackOutboundDialingNotEnabledNotification',
}

const customStrings = {
  [StringTemplates.ErrorCallBackAndVoicemail]: '{{error}}',
  [StringTemplates.OutboundDialingNotEnabled]: 'Outbound dialing is not enabled, please notify a systems administrator',
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...customStrings,
    ...manager.strings,
  } as any;
};
