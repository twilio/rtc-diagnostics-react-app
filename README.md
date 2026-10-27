# Voice Diagnostics Tool

[![CircleCI](https://circleci.com/gh/twilio/rtc-diagnostics-react-app.svg?style=svg)](https://circleci.com/gh/twilio/rtc-diagnostics-react-app)

The Voice Diagnostics Tool provides connectivity and bandwidth requirements tests towards Twilio’s Programmable Voice servers and audio device tests to check browser VoIP calling readiness. It uses the [RTC Diagnostics SDK](https://github.com/twilio/rtc-diagnostics) and [Twilio Voice JS SDK](https://github.com/twilio/twilio-voice.js) to perform the tests.

This application uses Programmable Voice and Twilio NTS to perform the tests and will incur charges. See [Programmable Voice pricing](https://www.twilio.com/voice/pricing) and [NTS pricing](https://www.twilio.com/stun-turn/pricing).

## Features

- Bandwidth requirements tests
- VoIP quality measurements
- Support for testing towards all of Twilio Edge locations including Private Interconnect
- Side by side comparison of Edge locations connection results
- JSON formatted report
- Easy Copy of report to clipboard
- Interactive Mic testing
- Interactive Speaker tests

## Prerequisites

- A Twilio account. Sign up for free [here](https://www.twilio.com/try-twilio)
- Node.js v12+
- NPM v6+ (comes installed with newer Node versions)

## Install Dependencies

Run `npm install` to install all dependencies from NPM.

If you want to use yarn to install dependencies, first run the [yarn import](https://classic.yarnpkg.com/en/docs/cli/import/) command. This will ensure that yarn installs the package versions that are specified in `package-lock.json`.

## Deploy the App to Twilio

Before deploying the app, add your Twilio Account SID and Auth Token to the `.env` file (see `.env.example` for an example). The app is deployed to Twilio with a single command:

`$ npm run serverless:deploy`

This performs the following steps:

- Builds the React app in the `build/` directory and deploys it to Twilio Serverless.
- Deploys the end points required for performing the tests to Twilio Serverless. These include an access token generator, an NTS token generator, the TwiML App and corresponding TwiML bins

When deployment has finished, the Twilio Serverless URL for the application will be printed to the console. This URL can be used to access the application:

`Deployed to: https://rtc-diagnostics-12345-dev.twil.io`

## View App URL

To view the App URL, run the following command:

`$ npm run serverless:list`

This will display the URL at which the Application can be accessed.

## Local Development

In order to develop this app on your local machine, you will first need to deploy all needed endpoints to Twilio Serverless. To do this, complete the steps in the "Deploy the App to Twilio" section above.

Once the endpoints are deployed, add the app's URL to the `.env` file. Then you can start a local development server by running the following command:

`$ npm run start`

## Tests

Run `npm test` to run all unit tests.

Run `npm run test:serverless` to run all unit and E2E tests on the Serverless scripts. This requires that your Twilio account credentials are stored in the `.env` file.

## Related

- [Twilio Voice JS SDK](https://github.com/twilio/twilio-voice.js)
- [Twilio RTC Diagnostics SDK](https://github.com/twilio/rtc-diagnostics)
- [Twilio Voice Client JS Quickstart](https://github.com/TwilioDevEd/client-quickstart-js)
- [Twilio Client connectivity requirements](https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements)

## Community Contributions and Support

This repository is publicly available and maintained by Twilio under a limited external contribution model.

Due to limited maintenance capacity, external pull requests are not currently accepted.

GitHub Issues may be used to report reproducible bugs or provide feature feedback about this application. Issues are reviewed on a best-effort basis, with no SLA or guaranteed response.

GitHub Issues are not an official Twilio support channel. For production issues, general usage questions, or account-specific assistance, please contact [Twilio Support](https://help.twilio.com/). If you have a Twilio account manager, you may also escalate through them.

Do not share [Personally Identifiable Information (PII)](https://www.twilio.com/docs/glossary/what-is-personally-identifiable-information-pii) or sensitive account information, including access tokens, API keys, and credentials, in issues, logs, or screenshots.

Report security vulnerabilities privately through [Twilio's Vulnerability Disclosure Program](https://www.twilio.com/en-us/security/vulnerability-disclosure-program), rather than public GitHub Issues.

See [CONTRIBUTING.md](https://github.com/twilio/rtc-diagnostics-react-app/blob/main/CONTRIBUTING.md) for reporting guidance.

## License

See the [LICENSE](LICENSE) file for details.
