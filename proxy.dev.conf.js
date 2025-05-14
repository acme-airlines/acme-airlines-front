module.exports = {
  
  "/auth": {
    "target": "https://api-acmeairlines.duckdns.org/oauth/api/v1/public/auth",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/auth": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/document-type/**": {
    "target": "http://localhost:8001/passengers/api/v1/document-type",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/document-type": ""
    }
  },
  "/passenger/**": {
    "target": "http://localhost:8001/passengers/api/v1/passenger",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/passenger": ""
    }
  },
  "/cities/**": {
    "target": "http://localhost:8002/flights/api/v1/cities",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/cities": ""
    }
  },
  "/flights/**": {
    "target": "http://localhost:8002/flights/api/v1/flights",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/flights": ""
    }
  },
  "/fees/**": {
    "target": "http://localhost:8003/fees-tariff/api/v1/fees",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/fees": ""
    }
  },
  "/service-fee/**": {
    "target": "http://localhost:8003/fees-tariff/api/v1/service-fee",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/service-fee": ""
    }
  },
  "/user/**": {
    "target": "http://localhost:8001/passengers/api/v1/user",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/user": ""
    }
  },
  "/service-passenger/**": {
    "target": "http://localhost:8003/fees-tariff/api/v1/service-passenger",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/service-passenger": ""
    }
  }
}
