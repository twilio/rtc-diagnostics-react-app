require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const cli = require('cli-ux').default;

async function remove() {
  cli.action.start('Removing service');
  const services = await client.serverless.services.list();
  const app = services.find((service) => service.friendlyName === 'rtc-diagnostics');
  if (app) {
    await client.serverless.services(app.sid).remove();
  }

  cli.action.start('Removing TwiML App');
  const TwiMLApps = await client.applications.list();
  const TwiMLApp = TwiMLApps.find((q) => q.friendlyName === 'Test TwiML App');
  if (TwiMLApp) {
    await client.applications(TwiMLApp.sid).remove();
  }

  cli.action.start('Removing Api Key');
  const keys = await client.keys.list();
  const app_key = keys.find((key) => key.friendlyName === 'RTC Diagnostics Key');
  if (app_key) {
    client.keys(app_key.sid).remove();
  }

  cli.action.stop();
}

if (require.main === module) {
  remove();
} else {
  module.exports = remove
}