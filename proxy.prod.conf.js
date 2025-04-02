module.exports = {
  "/auth/**": {
    "target": "http://104.248.62.255:8081/api/v1/public/auth",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/auth": ""
    }
  },
  "/document-type/**": {
    "target": "http://104.248.62.255:8001/api/v1/public/document-type",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/document-type": ""
    }
  },
  "/passenger/**": {
    "target": "http://104.248.62.255:8001/api/v1/public/passenger",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/passenger": ""
    }
  },
  "/cities/**": {
    "target": "http://104.248.62.255:8002/api/v1/public/cities",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/cities": ""
    }
  },
  "/flights/**": {
    "target": "http://104.248.62.255:8002/api/v1/public/flights",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/flights": ""
    }
  }
}