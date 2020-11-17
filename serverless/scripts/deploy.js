const { TwilioServerlessApiClient } = require('@twilio-labs/serverless-api');
const { getListOfFunctionsAndAssets } = require('@twilio-labs/serverless-api/dist/utils/fs');
const cli = require('cli-ux').default;
const constants = require('../constants');
const { customAlphabet } = require('nanoid');
const viewApp = require(`${__dirname}/list.js`);

const getRandomString = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 8);

require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const serverlessClient = new TwilioServerlessApiClient({
  accountSid: process.env.ACCOUNT_SID,
  authToken: process.env.AUTH_TOKEN,
});

async function deployFunctions() {
  cli.action.start('Creating Api Key');
  const api_key = await client.newKeys.create({ friendlyName: constants.API_KEY_NAME });
  cli.action.start('Deploying assets and functions');

  const { assets, functions } = await getListOfFunctionsAndAssets(__dirname, {
    functionsFolderNames: ['../functions'],
    assetsFolderNames: ['../../build'],
  });

  // Calling 'getListOfFunctionsAndAssets' twice is necessary because it only gets the assets from
  // the first matching folder in the array
  const { assets: fnAssets } = await getListOfFunctionsAndAssets(__dirname, {
    assetsFolderNames: ['../assets'],
  });

  assets.push(...fnAssets);

  const indexHTML = assets.find((asset) => asset.name.includes('index.html'));

  if (indexHTML) {
    assets.push({
      ...indexHTML,
      path: '/',
      name: '/',
    });
  }

  return serverlessClient.deployProject({
    env: {
      API_KEY: api_key.sid,
      API_SECRET: api_key.secret,
      VOICE_IDENTITY: constants.VOICE_IDENTITY,
      APP_EXPIRY: Date.now() + 1000 * 60 * 60 * 24 * 7, // One week
    },
    pkgJson: {},
    functionsEnv: 'dev',
    assets,
    functions,
    serviceName: `${constants.SERVICE_NAME}-${getRandomString()}`,
  });
}

function createTwiMLApp(domain) {
  cli.action.start('Creating TwiML App');
  return client.applications.create({
    voiceMethod: 'GET',
    voiceUrl: `https://${domain}/twiml/echo`,
    friendlyName: constants.TWIML_APP_NAME,
  });
}

async function createTwiMLAppSidVariable(app, TwiMLApp) {
  cli.action.start('Setting environment variables');
  const appInstance = await client.serverless.services(app.serviceSid);
  const environment = await appInstance.environments(app.environmentSid);
  return await environment.variables.create({ key: 'TWIML_APP_SID', value: TwiMLApp.sid });
}

async function deploy() {
  const app = await deployFunctions();
  const TwiMLApp = await createTwiMLApp(app.domain);
  await createTwiMLAppSidVariable(app, TwiMLApp);

  cli.action.stop();
  await viewApp();
}

if (require.main === module) {
  deploy();
} else {
  module.exports = deploy;
}
