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
    "target": "https://api-acmeairlines.duckdns.org/passengers/api/v1/document-type",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/document-type": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/passenger/**": {
    "target": "https://api-acmeairlines.duckdns.org/passengers/api/v1/passenger",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/passenger": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/cities/**": {
    "target": "https://api-acmeairlines.duckdns.org/flights/api/v1/public/cities",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/cities": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/flights/**": {
    "target": "https://api-acmeairlines.duckdns.org/flights/api/v1/public/flights",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/flights": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/fees/**": {
    "target": "https://api-acmeairlines.duckdns.org/tariff/api/v1/fees",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/fees": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/service-fee/**": {
    "target": "https://api-acmeairlines.duckdns.org/tariff/api/v1/service-fee",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/service-fee": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/user/**": {
    "target": "https://api-acmeairlines.duckdns.org/passengers/api/v1/user",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/user": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  },
  "/service-passenger/**": {
    "target": "https://api-acmeairlines.duckdns.org/tariff/api/v1/service-passenger",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/service-passenger": ""
    },
    "headers": {
      "Origin": "https://api-acmeairlines.duckdns.org"
    }
  }
}