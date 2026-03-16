/**
 * v-request 客户端 SDK
 * 基于 https://github.com/guren-cloud/v-request 改造
 * 通过云函数代理发起 HTTP 请求，突破小程序域名白名单限制
 */

function vrequest(options) {
  const defaults = {
    method: "GET",
    responseType: "text",
    header: { "Content-Type": "application/json" },
  };

  const merged = Object.assign({}, defaults, options, {
    header: Object.assign({}, defaults.header, options.header),
  });

  let body = options.data;
  if (typeof body === "object") {
    body = JSON.stringify(body);
  }

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "v-request",
      data: {
        options: {
          url: merged.url,
          method: merged.method.toUpperCase(),
          headers: merged.header,
          body: body,
          timeout: merged.timeout || 15000,
        },
      },
      success(res) {
        const result = res.result || {};
        let data = result.body;

        if (merged.dataType === "json" && typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (err) {
            console.warn("[v-request] JSON parse failed:", err.message);
          }
        }

        const returnData = {
          data,
          statusCode: result.statusCode,
          header: result.headers,
          errMsg: "request:ok",
        };

        if (typeof options.success === "function") {
          options.success(returnData);
        }
        resolve(returnData);
      },
      fail(err) {
        const errData = { errMsg: "request:fail", err };
        if (typeof options.fail === "function") {
          options.fail(errData);
        }
        reject(errData);
      },
      complete: options.complete,
    });
  });
}

module.exports = { vrequest };
