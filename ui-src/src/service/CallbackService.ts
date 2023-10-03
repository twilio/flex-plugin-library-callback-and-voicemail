import * as Flex from '@twilio/flex-ui';
import ApiService from './ApiService';
import { ErrorManager, FlexErrorSeverity, FlexPluginErrorType } from '../utils/ErrorManager';
import { EncodedParams } from '../types/serverless';
import { TaskAttributes } from '../types/task-router/Task';
import { CallbackNotification } from '../flex-hooks/notifications/Callback';
import { Actions } from '../flex-hooks/states';
import {Analytics, Event } from '../utils/Analytics';

export interface CreateCallbackResponse {
  success: boolean;
  taskSid: string;
  data: string;
  message: string;
}

export interface CreateCallbackRequest {
  numberToCall: string;
  numberToCallFrom: string;
  flexFlowSid: string;
  workflowSid?: string;
  timeout?: number;
  priority?: number;
  attempts?: number;
  conversation_id?: string;
  message?: string;
  utcDateTimeReceived?: string;
  RecordingSid?: string;
  RecordingUrl?: string;
  TranscriptionSid?: string;
  TranscriptionText?: string;
  isDeleted?: boolean;
}

class CallbackService extends ApiService {
  async callCustomerBack(task: Flex.ITask, attempts: number): Promise<Flex.ITask> {
    // Check to see if outbound dialing is enabled on the account
    // as outbound calls won't work unless it is
    const { outbound_call_flows } = this.manager.serviceConfiguration;
    const enabledOutboundFlows = Object.values(outbound_call_flows).filter((flow) => flow.enabled);

    if (!enabledOutboundFlows.length) {
      Flex.Notifications.showNotification(CallbackNotification.OutboundDialingNotEnabled);
      // throw new Error("Outbound dialing is not enabled");
    } else {
      try {
        // update state with the existing reservation sid so that we can re-select it later
        Flex.Manager.getInstance().store.dispatch(Actions.setLastPlacedCallback(task));

        // move the inbound callback task to wrapup state
        // this continues to block any inbound calls coming to
        // agent while they wait for outbound call to get placed
        // the outbound call needs to be in a ringing state before it will
        // block on the voice channel which presents a race condition
        const { queueSid } = task;
        const { callBackData, conversations } = task.attributes as TaskAttributes;
        if (callBackData) {
          const { numberToCall: destination, numberToCallFrom: callerId } = callBackData;

          const outboundCallTaskAttributes = {
            ...task.attributes,
            taskType: 'callback-outbound',
            conversations: {
              conversation_id: conversations?.conversation_id || task.taskSid,
            },
            autoClose: true,
            parentTask: task.sid,
          } as unknown as TaskAttributes;

          // trigger the outbound call
          await Flex.Actions.invokeAction('StartOutboundCall', {
            destination,
            callerId,
            queueSid,
            taskAttributes: outboundCallTaskAttributes,
          });

          Analytics.track(Event.CALLBACK_STARTED, {
            taskSid: task.taskSid,
          });
        }
      } catch (e) {
        if (attempts < 5) {
          // there can be some race conditions on invoking outbound call
          // this helps address them silently
          return await this.callCustomerBack(task, attempts + 1);
        } else {
          ErrorManager.createAndProcessError('Could not create callback to customer', {
            type: FlexPluginErrorType.serverless,
            description: e instanceof Error ? `${e.message}` : 'Could not create callback to customer',
            context: 'Plugin.CallbackService',
            wrappedError: e,
          });
        }
      }
    }
    return task;
  }

  async requeueCallback(task: Flex.ITask): Promise<Flex.ITask> {
    try {
      const request: CreateCallbackRequest = {
        numberToCall: task.attributes.callBackData.numberToCall,
        numberToCallFrom: task.attributes.callBackData.numberToCallFrom,
        flexFlowSid: task.attributes.flow_execution_sid,
        workflowSid: task.workflowSid,
        timeout: task.timeout,
        priority: task.priority,
        attempts: task.attributes.callBackData.attempts ? Number(task.attributes.callBackData.attempts) + 1 : 1,
        conversation_id: task.taskSid,
        message: task.attributes.message,
        utcDateTimeReceived: task.attributes.callBackData.utcDateTimeReceived
          ? task.attributes.callBackData.utcDateTimeReceived
          : new Date(),
        RecordingSid: task.attributes.callBackData.RecordingSid,
        RecordingUrl: task.attributes.callBackData.RecordingUrl,
        TranscriptionSid: task.attributes.callBackData.TranscriptionSid,
        TranscriptionText: task.attributes.callBackData.TranscriptionText,
        isDeleted: task.attributes.callBackData.isDeleted,
      };

      console.log('creating callback for reque');
      const response = await this.createCallback(request);

      if (response.success) {
        await Flex.Actions.invokeAction('WrapupTask', { task });
      }
    } catch (e) {
      ErrorManager.createAndProcessError('Could not reque callback to customer', {
        type: FlexPluginErrorType.serverless,
        description: e instanceof Error ? `${e.message}` : 'Could not reque callback to customer',
        context: 'Plugin.CallbackService',
        wrappedError: e,
      });
    }

    return task;
  }

  async createCallback(request: CreateCallbackRequest): Promise<CreateCallbackResponse> {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      numberToCall: encodeURIComponent(request.numberToCall),
      numberToCallFrom: encodeURIComponent(request.numberToCallFrom),
      flexFlowSid: encodeURIComponent(request.flexFlowSid),
      workflowSid: request.workflowSid ? encodeURIComponent(request.workflowSid) : undefined,
      timeout: request.timeout ? encodeURIComponent(request.timeout) : undefined,
      priority: request.priority ? encodeURIComponent(request.priority) : undefined,
      attempts: request.attempts ? encodeURIComponent(request.attempts) : undefined,
      conversation_id: request.conversation_id ? encodeURIComponent(request.conversation_id) : undefined,
      message: request.message ? encodeURIComponent(request.message) : undefined,
      utcDateTimeReceived: request.utcDateTimeReceived ? encodeURIComponent(request.utcDateTimeReceived) : undefined,
      RecordingSid: request.RecordingSid ? encodeURIComponent(request.RecordingSid) : undefined,
      RecordingUrl: request.RecordingUrl ? encodeURIComponent(request.RecordingUrl) : undefined,
      TranscriptionSid: request.TranscriptionSid ? encodeURIComponent(request.TranscriptionSid) : undefined,
      TranscriptionText: request.TranscriptionText ? encodeURIComponent(request.TranscriptionText) : undefined,
      isDeleted: request.isDeleted ? encodeURIComponent(request.isDeleted) : undefined,
    };

    const response = await this.fetchJsonWithReject<CreateCallbackResponse>(
      `${this.serverlessDomain}/callback/flex/create-callback`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
    return response;
  }
}

export default new CallbackService();
