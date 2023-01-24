import CallbackService from './CallbackService';
import { CallbackNotification } from "../../flex-hooks/notifications/Callback";
import * as Flex from "@twilio/flex-ui";
import { setServiceConfiguration } from '../../../test-utils/flex-service-configuration';
import { Actions } from "../../flex-hooks/states/";

const mockTask = {
    sid: "WRxxx",
    taskSid:"WTxxx",
    queueSid: "WQxxx",
    attributes: {
        callBackData: {
            numberToCall: "+111",
            numberToCallFrom:"+122"
        },
    }
}

describe('callCustomerBack', () => {
    it('shows notification if outbound calling is not enabled', () => {
        const notificationSpy = jest.spyOn(Flex.Notifications, 'showNotification');
        CallbackService.callCustomerBack({}, 1);
        expect(notificationSpy).toHaveBeenCalledWith(CallbackNotification.OutboundDialingNotEnabled);
    });

    it('starts outbound call', () => {
        setServiceConfiguration({
            outbound_call_flows: {
                default: {
                    caller_id: "+111",
                    enabled: true,
                    location: "US",
                    queue_sid: "WQxxx",
                    workflow_sid: "WWxx"
                }
            }
        });
        
        const actionSpy = jest.spyOn(Actions, 'setLastPlacedCallback');
        CallbackService.callCustomerBack(mockTask, 1);
        expect(actionSpy).toHaveBeenCalledTimes(1);
        const outboundCallSpy = jest.spyOn(Flex.Actions, 'invokeAction');
        expect(outboundCallSpy).toHaveBeenCalledWith("StartOutboundCall", {
            destination: "+111",
            callerId: "+122",
            queueSid:"WQxxx",
            taskAttributes: {
                ...mockTask.attributes,
                taskType: "callback-outbound",
                conversations: {
                    conversation_id: "WTxxx"
                },
                autoClose: true,
                parentTask: "WRxxx",
            },
        });
    })

    it('shows error notification if number of attempts exceeds 5', async () => {
        setServiceConfiguration({
            outbound_call_flows: {
                default: {
                    caller_id: "+111",
                    enabled: true,
                    location: "US",
                    queue_sid: "WQxxx",
                    workflow_sid: "WWxx"
                }
            }
        });
        const notificationSpy = jest.spyOn(Flex.Notifications, 'showNotification');
        await CallbackService.callCustomerBack(mockTask, 6).catch((err) => {
            console.log("here34");
            expect(notificationSpy).toHaveBeenCalled();
        });
    });

    it("attempts to call again in case of error", async () => {
        setServiceConfiguration({
            outbound_call_flows: {
                default: {
                    caller_id: "+111",
                    enabled: true,
                    location: "US",
                    queue_sid: "WQxxx",
                    workflow_sid: "WWxx"
                }
            }
        });
        const callCustomerSpy = jest.spyOn(CallbackService, 'callCustomerBack');
        await CallbackService.callCustomerBack({}, 1).catch((err) => {
            expect(callCustomerSpy).toHaveBeenCalledTimes(5);
        });
    });
});