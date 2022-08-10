const environmentTemplate = env => `https://${env}.mydomain.com`

const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  dev: environmentTemplate('dev'),
  qa: environmentTemplate('qa'),
}

const commonOptions = {
  target: "http://localhost:8055",
  changeOrigin: true,
  ws: true,
  pathRewrite: function (path) { return path.replace('/api', '') },
  onError: function(err) {
    console.log(err.message)
  },
}

module.exports = {
  '/api': commonOptions
}