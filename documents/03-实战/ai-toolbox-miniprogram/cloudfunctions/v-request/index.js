const cloud = require("wx-server-sdk");
const axios = require("axios");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { options } = event;

  if (!options || !options.url) {
    return { statusCode: 400, body: "missing url", headers: {} };
  }

  const config = {
    url: options.url,
    method: (options.method || "GET").toUpperCase(),
    headers: options.headers || {},
    timeout: options.timeout || 55000,
    responseType: "text",
    validateStatus: () => true,
  };

  if (options.body && config.method !== "GET") {
    const contentType = (config.headers["Content-Type"] || "").toLowerCase();
    if (contentType.includes("application/json")) {
      try {
        config.data = JSON.parse(options.body);
      } catch {
        config.data = options.body;
      }
    } else {
      config.data = options.body;
    }
  }

  try {
    const res = await axios(config);
    return {
      statusCode: res.status,
      headers: res.headers,
      body: typeof res.data === "object" ? JSON.stringify(res.data) : res.data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {},
      body: `v-request error: ${err.message}`,
    };
  }
};
