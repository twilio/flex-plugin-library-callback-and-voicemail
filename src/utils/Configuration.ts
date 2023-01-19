import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "../types/ServiceConfiguration";

export const getFeatureFlags = () => {
    const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
    return custom_data;  
}

// will update once we get confirmation how how these flags would be managed for the plugin in Flex configuration. till then setting everything to true
const { enabled = false, allow_requeue = false, max_attempts = 1, auto_select_task = false } = getFeatureFlags()?.features?.callbacks || {};

export const isFeatureEnabled = () => {
  // return enabled;
  return true;
};

export const isAllowRequeueEnabled = () => {
  // return enabled && allow_requeue;
  return true;
};

export const isAutoSelectTaskEnabled = () => {
  // return enabled && auto_select_task;
  return true;
};

export const getMaxAttempts = () => {
  return max_attempts;
}
