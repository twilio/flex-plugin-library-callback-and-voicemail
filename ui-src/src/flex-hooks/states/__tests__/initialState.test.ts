import initialState from '../initialState';

describe('initial state', () => {
  it('should match initial state', () => {
    const expectedState = {
      isCompletingCallbackAction: {},
      isRequeueingCallbackAction: {},
    };
    expect(initialState).toEqual(expectedState);
  });
});
