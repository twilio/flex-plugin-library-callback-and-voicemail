import * as Flex from "@twilio/flex-ui";
import { replaceViewForCallbackAndVoicemail } from './TaskInfoPanel';


describe('replaceViewForCallbackAndVoicemail', () => {
    
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const taskInfoPanelSpy = jest.spyOn(Flex.TaskInfoPanel.Content, 'replace');

    it('does not replace view if feature is not enabled', () => {
        replaceViewForCallbackAndVoicemail(flex, manager);
        expect(taskInfoPanelSpy).not.toHaveBeenCalled();
        taskInfoPanelSpy.mockClear();
    });

    // it('replaces view if feature is not enabled', () => {
    //     isFeatureEnabled.mockReturnValue(true);
    //     replaceViewForCallbackAndVoicemail(flex, manager);
    //     expect(taskInfoPanelSpy).toHaveBeenCalled();
    // });
    // leaving this for now, no tests like this in admin plugin either
});