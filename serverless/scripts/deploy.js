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

async function deploy() {
  const { functions } = await getListOfFunctionsAndAssets(path.join(__dirname, '..'));
  return serverlessClient.deployProject({
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
  });
}

async function updateVariable(app, TwiMLApp) {
  const appInstance = await client.serverless.services(app.serviceSid);
  const environment = await appInstance.environments(app.environmentSid);
  const variables = await environment.variables.list();
  const TwimlAppSidVariable = variables.find((variable) => variable.key === 'TWIML_APP_SID');
  return await environment.variables(TwimlAppSidVariable.sid).update({ value: TwiMLApp.sid });
}

(async () => {
  cli.action.start('Deploying functions');
  const app = await deploy();

  cli.action.start('Registering TwiML App');
  const TwiMLApp = await client.applications.create({
    voiceMethod: 'GET',
    voiceUrl: `https://${app.domain}/record`,
    friendlyName: 'Test TwiML App',
  });

  cli.action.start('Updating configuration');
  await updateVariable(app, TwiMLApp);

  cli.action.stop();
  console.log('Deployed to: https://' + app.domain);
})();
