module.exports = {
  "/auth": {
    "target": "https://api-acmeairlines.ddns.net/oauth/api/v1/public/auth",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/auth": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/document-type/**": {
    "target": "https://api-acmeairlines.ddns.net/passengers/api/v1/document-type",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/document-type": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/passenger/**": {
    "target": "https://api-acmeairlines.ddns.net/passengers/api/v1/passenger",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/passenger": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/cities/**": {
    "target": "https://api-acmeairlines.ddns.net/flights/api/v1/cities",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/cities": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/flights/**": {
    "target": "https://api-acmeairlines.ddns.net/flights/api/v1/flights",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/flights": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/payments/**": {
    "target": "https://api-acmeairlines.ddns.net/flights/api/v1/payments",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/payments": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/seat/**": {
    "target": "https://api-acmeairlines.ddns.net/flights/api/v1/seat",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/seat": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/fees/**": {
    "target": "https://api-acmeairlines.ddns.net/fees-tariff/api/v1/fees",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/fees": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/service-fee/**": {
    "target": "https://api-acmeairlines.ddns.net/fees-tariff/api/v1/service-fee",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/service-fee": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/user/**": {
    "target": "https://api-acmeairlines.ddns.net/passengers/api/v1/user",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/user": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/service-passenger/**": {
    "target": "https://api-acmeairlines.ddns.net/fees-tariff/api/v1/service-passenger",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/service-passenger": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  },
  "/qr/**": {
    "target": "https://api-acmeairlines.ddns.net/passengers/api/v1/qr",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/qr": "" },
    "headers": {
      "Origin": "https://api-acmeairlines.ddns.net"
    }
  }
};
