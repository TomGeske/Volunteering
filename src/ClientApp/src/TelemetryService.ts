import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

class TelemetryService {
  reactPlugin: ReactPlugin;
  appInsights?: ApplicationInsights;

  constructor() {
    this.reactPlugin = new ReactPlugin();
    this.appInsights = undefined;
  }

  initialize(reactPluginConfig) {
    let INSTRUMENTATION_KEY = 'a450a2bc-72cd-45a6-8e75-f3afed3b2382'; // Enter your instrumentation key here

    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: INSTRUMENTATION_KEY,
        maxBatchInterval: 0,
        disableFetchTracking: false,
        extensions: [this.reactPlugin],
        extensionConfig: {
          [this.reactPlugin.identifier]: reactPluginConfig
        }
      }
    });
    this.appInsights.loadAppInsights();
  }
}

export let ai = new TelemetryService();