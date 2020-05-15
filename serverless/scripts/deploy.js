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
  cli.action.start('Creating Api Key');
  const api_key = await client.newKeys.create({ friendlyName: 'RTC Diagnostics Key' });
  cli.action.start('Deploying functions');
  const { functions } = await getListOfFunctionsAndAssets(path.join(__dirname, '..'));
  return serverlessClient.deployProject({
    env: {
      TWIML_APP_SID: 'foo',
      API_KEY: api_key.sid,
      API_SECRET: api_key.secret,
    },
    pkgJson: {},
    functionsEnv: 'dev',
    assets: [],
    functions,
    serviceName: 'rtc-diagnostics',
  });
}

function createTwiMLApp(domain) {
  cli.action.start('Registering TwiML App');
  return client.applications.create({
    voiceMethod: 'GET',
    voiceUrl: `https://${domain}/twiml/record`,
    friendlyName: 'Test TwiML App',
  });
}

async function updateVariable(app, TwiMLApp) {
  cli.action.start('Updating configuration');
  const appInstance = await client.serverless.services(app.serviceSid);
  const environment = await appInstance.environments(app.environmentSid);
  const variables = await environment.variables.list();
  const TwimlAppSidVariable = variables.find((variable) => variable.key === 'TWIML_APP_SID');
  return await environment.variables(TwimlAppSidVariable.sid).update({ value: TwiMLApp.sid });
}

(async () => {
  const app = await deploy();
  const TwiMLApp = await createTwiMLApp(app.domain);
  await updateVariable(app, TwiMLApp);

  cli.action.stop();
  console.log('Deployed to: https://' + app.domain);
})();