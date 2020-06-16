# rtc-diagnostics-react-app

## Getting Started

- Clone the repo and run `npm install`.
- Add your Twilio Account SID and Auth Token to the `.env` file. See `.env.example` for an example.
- Run `npm run serverless:deploy` to deploy the application to Twilio Serverless.
- Run `npm run serverless:list` to view any deployed apps.
- Run `npm run serverless:delete` to delete any deployed apps.

## Local Development

- Follow the steps in the "Getting Started" to deploy the app to Twilio Serverless.
- Add the app's URL to `src/setupProxy.js`.
- Run `npm start`.

## Tests

- Run `npm test` to run all unit tests on the app.
- Run `npm run test:serverless` to run all unit and E2E tests on the Serverless scripts. This requires that your Twilio account credentials are stored in the `.env` file. 