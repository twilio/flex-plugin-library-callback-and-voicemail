import * as Flex from '@twilio/flex-ui';

export default interface CallbackAndVoicemailConfig {
  enabled: boolean;
  allow_requeue: boolean;
  max_attempts: number;
  auto_select_task: boolean;
}

type FlexUIAttributes = Flex.ServiceConfiguration['ui_attributes'];

export interface UIAttributes extends FlexUIAttributes {
  custom_data: {
    serverless_functions_domain: string;
    serverless_functions_protocol: string;
    serverless_functions_port: string;
    features: {
      callbacks: CallbackAndVoicemailConfig;
    };
  };
}
