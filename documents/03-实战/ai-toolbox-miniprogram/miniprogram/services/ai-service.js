function getModel() {
  if (!wx.cloud || !wx.cloud.extend || !wx.cloud.extend.AI) {
    throw new Error("云开发 AI 能力未初始化，请先配置环境");
  }
  return wx.cloud.extend.AI.createModel("hunyuan-exp");
}

async function streamChat(systemPrompt, userMessage, onChunk) {
  const model = getModel();
  const res = await model.streamText({
    data: {
      model: "hunyuan-turbos-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    },
  });

  for await (let event of res.eventStream) {
    if (event.data === "[DONE]") {
      break;
    }
    const data = JSON.parse(event.data);
    const text = data?.choices?.[0]?.delta?.content;
    if (text && typeof onChunk === "function") {
      onChunk(text);
    }
  }
}

async function agentChat(botId, userMessage, onChunk, history) {
  if (!wx.cloud || !wx.cloud.extend || !wx.cloud.extend.AI) {
    throw new Error("云开发 AI 能力未初始化，请先配置环境");
  }

  const res = await wx.cloud.extend.AI.bot.sendMessage({
    data: {
      botId,
      msg: userMessage,
      history: history || [],
    },
  });

  for await (let str of res.textStream) {
    if (str && typeof onChunk === "function") {
      onChunk(str);
    }
  }
}

async function generateImage(prompt, options = {}) {
  if (!wx.cloud) {
    throw new Error("云开发未初始化");
  }

  const ai = wx.cloud.extend && wx.cloud.extend.AI;
  if (ai && typeof ai.createImageModel === "function") {
    const imageModel = ai.createImageModel("hunyuan-image");
    const modelName = options.model || "hunyuan-image-v3.0-v1.0.4";
    const res = await imageModel.generateImage({
      model: modelName,
      prompt,
      size: options.size || "1024x1024",
      revise: options.revise !== undefined ? options.revise : true,
    });
    return res;
  }

  const res = await wx.cloud.callFunction({
    name: "generateImage-ZtKZSc",
    data: {
      prompt,
      size: options.size || "1024x1024",
    },
  });
  return res.result;
}

module.exports = {
  streamChat,
  agentChat,
  generateImage,
};
