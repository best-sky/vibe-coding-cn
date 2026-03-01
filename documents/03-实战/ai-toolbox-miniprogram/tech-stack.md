# 智藏 — 技术栈选型

> 版本：v1.0 | 更新日期：2026-03-01

---

## 一、技术选型总览

| 层级 | 选型 | 理由 |
|:---|:---|:---|
| **小程序框架** | 微信原生小程序 | 最稳定、审核最友好、文档最全 |
| **UI 组件库** | TDesign MiniProgram | 腾讯官方出品，风格统一，60+ 组件 |
| **AI 能力** | 微信云开发 + 混元大模型 | 免费 1 亿 Token + 1 万张文生图 |
| **图片处理** | Canvas 2D API | 纯前端处理，无需服务器 |
| **后端服务** | 微信云开发（免费额度） | 零运维，AI 调用需要云函数中转 |
| **广告** | 微信广告流量主 | 原生集成，免开发智能接入 |
| **设计风格** | 极简黑白灰 + 精致微动效 | 详见 [design-guide.md](./design-guide.md) |
| **包管理** | npm | 管理 TDesign 等第三方依赖 |

---

## 二、为什么选原生而不选 Taro/uni-app

| 维度 | 原生微信小程序 | Taro / uni-app |
|:---|:---|:---|
| 审核通过率 | 最高 | 偶有兼容问题 |
| Canvas 性能 | 原生最优 | 跨端有性能损耗 |
| 云开发集成 | 原生支持 | 需额外配置 |
| 混元 AI 接入 | 3 行代码 | 需适配层 |
| 学习成本 | 低（WXML + WXSS + JS） | 需学框架 |
| 跨端需求 | 当前不需要 | 如未来需要可迁移 |

**结论**：当前只做微信小程序，原生方案是最优解。

---

## 三、核心技术方案

### 3.1 AI 能力接入（混元大模型）

**前置条件**：
1. 申请 AI 小程序成长计划（免费 6 个月云开发 + 1 亿 Token）
2. 小程序类目选择「工具」
3. 基础库 ≥ 3.7.1

**文本生成调用方式**（流式）：

```javascript
const model = wx.cloud.extend.AI.createModel("hunyuan-exp")
const res = await model.streamText({
  data: {
    model: "hunyuan-turbos-latest",
    messages: [
      { role: "system", content: "你是一个专业的文案助手" },
      { role: "user", content: userInput }
    ]
  }
})

for await (let str of res.textStream) {
  // 流式渲染到页面
}
```

**文生图调用方式**：

```javascript
const res = await model.generateImage({
  data: {
    prompt: "用户描述的图片内容",
    style: "cartoon"
  }
})
```

### 3.2 图片处理方案（Canvas 2D）

所有图片处理均在小程序端本地完成，**不上传服务器**：

| 功能 | 技术实现 |
|:---|:---|
| 证件照抠图 | Canvas getImageData → 像素遍历 → 背景色判断 → 透明化 → 换底色 |
| 图片压缩 | Canvas drawImage → toDataURL(quality) / wx.compressImage |
| 图片拼图 | Canvas 多次 drawImage 按布局排列 |
| 格式转换 | Canvas toDataURL('image/jpeg' / 'image/png') |
| 加水印 | Canvas fillText / drawImage 叠加 |

**Canvas 2D 初始化模板**：

```javascript
// WXML
// <canvas id="canvas" type="2d" style="width:100%;height:100%"></canvas>

// JS
const query = wx.createSelectorQuery()
query.select('#canvas').fields({ node: true, size: true }).exec((res) => {
  const canvas = res[0].node
  const ctx = canvas.getContext('2d')
  // 设置 canvas 实际像素尺寸
  const dpr = wx.getWindowInfo().pixelRatio
  canvas.width = res[0].width * dpr
  canvas.height = res[0].height * dpr
  ctx.scale(dpr, dpr)
})
```

### 3.3 分包策略

主包控制在 2MB 以内，工具按类别分包：

```
miniprogram/
├── app.js / app.json / app.wxss    # 主包（< 2MB）
├── pages/
│   ├── index/                       # 首页（主包）
│   └── mine/                        # 我的（主包）
├── packageImage/                    # 图片工具分包
│   ├── id-photo/                    # 证件照
│   ├── compress/                    # 压缩
│   ├── collage/                     # 拼图
│   └── ...
├── packageText/                     # 文字工具分包
│   ├── copywriting/                 # AI 文案
│   ├── naming/                      # AI 起名
│   └── ...
└── packageUtil/                     # 实用工具分包
    ├── word-count/                  # 字数统计
    └── ...
```

### 3.4 广告集成

```javascript
// 激励视频广告（保存结果前触发）
let videoAd = null
if (wx.createRewardedVideoAd) {
  videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-xxxxxxxxx'
  })
  videoAd.onClose((res) => {
    if (res && res.isEnded) {
      // 用户看完广告，执行保存
      saveResult()
    }
  })
}
```

---

## 四、开发工具链

| 工具 | 用途 |
|:---|:---|
| 微信开发者工具 | 开发、调试、预览、上传 |
| Cursor IDE | 代码编写（AI 辅助） |
| npm | 管理 TDesign 等依赖 |
| Git | 版本控制 |

---

## 五、胶水编程清单（轮子一览）

按照 Vibe Coding 胶水编程原则，以下是需要复用的成熟轮子：

| 轮子 | 来源 | 用途 | 安装方式 |
|:---|:---|:---|:---|
| tdesign-miniprogram | npm | UI 组件库 | `npm i tdesign-miniprogram` |
| weapp-qrcode | npm | 二维码生成 | `npm i weapp-qrcode` |
| 混元 AI SDK | 微信云开发内置 | AI 文本/图片生成 | 云开发自带 |
| Canvas 2D | 微信基础库内置 | 图片处理 | 无需安装 |
| wx.createRewardedVideoAd | 微信基础库内置 | 激励视频广告 | 无需安装 |

**胶水代码**只负责：
- 用户输入 → 构建 prompt → 调用混元 API → 渲染结果
- 用户选图 → Canvas 处理 → 输出结果图 → 保存相册
- 操作完成 → 触发广告 → 确认后保存
