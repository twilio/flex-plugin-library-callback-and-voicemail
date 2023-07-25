import * as Flex from '@twilio/flex-ui';
import { autoSelectCallbackTaskWhenEndingCall } from '../SelectTask';
import { ErrorManager, FlexErrorSeverity, FlexPluginErrorType } from '../../../utils/ErrorManager';
import { setFlexReduxState, setCustomReduxState } from '../../../../test-utils/flex-redux';

describe('SelectTask', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(flex.Actions, 'invokeAction');

  it('adds beforeSelectTask listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await autoSelectCallbackTaskWhenEndingCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('throws error using ErrorManager', async () => {
    const errorManagerSpy = jest.spyOn(ErrorManager, 'createAndProcessError');

    await autoSelectCallbackTaskWhenEndingCall().catch((err) => {
      expect(errorManagerSpy).toHaveBeenCalled();
    });
  });

  it('invokes beforeSelectTask listener', async () => {
    setFlexReduxState({
      view: {
        selectedTaskSid: '1234',
      },
      worker: {
        tasks: new Map().set('WR123', { sid: 'IT123' }),
      },
    });
    setCustomReduxState({ lastPlacedReservationSid: 'WR123' });
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await autoSelectCallbackTaskWhenEndingCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
    flex.Actions.invokeAction('SelectTask', {});
    expect(actionSpy).toBeCalledWith('SelectTask', {
      sid: 'WR123',
    });
    actionSpy.mockRestore();
  });

  it('does not invoke beforeSelectTask listener if task being selected is not null', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await autoSelectCallbackTaskWhenEndingCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
    flex.Actions.invokeAction('SelectTask', { sid: '123' });
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).not.toBeCalledWith('SelectTask', {
      sid: 'WR123',
    });
    actionSpy.mockRestore();
  });

  it('does not invoke beforeSelectTask listener if no task was selected before event', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await autoSelectCallbackTaskWhenEndingCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
    flex.Actions.invokeAction('SelectTask');
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).not.toBeCalledWith('SelectTask', {
      sid: 'WR123',
    });
  });
});
