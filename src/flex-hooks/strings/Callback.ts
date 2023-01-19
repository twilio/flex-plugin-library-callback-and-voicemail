import * as Flex from '@twilio/flex-ui';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ErrorCallingCustomer = 'PSCallbackErrorCallingCustomerNotification',
  OutboundDialingNotEnabled = 'PSCallbackOutboundDialingNotEnabledNotification'
}

const customStrings = {
  [StringTemplates.ErrorCallingCustomer]: 'Failed to call {{customer}}, please try again',
  [StringTemplates.OutboundDialingNotEnabled]: 'Outbound dialing is not enabled, please notify a systems administrator'
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...customStrings,
    ...manager.strings,
  } as any;
};