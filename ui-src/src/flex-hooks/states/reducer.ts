import * as Flex from '@twilio/flex-ui';
import { CallbackAndVoicemailState, INITIATE_CALLBACK, REQUEUE_CALLBACK, PLACED_CALLBACK, Action } from './types';
import initialState from './initialState';

// Reducer
export function callbackandvoicemail(state = initialState, action: Action): CallbackAndVoicemailState {
  switch (action.type) {
    case `${INITIATE_CALLBACK}_PENDING`: {
      const { taskSid } = action.payload as Flex.ITask;
      return {
        ...state,
        isCompletingCallbackAction: {
          ...state.isCompletingCallbackAction,
          [taskSid]: true,
        },
      };
    }

    case `${INITIATE_CALLBACK}_REJECTED`: {
      break;
    }

    case `${INITIATE_CALLBACK}_FULFILLED`: {
      const { taskSid } = action.payload as Flex.ITask;
      const isCompletingCallbackAction = { ...state.isCompletingCallbackAction };
      delete isCompletingCallbackAction[taskSid];

      return {
        ...state,
        isCompletingCallbackAction,
      };
    }

    case `${REQUEUE_CALLBACK}_PENDING`: {
      const { taskSid } = action.payload as Flex.ITask;
      return {
        ...state,
        isRequeueingCallbackAction: {
          ...state.isRequeueingCallbackAction,
          [taskSid]: true,
        },
      };
    }

    case `${REQUEUE_CALLBACK}_REJECTED`: {
      break;
    }

    case `${REQUEUE_CALLBACK}_FULFILLED`: {
      const { taskSid } = action.payload as Flex.ITask;
      const isRequeueingCallbackAction = { ...state.isRequeueingCallbackAction };
      delete isRequeueingCallbackAction[taskSid];

      return {
        ...state,
        isRequeueingCallbackAction,
      };
    }

    case `${PLACED_CALLBACK}`: {
      return {
        ...state,
        lastPlacedReservationSid: action.payload,
      };
    }

    default: {
      return state;
    }
  }
  return state;
}

export default callbackandvoicemail;
