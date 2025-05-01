module.exports = {
  "/auth/**": {
    "target": "http://localhost:8081/api/v1/public/auth",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/auth": ""
    }
  },
  "/document-type/**": {
    "target": "http://localhost:8001/api/v1/public/document-type",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/document-type": ""
    }
  },
  "/passenger/**": {
    "target": "http://localhost:8001/api/v1/public/passenger",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/passenger": ""
    }
  },
  "/cities/**": {
    "target": "http://localhost:8002/flights/api/v1/public/cities",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/cities": ""
    }
  },
  "/flights/**": {
    "target": "http://localhost:8002/flights/api/v1/public/flights",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/flights": ""
    }
  }
}
