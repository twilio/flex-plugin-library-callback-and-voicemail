const { isString, isObject, isNumber } = require("lodash");

const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid the workflow to submit the task
 * @param {string} parameters.taskChannel the task channel to submit the task on
 * @param {object} parameters.attributes the attributes applied to the task
 * @param {number} parameters.priority the priority
 * @param {number} parameters.timeout timeout
 * @returns {object} an object containing the task if successful
 * @description creates a task
 */
exports.createTask = async function createTask(parameters) {
  const {
    context,
    workflowSid,
    taskChannel,
    attributes,
    priority: overriddenPriority,
    timeout: overriddenTimeout,
    attempts,
  } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(workflowSid) || workflowSid.length == 0)
    throw "Invalid parameters object passed. Parameters must contain workflowSid string";
  if (!isString(taskChannel) || taskChannel.length == 0)
    throw "Invalid parameters object passed. Parameters must contain taskChannel string";
  if (!isObject(attributes))
    throw "Invalid parameters object passed. Parameters must contain attributes object";

  const timeout = overriddenTimeout || 86400;
  const priority = overriddenPriority || 0;

  try {
    const client = context.getTwilioClient();
    const task = await client.taskrouter
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks.create({
        attributes: JSON.stringify(attributes),
        workflowSid,
        taskChannel,
        priority,
        timeout,
      });
    
    return {
      success: true,
      taskSid: task.sid,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
      status: 200,
    };
  } catch (error) {

    return retryHandler(error, parameters, arguments.callee);
  }
};