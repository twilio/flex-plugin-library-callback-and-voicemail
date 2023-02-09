## Details

The feature works be registering custom Flex channels for callbacks and voicemails. These channels are a presentation only layer, on top of the taskrouter channel, which remains voice.

When the channel is registered, it renders custom components based on the task attribute; taskType: callback or taskType: voicemail

There are two associated serverless functions called create-callback

The only difference between these functions is one is intended to be called from Flex, the other from anywhere else but typically Studio. The difference is the security model for each function but both do the same thing, taking in task attributes and generating a new callback task. The Flex interface is used for the re-queueing feature.
