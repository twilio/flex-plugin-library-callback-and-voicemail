## version 1.0.2

- Introduced the _waitexperience_ logic.
- Voicemail retrieval now works with recording media HTTP authentication enabled or disabled.
- In-queue callback and voicemail requests keep their place in line by using the original task's start time for the callback request

## version 1.0.1

- Introduced the usage of flex-ui-telemetry package instead of individual classes.
- Introduced the usage of flex-plugins-library-utils package, which is a helper package with all the common twilio-functions readily used amongst the plugins.

# version 1.0.0

The feature works be registering custom flex channels for callbacks and voicemails. These channels are a presentation only layer, on top of the taskrouter channel, which remains voice.
