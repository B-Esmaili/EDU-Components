// import httpProxy from 'http-proxy'
// const API_SERVER_URL = process.env.API_SERVER_URL // The actual URL of your API
// const proxy = httpProxy.createProxyServer()
// // Make sure that we don't parse JSON bodies on this route:
// export const config = {
//     api: {
//         bodyParser: false
//     }
// }
// const catchAll = (req, res) => {
//     const x = req.originalUrl.indexOf("refresh") >= 0 ? "/auth/refresh" : req.originalUrl.replace("/api/", "/");
//     req.path = x;
//     proxy.web(req, res, { target: API_SERVER_URL, changeOrigin: true });

//     //proxy.on('proxyReq', function(proxyReq, req, res, options) {});
// }

// export default catchAll;