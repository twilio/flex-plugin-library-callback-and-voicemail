import CallbackService from '../../../service/CallbackService';
import Actions from '../actions';
import { INITIATE_CALLBACK, REQUEUE_CALLBACK, PLACED_CALLBACK } from '../types';

jest.mock('../../../service/CallbackService', () => ({
  callCustomerBack: jest.fn(() => Promise.resolve()),
  requeueCallback: jest.fn(() => Promise.resolve()),
}));
describe('Actions', () => {
  it('callCustomer creates callCustomer action', () => {
    const mockTask = {
      taskSid: '123',
    };
    const action = Actions.callCustomer(mockTask);
    expect(action).toEqual({
      type: INITIATE_CALLBACK,
      payload: {
        promise: CallbackService.callCustomerBack(mockTask, 0),
        data: mockTask,
      },
    });
  });

  it('requeueCallback creates requeueCallback action', () => {
    const mockTask = {
      taskSid: '123',
    };
    const action = Actions.requeueCallback(mockTask);
    expect(action).toEqual({
      type: REQUEUE_CALLBACK,
      payload: {
        promise: CallbackService.requeueCallback(mockTask),
        data: mockTask,
      },
    });
  });

  it('setLastPlacedCallback creates setLastPlacedCallback action', () => {
    const mockTask = {
      taskSid: '123',
      sid: 'mockTaskSid',
    };
    const action = Actions.setLastPlacedCallback(mockTask);
    expect(action).toEqual({
      type: PLACED_CALLBACK,
      payload: 'mockTaskSid',
    });
  });
});
