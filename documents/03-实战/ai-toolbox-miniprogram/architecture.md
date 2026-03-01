# 智藏 — 架构说明

> 版本：v1.0 | 更新日期：2026-03-01

---

## 一、整体架构

```
┌─────────────────────────────────────────────────┐
│                  微信小程序端                      │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 首页     │  │ 工具页面  │  │ 我的     │        │
│  │ (tabBar) │  │ (分包)   │  │ (tabBar) │        │
│  └────┬─────┘  └────┬─────┘  └──────────┘       │
│       │              │                            │
│  ┌────┴──────────────┴──────────────────┐        │
│  │           公共层                       │        │
│  │  ┌────────────┐  ┌────────────┐      │        │
│  │  │ utils/     │  │ services/  │      │        │
│  │  │ canvas工具 │  │ AI服务封装  │      │        │
│  │  │ 广告管理器 │  │            │      │        │
│  │  └────────────┘  └─────┬──────┘      │        │
│  └────────────────────────┼─────────────┘        │
│                           │                       │
└───────────────────────────┼───────────────────────┘
                            │
                   ┌────────┴────────┐
                   │  微信云开发       │
                   │  ┌────────────┐ │
                   │  │ 混元大模型  │ │
                   │  │ (文本/图片) │ │
                   │  └────────────┘ │
                   └─────────────────┘
```

---

## 二、目录结构

```
ai-toolbox-miniprogram/
├── miniprogram/
│   ├── app.js                    # 应用入口，初始化云开发
│   ├── app.json                  # 全局配置（tabBar、分包、权限）
│   ├── app.wxss                  # 全局样式
│   │
│   ├── pages/                    # 主包页面
│   │   ├── index/                # 首页（工具列表）
│   │   │   ├── index.js
│   │   │   ├── index.wxml
│   │   │   ├── index.wxss
│   │   │   └── index.json
│   │   └── mine/                 # 我的
│   │       ├── mine.js
│   │       ├── mine.wxml
│   │       ├── mine.wxss
│   │       └── mine.json
│   │
│   ├── packageImage/             # 图片工具分包
│   │   ├── id-photo/             # AI 证件照
│   │   ├── compress/             # 图片压缩
│   │   ├── collage/              # 图片拼图
│   │   ├── format/               # 格式转换
│   │   ├── watermark/            # 加水印
│   │   ├── style-transfer/       # AI 风格化
│   │   └── text-to-image/        # AI 文生图
│   │
│   ├── packageText/              # 文字工具分包
│   │   ├── copywriting/          # AI 文案生成
│   │   ├── naming/               # AI 起名字
│   │   ├── polish/               # AI 文字润色
│   │   ├── weekly-report/        # AI 周报
│   │   └── couplet/              # AI 对联/藏头诗
│   │
│   ├── packageUtil/              # 实用工具分包
│   │   ├── word-count/           # 字数统计
│   │   ├── qrcode/               # 二维码生成
│   │   ├── unit-convert/         # 单位换算
│   │   └── color-picker/         # 颜色提取器
│   │
│   ├── components/               # 公共组件
│   │   ├── tool-card/            # 工具卡片
│   │   ├── ad-banner/            # 广告 Banner 封装
│   │   └── loading-state/        # 加载状态/骨架屏
│   │
│   ├── services/                 # 服务层
│   │   └── ai-service.js         # 混元 AI 调用封装
│   │
│   ├── utils/                    # 工具函数
│   │   ├── canvas-helper.js      # Canvas 2D 图片处理工具
│   │   ├── ad-manager.js         # 广告管理器
│   │   ├── storage.js            # 本地存储管理
│   │   └── constants.js          # 常量定义（尺寸、颜色等）
│   │
│   └── assets/                   # 静态资源
│       ├── icons/                # 工具图标
│       └── images/               # 占位图等
│
├── project.config.json           # 项目配置
├── project.private.config.json   # 个人配置（不提交）
└── package.json                  # npm 依赖
```

---

## 三、模块职责

| 模块 | 职责 | 依赖 |
|:---|:---|:---|
| `pages/index` | 首页工具列表展示、搜索、分类筛选 | TDesign 组件 |
| `pages/mine` | 使用记录、常用工具、关于页 | storage.js |
| `packageImage/*` | 各图片处理工具页面 | canvas-helper.js, ad-manager.js |
| `packageText/*` | 各 AI 文字工具页面 | ai-service.js, ad-manager.js |
| `packageUtil/*` | 各纯前端实用工具页面 | 无外部依赖 |
| `services/ai-service.js` | 封装混元 AI 调用（文本流式/图片生成） | 微信云开发 SDK |
| `utils/canvas-helper.js` | Canvas 2D 图片处理（压缩/抠图/拼图等） | 微信 Canvas 2D API |
| `utils/ad-manager.js` | 广告创建/展示/回调/降级 | 微信广告 API |
| `utils/storage.js` | 使用记录的本地缓存读写 | wx.setStorageSync |
| `components/tool-card` | 首页工具卡片的可复用组件 | TDesign 组件 |

---

## 四、数据流

### AI 文字工具数据流

```
用户输入(主题/关键词)
  → 页面构建 prompt（system + user message）
  → ai-service.streamChat()
  → 混元大模型流式返回
  → 页面逐字渲染
  → 用户点击复制/保存
  → ad-manager.showRewardedVideo()
  → 广告完成 → 执行复制/保存
```

### 图片处理数据流

```
用户选择图片(wx.chooseMedia)
  → Canvas 2D 绘制原图
  → 像素处理(getImageData → 算法处理 → putImageData)
  → Canvas 输出结果图(toDataURL)
  → 用户点击保存
  → ad-manager.showRewardedVideo()
  → 广告完成 → wx.saveImageToPhotosAlbum()
```

---

## 五、关键设计决策

| 决策 | 选择 | 理由 |
|:---|:---|:---|
| 视觉风格 | 极简黑白灰 + 精致微动效 | 干净克制，详见 [design-guide.md](./design-guide.md) |
| 图片处理在前端还是后端 | 前端 Canvas | 隐私保护 + 无服务器成本 + 响应快 |
| AI 调用流式还是一次性 | 流式 | 用户体验好，有打字效果 |
| 状态管理 | 页面级 data + 本地缓存 | 工具类无需全局状态管理 |
| 分包还是单包 | 分包 | 主包 < 2MB 限制，按工具类别分包 |
| 广告失败处理 | 降级为直接操作 | 不能因广告阻塞用户核心功能 |
