import * as Flex from '@twilio/flex-ui';
import errorNotification from '../Callback';
import outboundDialingNotEnabled from '../Callback';

describe('Callback notifications', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const notificationSpy = jest.spyOn(Flex.Notifications, 'registerNotification');

  it('errorCallingCustomer registers error notification', () => {
    errorNotification(flex, manager);
    expect(notificationSpy).toHaveBeenCalledWith({
      id: 'ErrorCallBackAndVoicemail',
      type: 'error',
      content: 'PSCallbackAndVoicemailErrorNotification',
    });
    notificationSpy.mockClear();
  });

  it('outboundDialingNotEnabled registers notification', () => {
    outboundDialingNotEnabled(flex, manager);
    expect(notificationSpy).toHaveBeenCalledWith({
      id: 'CallbackOutboundDialingNotEnabled',
      type: 'error',
      content: 'PSCallbackOutboundDialingNotEnabledNotification',
    });
  });
});
