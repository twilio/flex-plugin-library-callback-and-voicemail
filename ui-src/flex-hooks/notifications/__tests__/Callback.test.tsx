import * as Flex from "@twilio/flex-ui";
import errorCallingCustomer from '../Callback';
import outboundDialingNotEnabled from '../Callback';

describe('Callback notifications', () => {
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const notificationSpy = jest.spyOn(Flex.Notifications, 'registerNotification');

    it('errorCallingCustomer registers error notification', () => {
        errorCallingCustomer(flex, manager);
        expect(notificationSpy).toHaveBeenCalledWith({
            id: 'CallbackErrorCallingCustomer',
            type: "error",
            content: "PSCallbackErrorCallingCustomerNotification"
        });
        notificationSpy.mockClear();
    });

    it('outboundDialingNotEnabled registers notification', () => {
        outboundDialingNotEnabled(flex, manager);
        expect(notificationSpy).toHaveBeenCalledWith({
            id: 'CallbackOutboundDialingNotEnabled',
            type: "error",
            content: "PSCallbackOutboundDialingNotEnabledNotification"
        });
    });
});