const constants = require('../constants')
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

async function findApp() {
  const services = await client.serverless.services.list();
  return services.find((service) => service.friendlyName === constants.SERVICE_NAME);
}

async function getAppInfo() {
  const app = await findApp();
  if (!app) return null;

  const appInstance = client.serverless.services(app.sid);
  const [environment] = await appInstance.environments.list();
  console.log('https://' + environment.domainName);
}

if (require.main === module) {
  getAppInfo();
} else {
  module.exports = getAppInfo
}
