function getModel() {
  if (!wx.cloud || !wx.cloud.extend || !wx.cloud.extend.AI) {
    throw new Error("云开发 AI 能力未初始化，请先配置环境");
  }
  return wx.cloud.extend.AI.createModel("hunyuan-exp");
}

async function streamChat(systemPrompt, userMessage, onChunk) {
  const model = getModel();
  const stream = await model.streamText({
    data: {
      model: "hunyuan-turbos-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    },
  });

  for await (const text of stream.textStream) {
    if (typeof onChunk === "function") onChunk(text);
  }
}

async function generateImage(prompt) {
  const model = getModel();
  const res = await model.generateImage({
    data: {
      model: "hunyuan-image",
      prompt,
      style: "photography",
    },
  });
  return res;
}

module.exports = {
  streamChat,
  generateImage,
};
