import * as Flex from '@twilio/flex-ui';
import DispositionsConfig from '../types/ServiceConfiguration';

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    features: any;
  };
}

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { allow_requeue = false, auto_select_task = false } =
  (custom_data?.features?.dispositions as DispositionsConfig) || {};

export const isAllowRequeueEnabled = () => {
  return allow_requeue;
};

export const isAutoSelectTaskEnabled = () => {
  return auto_select_task;
};
