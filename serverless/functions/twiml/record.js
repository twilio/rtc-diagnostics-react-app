exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('Record a message in 3, 2, 1');
  twiml.record({ maxLength: 5, action: `https://${context.DOMAIN_NAME}/twiml/play` });
  twiml.say('Did not detect a message to record');
  callback(null, twiml);
};
