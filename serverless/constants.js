require('dotenv').config();

module.exports = {
  SERVICE_NAME: 'rtc-diagnostics',
  API_KEY_NAME: 'RTC Diagnostics Key',
  TWIML_APP_NAME: 'Test TwiML App',
  VOICE_IDENTITY: process.env.VOICE_IDENTITY || 'RTC_Diagnostics_Test_Identity',
};
