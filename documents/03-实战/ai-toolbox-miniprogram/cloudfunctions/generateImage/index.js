const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { prompt, size = "1024x1024", revise = true } = event;

  if (!prompt) {
    return { error: "prompt is required" };
  }

  try {
    const ai = cloud.extend && cloud.extend.AI;
    if (ai && typeof ai.createImage === "function") {
      return await ai.createImage({
        model: "hunyuan-image",
        prompt,
        size,
        revise,
      });
    }

    if (typeof cloud.ai === "function") {
      const aiInstance = cloud.ai();
      if (aiInstance && typeof aiInstance.createImage === "function") {
        return await aiInstance.createImage({
          model: "hunyuan-image",
          prompt,
          size,
          revise,
        });
      }
    }

    return {
      error: "AI 能力不可用，请确保 wx-server-sdk 为 beta 版本且已正确安装",
      sdkVersion: cloud.getWXContext ? "has getWXContext" : "no getWXContext",
      hasExtend: !!cloud.extend,
      hasAi: typeof cloud.ai,
    };
  } catch (err) {
    return { error: err.message || "生图失败" };
  }
};
