exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('You said:');
  twiml.play(event.RecordingUrl, { loop: '1' });
  twiml.say('Now waiting for a few seconds to gather audio performance metrics.');
  twiml.pause({ length: 3 });
  twiml.say('Hanging up now.');
  callback(null, twiml);
};
