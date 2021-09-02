const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    console.log(process.env.REACT_APP_BASEURL);
    app.use(
        createProxyMiddleware(["/api", "/auth"], {
            target: process.env.REACT_APP_BASEURL || "http://localhost:6001/",
            changeOrigin: true,
        })
    );
};
