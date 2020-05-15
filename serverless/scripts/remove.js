require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

async function remove() {
  const services = await client.serverless.services.list();
  const app = services.find((service) => service.friendlyName === 'rtc-diagnostics');
  client.serverless.services(app.sid).remove();
}

remove();
