const { ProgrammableVoiceUtils } = require('@twilio/flex-plugins-library-utils');

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.callSid the unique call SID to update
 * @param {object} parameters.params call update parameters
 * @returns {Map} The call's properties
 * @description updates the given call
 */
exports.updateCall = async function updateCall(parameters) {
  const { context, callSid, params, attempts } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    callSid,
    params,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const voiceClient = new ProgrammableVoiceUtils(client, config);

  try {
    const call = await voiceClient.updateCall(config);

    return {
      success: call.success,
      call: call.call,
      status: call.status,
    };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.queueSid the unique queue SID to fetch
 * @returns {Map} The given queue's properties
 * @description fetches the given queue SID's properties
 */
exports.fetchVoiceQueue = async (parameters) => {
  const { context, queueSid, attempts } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    queueSid,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const voiceClient = new ProgrammableVoiceUtils(client, config);

  try {
    const call = await voiceClient.fetchVoiceQueue(config);

    return {
      success: call.success,
      queueProperties: call.queueProperties,
      status: call.status,
    };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.recordingSid the recording sid to fetch
 * @returns {object} the recording audio file encoded as base64
 * @description fetches recording by sid
 */
exports.fetchRecordingMedia = async (parameters) => {
  const { context, recordingSid, attempts } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    recordingSid,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const voiceClient = new ProgrammableVoiceUtils(client, config);

  try {
    const media = await voiceClient.fetchRecordingMedia(config);

    return {
      success: media.success,
      recording: media.recording,
      type: media.type,
      status: media.status,
    };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};
