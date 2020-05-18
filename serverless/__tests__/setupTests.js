global.Twilio = require('twilio');

process.on('unhandledRejection', (err) => {
  throw err;
});
