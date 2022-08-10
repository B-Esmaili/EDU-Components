const express = require('express')

module.exports = async function customServer(app, settings, proxyConfig) {
  const handle = app.getRequestHandler()
  await app.prepare()
  const server = express()
  if (proxyConfig) {
    const proxyMiddleware = require('http-proxy-middleware')
    Object.keys(proxyConfig).forEach(context => {
      server.use(proxyMiddleware.createProxyMiddleware(context, proxyConfig[context]))
    })
  }

  // Default catch-all handler to allow Next.js to handle all other routes
  server.all('*', (req, res) => handle(req, res))

  server.listen(settings.port, settings.hostname)
}