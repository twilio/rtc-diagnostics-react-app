const { TwilioServerlessApiClient } = require('@twilio-labs/serverless-api');
const { getListOfFunctionsAndAssets } = require('@twilio-labs/serverless-api/dist/utils/fs');
const path = require('path');
const cli = require('cli-ux').default;

require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const serverlessClient = new TwilioServerlessApiClient({
  accountSid: process.env.ACCOUNT_SID,
  authToken: process.env.AUTH_TOKEN,
});

let app;
let appInstance;

function createTwiMLApp(domain) {
  return client.applications.create({
    voiceMethod: 'GET',
    voiceUrl: `https://${domain}/record`,
    friendlyName: 'Test TwiML App',
  });
}

async function deploy() {
  const { functions } = await getListOfFunctionsAndAssets(path.join(__dirname, '..'));
  return serverlessClient
    .deployProject({
      env: {
        TWIML_APP_SID: 'foo',
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
      },
      pkgJson: {},
      functionsEnv: 'dev',
      assets: [],
      functions,
      serviceName: 'rtc-diagnostics',
    })
    .then((service) => {
      app = service;
      appInstance = client.serverless.services(app.serviceSid);
      return app;
    });
}

async function updateVariable(sid) {
  const environment = await appInstance.environments(app.environmentSid);
  const variables = await environment.variables.list(); //deployment.environmentSid);
  const TwimlAppSidVariable = variables.find(variable => variable.key === 'TWIML_APP_SID');
  const result = await environment.variables(TwimlAppSidVariable.sid).update({ value: sid });
  cli.action.stop();
  console.log('Deployed to: https://' + app.domain);
}

cli.action.start('Deploying functions');
deploy().then(() => {
  cli.action.start('Registering TwiML App');
  createTwiMLApp(app.domain).then((TwiMLApp) => {
    cli.action.start('Updating configuration');
    updateVariable(TwiMLApp.sid);
  });
});
