module.exports = {
  "/auth/**": {
    "target": "http://localhost:8081/api/v1/public/auth",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/auth": ""
    }
  }
}
