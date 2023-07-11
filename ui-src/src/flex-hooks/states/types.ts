import * as Flex from '@twilio/flex-ui';
import { Action as ReduxAction, combineReducers } from 'redux';

// Actions
export const prefix = 'CallbackAndVoicemail';
export const INITIATE_CALLBACK = `${prefix}/INITIATE_CALLBACK`;
export const REQUEUE_CALLBACK = `${prefix}/REQUEUE_CALLBACK`;
export const PLACED_CALLBACK = `${prefix}/PLACED_CALLBACK`;

// State
export interface CallbackAndVoicemailState {
  isCompletingCallbackAction: { [taskSid: string]: boolean };
  isRequeueingCallbackAction: { [taskSid: string]: boolean };
  lastPlacedReservationSid?: string;
}

// Extend this payload to be of type that your ReduxAction is
// Normally you'd follow this pattern...https://redux.js.org/recipes/usage-with-typescript#a-practical-example
// But that breaks the typing when adding the reducer to Flex, so no payload intellisense for you!
export interface Action extends ReduxAction {
  payload?: any;
}

export const reduxNamespace = 'callbackandvoicemail';
// Register all component states under the namespace
export interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: CallbackAndVoicemailState;
}
