# 云开发 Agent 联网搜索接入指南

> 版本：v1.0 | 更新日期：2026-03-12
>
> 目标：通过云开发 Agent 为"智藏"小程序的 AI 工具接入联网搜索能力，提升回答的时效性和准确性。

---

## 背景

当前小程序使用 `wx.cloud.extend.AI` 直接调用 `hunyuan-turbos-latest` 大模型，AI 回答完全依赖模型训练数据，存在以下问题：

- 信息可能过时（如起名时无法参考最新流行趋势）
- 文案生成无法结合实时热点
- 部分回答内容准确性不足

**解决方案**：在云开发控制台创建 Agent 智能体，开启联网搜索，让 AI 在回答时能检索实时网络信息。

---

## 第一部分：云开发控制台操作

### 1.1 创建 Agent

1. 登录 [云开发控制台](https://tcb.cloud.tencent.com/dev)
2. 左侧导航选择 **AI** → **Agent**
3. 点击 **创建 Agent**，选择"自定义创建"或使用模板

### 1.2 配置 Agent

根据不同的 AI 工具，建议创建 **2 个 Agent**（也可以合并为 1 个通用 Agent）：

#### Agent 1：文案创作助手

| 配置项 | 值 |
|:---|:---|
| 名称 | 文案创作助手 |
| 模型 | hunyuan-turbos-latest 或 hunyuan-2.0-instruct |
| 系统提示词 | 你是资深中文营销文案专家，擅长撰写各类社交媒体文案。请结合最新热点和流行趋势进行创作。 |
| 联网搜索 | **开启** |
| 知识库 | 可选，按需添加 |

#### Agent 2：起名专家

| 配置项 | 值 |
|:---|:---|
| 名称 | 起名专家 |
| 模型 | hunyuan-turbos-latest 或 hunyuan-2.0-instruct |
| 系统提示词 | 你是中文起名专家，擅长根据场景和需求起出寓意好、朗朗上口的名字。请结合汉字文化和当前流行趋势。 |
| 联网搜索 | **开启** |
| 知识库 | 可选，按需添加 |

### 1.3 获取 Agent ID

创建完成后，在 Agent 详情页复制 **AgentID**（格式如 `bot-xxxxxxxxx`），后续代码中会用到。

---

## 第二部分：代码修改

### 2.1 修改 `services/ai-service.js`

新增 Agent 调用方法 `agentChat`，保留原有 `streamChat` 作为降级方案：

```javascript
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
  agentChat,
  generateImage,
};
```

### 2.2 修改 `utils/constants.js`

添加 Agent ID 配置常量：

```javascript
const AGENT_IDS = {
  copywriting: "ibot-zhiku-i8z7bi",
  naming: "ibot-zhiku-i8z7bi",
  nickname: "ibot-zhiku-i8z7bi",
};
```

### 2.3 修改工具页面调用方式

以 `packageText/copywriting/index.js` 为例：

```javascript
// 修改前
const { streamChat } = require("../../services/ai-service");

// 修改后
const { agentChat, streamChat } = require("../../services/ai-service");
const { AGENT_IDS } = require("../../utils/constants");
```

将 `onGenerate` 方法中的调用替换：

```javascript
// 修改前
await streamChat("你是资深中文营销文案专家。", this.buildPrompt(), (chunk) => {
  this.setData({ result: `${this.data.result}${chunk}` });
});

// 修改后（优先用 Agent，失败降级到直接模型调用）
try {
  await agentChat(AGENT_IDS.copywriting, this.buildPrompt(), (chunk) => {
    this.setData({ result: `${this.data.result}${chunk}` });
  });
} catch (agentErr) {
  console.warn("Agent 调用失败，降级到直接模型调用", agentErr);
  await streamChat("你是资深中文营销文案专家。", this.buildPrompt(), (chunk) => {
    this.setData({ result: `${this.data.result}${chunk}` });
  });
}
```

起名和网名工具页面同理修改。

---

## 第三部分：验证清单

### 3.1 控制台验证

- [ ] Agent 创建成功，状态为"已发布"
- [ ] Agent 在控制台测试对话中能正常回复
- [ ] Agent 开启联网搜索后，回答能包含实时信息

### 3.2 小程序端验证

- [ ] AI 文案生成：生成的文案是否包含时效性内容（如最近热点）
- [ ] AI 起名：起名结果是否更合理、寓意更丰富
- [ ] AI 网名：网名风格是否更贴合当前流行趋势
- [ ] Agent 调用失败时能自动降级到直接模型调用
- [ ] 流式输出打字效果正常

### 3.3 异常场景

- [ ] 网络异常时的错误提示
- [ ] Agent 额度用完时的降级处理
- [ ] 联网搜索超时时的处理

---

## 第四部分：注意事项

### 4.1 费用

- Agent 调用会消耗混元 Token 额度（AI 成长计划免费额度内）
- 联网搜索可能有额外的 API 调用计费，请关注云开发控制台的用量统计

### 4.2 性能

- 开启联网搜索后，响应时间可能增加 1-3 秒（搜索耗时）
- 建议在 UI 上给用户"正在搜索最新信息..."的提示

### 4.3 合规

- 联网搜索返回的内容需注意合规性
- 建议在 Agent 系统提示词中加入内容安全约束

### 4.4 threadId 管理

- 当前实现为每次对话生成新的 `threadId`（单轮对话）
- 如需多轮对话功能，需要在页面 data 中持久化 `threadId`

---

## 备选方案：直接模型调用 + 联网参数

如果不想创建 Agent，也可以尝试在 `streamText` 中直接传入联网搜索参数（需要测试 SDK 是否支持透传）：

```javascript
const res = await model.streamText({
  data: {
    model: "hunyuan-turbos-latest",
    messages: [...],
    enable_enhancement: true,
    force_search_enhancement: true,
    search_info: true,
  },
});
```

> 注意：此方案在云开发 SDK 文档中未明确说明是否支持，需要实际测试验证。
> 腾讯云直接的混元 API 是支持这些参数的，但通过 `wx.cloud.extend.AI` 包装后能否透传，需要自行验证。
