exports.handler = function (context, event, callback) {
  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: context.TWIML_APP_SID,
    incomingAllow: true, // Optional: add to allow incoming calls
  });

  const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET, {
    ttl: 120,
  });
  token.addGrant(voiceGrant);
  token.identity = 'test-identity';

  callback(null, { token: token.toJwt() });
};
