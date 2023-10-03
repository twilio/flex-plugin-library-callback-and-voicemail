import FlexTelemetry from '@twilio/flex-ui-telemetry';
import packageJSON from '../../package.json';

export enum Event {
  VOICEMAIL_PLAYED = 'Voicemail played',
  CALLBACK_STARTED = 'Callback Started',
}

export const Analytics = new FlexTelemetry({
  source: 'flexui',
  role: packageJSON.name,
  plugin: packageJSON.name,
  pluginVersion: packageJSON.version,
  originalPluginName: packageJSON.id,
});