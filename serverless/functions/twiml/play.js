exports.handler = function (context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('You said:');
  twiml.play('{{RecordingUrl}}', { loop: '1' });
  twiml.say('Hanging up now.');
  callback(null, twiml);
};
