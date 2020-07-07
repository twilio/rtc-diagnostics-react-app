const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/app',
    createProxyMiddleware({
      target: 'https://rtc-diagnostics-7538-dev.twil.io',
      changeOrigin: true,
    })
  );
};
