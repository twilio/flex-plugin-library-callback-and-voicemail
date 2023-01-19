## Details

This plugin uses Twilio Functions and WorkerClient's createTask method to create conferences and TaskRouter tasks for orchestration in both agent-to-agent calls and external transfers features.

When in a call, a "plus" icon is added to the Call Canvas where you can add a external number to the call. This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.

An invisible component is mounted to track participant state and set endConferenceOnExit appropriately to allow for external transfer functionality -- the agent can leave the call while the remaining conference participants continue to communicate. If there are two parties remaining, the call will automatically end when one of them hangs up.
