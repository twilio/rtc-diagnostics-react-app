exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('You said:');
  twiml.play(event.RecordingUrl, { loop: '1' });
  twiml.say('Hanging up now.');
  callback(null, twiml);
};
