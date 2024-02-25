import * as Flex from '@twilio/flex-ui';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ErrorCallingCustomer = 'PSCallbackErrorCallingCustomerNotification',
  OutboundDialingNotEnabled = 'PSCallbackOutboundDialingNotEnabledNotification',
  CallbackRequestHeading = 'PSCallbackRequestHeading',
  CallbackRequestDescription = 'PSCallbackRequestDescription',
  VoicemailRequestHeading = 'PSCallbackVoicemailRequestHeading',
  VoicemailRequestDescription = 'PSCallbackVoicemailRequestDescription',
  VoicemailRecording = 'PSCallbackVoicemailRecording',
  VoicemailTranscript = 'PSCallbackVoicemailTranscript',
  ContactPhone = 'PSCallbackContactPhone',
  CallReceptionTime = 'PSCallbackCallReceptionTime',
  CallbackAttemptHeading = 'PSCallbackAttemptHeading',
  CallbackAttempts = 'PSCallbackAttempts',
  PlaceCallNow = 'PSCallbackPlaceCallNow',
  RetryLater = 'PSCallbackRetryLater',
  SystemTime = 'PSCallbackSystemTime',
  VoicemailLoading = 'PSCallbackVoicemailLoading',
  VoicemailError = 'PSCallbackVoicemailError',
  VoicemailTryAgain = 'PSCallbackVoicemailTryAgain',
  Callback = 'PSCallbackCallback',
  Voicemail = 'PSCallbackVoicemail',
}

const customStrings = {
  [StringTemplates.ErrorCallingCustomer]: 'Failed to call {{customer}}, please try again',
  [StringTemplates.OutboundDialingNotEnabled]: 'Outbound dialing is not enabled, please notify a systems administrator',
  [StringTemplates.CallbackRequestHeading]: 'Callback Request',
  [StringTemplates.CallbackRequestDescription]: 'A contact has requested an immediate callback.',
  [StringTemplates.VoicemailRequestHeading]: 'Contact Voicemail',
  [StringTemplates.VoicemailRequestDescription]: 'A contact has left a voicemail that requires attention.',
  [StringTemplates.VoicemailRecording]: 'Voicemail recording',
  [StringTemplates.VoicemailTranscript]: 'Voicemail transcript',
  [StringTemplates.ContactPhone]: 'Contact phone',
  [StringTemplates.CallReceptionTime]: 'Call reception time',
  [StringTemplates.CallbackAttemptHeading]: 'Callback attempt',
  [StringTemplates.CallbackAttempts]: '{{thisAttempt}} of {{maxAttempts}}',
  [StringTemplates.PlaceCallNow]: 'Place Call Now To {{phoneNumber}}',
  [StringTemplates.RetryLater]: 'Retry Later',
  [StringTemplates.SystemTime]: 'System time: {{systemTime}}',
  [StringTemplates.VoicemailLoading]: 'Loading voicemail...',
  [StringTemplates.VoicemailError]: 'Error loading voicemail.',
  [StringTemplates.VoicemailTryAgain]: 'Try again',
  [StringTemplates.Callback]: 'Callback',
  [StringTemplates.Voicemail]: 'Voicemail',
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...customStrings,
    ...manager.strings,
  } as any;
};
