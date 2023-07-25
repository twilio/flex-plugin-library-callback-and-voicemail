import * as Flex from '@twilio/flex-ui';
import { createCallbackChannel } from '../Callback';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import React from 'react';

describe('createCallbackChannel', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const taskChannelSpy = jest.spyOn(Flex.TaskChannels, 'register');

  it('creates task channel', () => {
    const defaultTaskChannelSpy = jest.spyOn(Flex.DefaultTaskChannels, 'createDefaultTaskChannel');
    createCallbackChannel(flex, manager);
    expect(defaultTaskChannelSpy).toHaveBeenCalled();
    taskChannelSpy.mockClear();
  });

  it('registers task channel', () => {
    createCallbackChannel(flex, manager);
    expect(taskChannelSpy).toHaveBeenCalled();
  });

  it('registers task channel with correct attributes', () => {
    const expectedResponse = {
      mockData: 'mockData',
      templates: {
        IncomingTaskCanvas: {
          data: 'mockIncomingTaskCanvas',
          firstLine: (task: Flex.ITask) => task.queueName,
        },
        TaskCanvasHeader: {
          data: 'mockTaskCanvasHeader',
          title: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
        },
        TaskListItem: {
          data: 'mockTaskListItem',
          firstLine: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
        },
      },
      icons: {
        active: <PhoneCallbackIcon key="active-callback-icon" />,
        list: <PhoneCallbackIcon key="list-callback-icon" />,
        main: <PhoneCallbackIcon key="main-callback-icon" />,
      },
    };

    const mockTask = {
      queueName: 'mock queue',
      attributes: {
        name: 'mock task',
      },
    };
    createCallbackChannel(flex, manager);

    expect(taskChannelSpy.mock.calls[0][0].mockData).toEqual(expectedResponse.mockData);
    expect(taskChannelSpy.mock.calls[0][0].icons).toEqual(expectedResponse.icons);
    expect(taskChannelSpy.mock.calls[0][0].templates.IncomingTaskCanvas.data).toEqual('mockIncomingTaskCanvas');
    expect(taskChannelSpy.mock.calls[0][0].templates.TaskCanvasHeader.data).toEqual('mockTaskCanvasHeader');
    expect(taskChannelSpy.mock.calls[0][0].templates.TaskListItem.data).toEqual('mockTaskListItem');

    let firstLine = taskChannelSpy.mock.calls[0][0].templates.TaskListItem?.firstLine;
    expect(firstLine(mockTask)).toEqual(expectedResponse.templates.TaskListItem.firstLine(mockTask));

    firstLine = taskChannelSpy.mock.calls[0][0].templates.IncomingTaskCanvas.firstLine;
    expect(firstLine(mockTask)).toEqual(expectedResponse.templates.IncomingTaskCanvas.firstLine(mockTask));

    const title = taskChannelSpy.mock.calls[0][0].templates.TaskCanvasHeader?.title;
    expect(title(mockTask)).toEqual(expectedResponse.templates.TaskCanvasHeader.title(mockTask));
  });
});
