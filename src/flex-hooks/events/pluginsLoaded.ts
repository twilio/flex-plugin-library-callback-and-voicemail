import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../types/FlexEvent";
import { isFeatureEnabled } from '../../utils/Configuration';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: callback-and-voicemail`);
};

export default pluginsLoadedHandler;
