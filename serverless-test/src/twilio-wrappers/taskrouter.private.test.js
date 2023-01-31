import helpers from '../../test-utils/test-helper';

describe('Taskrouter create task', () => {
    beforeAll(() => {
        helpers.setup();
        global.Runtime._addFunction(
            'common/twilio-wrappers/retry-handler',
            './serverless/src/functions/common/twilio-wrappers/retry-handler.private.js',
        );
    });

    const getTaskrouterMockClient = function (createTask) {
        const mockTaskrouterService = {
            tasks: {
                create: createTask,
            }
        }
        return {
            taskrouter: {
                workspaces: (_workspaceSid) => mockTaskrouterService
            }
        }

    }

    const mockTask = {
        sid: "TSxxx",
        attributes: '{"taskType": "callback"}'
    }
    const createTaskMock = jest.fn(() => Promise.resolve(mockTask));
    const context = { getTwilioClient: () => getTaskrouterMockClient(createTaskMock) };

    it('creates task successfully', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };

        const response = await createTask({ context, ...parameters });
        expect(response.success).toEqual(true);
    });

    it('throws error for invalid number of attempts', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 'abc',
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain the number of attempts");
    });

    it('throws error for invalid context', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain context object");
    });

    it('throws error if workflowSid is not string', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: 1,
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ context, ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain workflowSid string");
    });

    it('throws error if workflowSid is missing', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ context, ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain workflowSid string");
    });

    it('throws error if taskChannel is not string', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            taskChannel: 1,
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ context, ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain taskChannel string");
    });

    it('throws error if taskChannel is missing', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: {
                taskType: "callback"
            }
        };
        let err = null;
        try {
            await createTask({ context, ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain taskChannel string");
    });

        it('throws error for invalid attributes', async () => {
        const { createTask } = require('../../../serverless/src/functions/common/twilio-wrappers/taskrouter.private');
        const parameters = {
            workflowSid: "WWxxx",
            taskChannel: "TCxxx",
            priority: 1,
            timeout: 10,
            attempts: 1,
            attributes: "mockAttributes"
        };
        let err = null;
        try {
            await createTask({ context, ...parameters });
        } catch (error) {
            err = error;
        }

        expect(err).toBe("Invalid parameters object passed. Parameters must contain attributes object");
    });
});