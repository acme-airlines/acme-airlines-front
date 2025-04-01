module.exports = {
  "/auth/**": {
    "target": "http://104.248.62.255:8081/api/v1/public/auth",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/auth": ""
    }
  }
}