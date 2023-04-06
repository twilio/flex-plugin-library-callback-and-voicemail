## Prerequisites

After plugin installation, studio flow configuration is required to get this plugin to work. There are slightly different configurations required depending on the functionality needed - only callback or callback + voicemail or callback + voicemail + transcription for voicemail.

### Creating a Callback Task Using _create-callback_ Function

Creating a callback involves creating a task with - the number to callback and the number to call from. A sample setup of that is shown here in a studio flow where a number has been wired up to immediately create a callback and hang up.

![Studio configuration](https://raw.githubusercontent.com/twilio/flex-plugin-library-callback-and-voicemail/main/screenshots/studio_configuration_callback.png)

Three parameters are passed to the deployed `create-callback` serverless function from the studio flow:

- numberToCall: {{trigger.call.From}} - the number the customer dialed from
- numberToCallFrom: {{trigger.call.To}} - the number the customer tried to dial
- flexFlowSid: {{flow.flow_sid}} - to capture the entry point of this callback, it is stored on the task

Note: After the plugin is installed and the serverless function is deployed, it can be used from anywhere, not just the studio flow, to create a callback task.

The Studio flow needs the FUNCTION URL parameter which you can get from [Twilio Console > Functions and Assets > Services](https://console.twilio.com/us1/develop/functions/services) > plibo-queued-callback-and-voicemail > Functions > /callback/studio/create-callback > dots menu > Copy URL. Refer screenshot below.
![Functions URL](https://raw.githubusercontent.com/twilio/flex-plugin-library-callback-and-voicemail/main/screenshots/function_url.png)

### Voicemail Additional Parameters

![Studio configuration for voicemail](https://raw.githubusercontent.com/twilio/flex-plugin-library-callback-and-voicemail/main/screenshots/studio_configuration_voicemail.png)
Creating a voicemail involves the same setup as above, however the following additional parameters must be passed to the create-callback function from a Record Voicemail widget:

- RecordingSid: {{widgets.record_voicemail_1.RecordingSid}} - the recording SID from the Record Voicemail widget
- RecordingUrl: {{widgets.record_voicemail_1.RecordingUrl}} - the recording URL from the Record Voicemail widget

### Using Transcriptions in Voicemail Tasks

![Studio configuration for transcription](https://raw.githubusercontent.com/twilio/flex-plugin-library-callback-and-voicemail/main/screenshots/studio_configuration_transcript.png)
If you wish to enable voicemail transcriptions in the voicemail task, you can invoke the create-callback function from the Transcription Callback URL on the Record Voicemail widget. Just be sure to include the required params in the URL. e.g.

`https://plibo-queued-callback-and-voicemail-xxx.twil.io/callback/studio/create-callback?numberToCall={{trigger.call.From | url_encode}}&numberToCallFrom={{trigger.call.To | url_encode}}&flexFlowSid={{flow.sid}}`

NOTE: `RecordingSid` and `RecordingUrl` are already part of the transcription callback event, along with `TranscriptionSid` and `TranscriptionText`. The use of the `url_encode` [Liquid Template Filter](https://www.twilio.com/docs/studio/user-guide/liquid-template-language#standard-filters) allows the leading '+' of the to/from phone numbers to be preserved.

If you do go with the transcription approach, the plugin will take care of rendering the transcription text below the playback controls for the recording - per the screenshot animation above.

## How it works

Plugin is ready to use once it is installed and the browser window is refreshed.

- Agent will receive a callback task. Depending on the configuration, the task may have the associated voicemail and the transcript of the voicemail as well.
- Agent can initiate a callback. If the call does not go through, agent can click Retry so the task is added back to the agent's queue.

## Installation

During installation, 2 fields are required:

1. _TaskRouter Workspace SID_: This is the SID of the "Flex Task Assignment" workspace that you see in [Twilio Console > TaskRouter > Workspaces](https://console.twilio.com/us1/develop/taskrouter/workspaces). Please refer to the screenshot below.
   ![Workspace SID](https://raw.githubusercontent.com/twilio/flex-plugin-library-callback-and-voicemail/main/screenshots/workspace_sid.png)

2. _TaskRouter Callback Workflow SID_: You may want to create a new TaskRouter workflow for callback or use the default workflow in [Twilio Console > TaskRouter > Workspaces > Flex Task Assignment](https://console.twilio.com/us1/develop/taskrouter/workspaces) > Workflows > Assign to Anyone and get its SID.
