const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api/v1',
        createProxyMiddleware({
            target: 'http://localhost:9000/OnlineTest',
            changeOrigin: true
        })
    )
}