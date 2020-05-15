require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

async function findApp(APP_NAME) {
  const services = await client.serverless.services.list();
  return services.find((service) => service.friendlyName === APP_NAME);
}

async function getAppInfo() {
  const app = await findApp('rtc-diagnostics');
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
