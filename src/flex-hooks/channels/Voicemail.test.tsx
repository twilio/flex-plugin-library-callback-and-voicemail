import * as Flex from "@twilio/flex-ui";
import { createVoicemailChannel } from './Voicemail';


describe('createVoicemailChannel', () => {

    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const taskChannelSpy = jest.spyOn(Flex.TaskChannels, 'register');

    it('creates task channel if feature is enabled', () => {
        const defaultTaskChannelSpy = jest.spyOn(Flex.DefaultTaskChannels, 'createDefaultTaskChannel');
        createVoicemailChannel(flex, manager);
        expect(defaultTaskChannelSpy).toHaveBeenCalled();
        taskChannelSpy.mockClear();
    });

    it('registers task channel if feature is enabled', () => {
        createVoicemailChannel(flex, manager);
        expect(taskChannelSpy).toHaveBeenCalled();
    });
})