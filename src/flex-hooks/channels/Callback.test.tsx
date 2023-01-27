import * as Flex from "@twilio/flex-ui";
import React from "react";
import { createCallbackChannel } from './Callback';
import VoicemailIcon from "@material-ui/icons/Voicemail";

describe('createCallbackChannel', () => {

  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const taskChannelSpy = jest.spyOn(Flex.TaskChannels, 'register');

  it('creates task channel if feature is enabled', () => {
    const defaultTaskChannelSpy = jest.spyOn(Flex.DefaultTaskChannels, 'createDefaultTaskChannel');
    createCallbackChannel(flex, manager);
    expect(defaultTaskChannelSpy).toHaveBeenCalled();
    taskChannelSpy.mockClear();
  });

  it('registers task channel if feature is enabled', () => {
    createCallbackChannel(flex, manager);
    expect(taskChannelSpy).toHaveBeenCalled();
  });

  it('registers task channel if feature is enabled', () => {
    const expectedResponse = {
      mockData: "mockData",
      templates: {
        IncomingTaskCanvas: {
          data: "mockIncomingTaskCanvas",
          firstLine: (task: Flex.ITask) => task.queueName
        },
        TaskCanvasHeader: {
          data: "mockTaskCanvasHeader",
          title: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`
        },
        TaskListItem: {
          data: "mockTaskListItem",
          firstLine: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`
        },
      },
      icons: {
        active: <VoicemailIcon key="active-voicemail-icon" />,
        list: <VoicemailIcon key="list-voicemail-icon" />,
        main: <VoicemailIcon key="main-voicemail-icon" />,
      }
    }
    createCallbackChannel(flex, manager);
    expect(taskChannelSpy).toHaveBeenCalledWith(expectedResponse);
  });

});