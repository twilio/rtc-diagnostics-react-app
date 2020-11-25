exports.handler = function (context, event, callback) {
  const verifyExpiry = require(Runtime.getAssets()['/verify_expiry.js'].path);
  verifyExpiry.handler(context, event, callback);

  const AccessToken = Twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: context.TWIML_APP_SID,
  });

  const token = new AccessToken(context.ACCOUNT_SID, context.API_KEY, context.API_SECRET, {
    ttl: 60,
  });
  token.addGrant(voiceGrant);
  token.identity = context.VOICE_IDENTITY;

  callback(null, { token: token.toJwt() });
};
