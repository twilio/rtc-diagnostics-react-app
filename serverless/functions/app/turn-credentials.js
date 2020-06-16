exports.handler = function (context, event, callback) {
  const client = context.getTwilioClient();
  client.tokens.create({ ttl: 180 }).then((token) => callback(null, token));
};
