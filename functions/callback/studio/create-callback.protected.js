const { prepareStudioFunction } = require(Runtime.getFunctions()['helpers/prepare-function'].path);
const CallbackOperations = require(Runtime.getFunctions()['common/callback-operations']
  .path);

const requiredParameters = [
  { key: 'numberToCall', purpose: 'the number of the customer to call' },
  {
    key: 'numberToCallFrom',
    purpose: 'the number to call the customer from',
  },
  {
    key: 'flexFlowSid',
    purpose: 'the SID of the Flex Flow that triggered this function',
  },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      numberToCall,
      numberToCallFrom,
      flexFlowSid,
      workflowSid: overriddenWorkflowSid,
      timeout: overriddenTimeout,
      priority: overriddenPriority,
      attempts: retryAttempt,
      conversation_id,
      message,
      utcDateTimeReceived,
      RecordingSid,
      recordingSid,
      RecordingUrl,
      recordingUrl,
      TranscriptionSid,
      transcriptSid,
      TranscriptionText,
      transcriptText,
      isDeleted,
      taskChannel: overriddenTaskChannel,
    } = event;

    const result = await CallbackOperations.createCallbackTask({
      context,
      numberToCall,
      numberToCallFrom,
      flexFlowSid,
      overriddenWorkflowSid,
      overriddenTimeout,
      overriddenPriority,
      retryAttempt,
      conversation_id,
      message,
      utcDateTimeReceived,
      RecordingSid: recordingSid || RecordingSid,
      RecordingUrl: recordingUrl || RecordingUrl,
      TranscriptSid: transcriptSid || TranscriptionSid,
      TranscriptText: transcriptText || TranscriptionText,
      isDeleted,
      overriddenTaskChannel,
    });

    response.setStatusCode(result.status);
    response.setBody({ success: result.success, taskSid: result.taskSid });
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});
