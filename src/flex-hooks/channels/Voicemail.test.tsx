import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from '../../utils/Configuration';
import { createVoicemailChannel } from './Voicemail';

jest.mock('../../utils/Configuration', () => {
  const originalModule = jest.requireActual('../../utils/Configuration');

  return {
    __esModule: true,
    ...originalModule,
    isFeatureEnabled: jest.fn(),
  };
});

describe('createVoicemailChannel', () => {

    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const taskChannelSpy = jest.spyOn(Flex.TaskChannels, 'register');

    it('does not register channel if feature is not enabled', () => {
        isFeatureEnabled.mockReturnValue(false);
        createVoicemailChannel(flex, manager);
        expect(taskChannelSpy).not.toHaveBeenCalled();
        taskChannelSpy.mockClear();
    });

    it('creates task channel if feature is enabled', () => {
        isFeatureEnabled.mockReturnValue(true);
        const defaultTaskChannelSpy = jest.spyOn(Flex.DefaultTaskChannels, 'createDefaultTaskChannel');
        createVoicemailChannel(flex, manager);
        expect(defaultTaskChannelSpy).toHaveBeenCalled();
        taskChannelSpy.mockClear();
    });

    it('registers task channel if feature is enabled', () => {
        isFeatureEnabled.mockReturnValue(true);
        createVoicemailChannel(flex, manager);
        expect(taskChannelSpy).toHaveBeenCalled();
    });
})