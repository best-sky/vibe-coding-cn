# 智藏 — 分步实施计划

> 版本：v1.0 | 更新日期：2026-03-01
>
> 原则：每一步要小而具体，每一步必须包含验证测试，先聚焦基础功能。

---

## 总览

| 阶段 | 内容 | 预计耗时 | 产出 |
|:---|:---|:---|:---|
| Step 0 | 环境准备 | 1 小时 | 开发环境就绪 |
| Step 1 | 项目脚手架 + 首页框架 | 2 小时 | 空壳小程序能跑起来 |
| Step 2 | 字数统计工具 | 1 小时 | 第一个完整工具上线 |
| Step 3 | 图片压缩工具 | 2 小时 | Canvas 图片处理验证 |
| Step 4 | AI 证件照制作 | 3 小时 | 核心功能完成 |
| Step 5 | 云开发 + 混元 AI 接入 | 2 小时 | AI 能力跑通 |
| Step 6 | AI 文案生成 | 2 小时 | AI 文字工具验证 |
| Step 7 | AI 起名字 | 1.5 小时 | 第二个 AI 文字工具 |
| Step 8 | 广告接入 | 1.5 小时 | 变现能力就绪 |
| Step 9 | 「我的」页面 + 全局优化 | 2 小时 | MVP 完整 |
| Step 10 | 审核提交 | 1 小时 | 上线发布 |

**总计约 18 小时**，按每天 3 小时算，约 6 天完成 MVP。

---

## Step 0：环境准备

### 任务清单

1. 下载安装「微信开发者工具」（最新稳定版）
2. 在微信公众平台注册小程序账号（个人主体）
3. 选择服务类目：**工具 → 信息查询**（个人可选）
4. 记录 AppID
5. 在小程序后台申请「AI 小程序成长计划」
6. 开通微信云开发环境（免费额度）
7. 安装 Node.js（≥ 16）和 Git

### 验证标准

- [ ] 微信开发者工具能正常打开
- [ ] 能创建一个空白小程序项目并预览
- [ ] 云开发控制台能正常访问
- [ ] AI 成长计划申请已提交

---

## Step 1：项目脚手架 + 首页框架

### 任务清单

1. 用微信开发者工具创建项目，选择「JavaScript + 不使用云服务」模板
2. 初始化 npm，安装 TDesign：`npm i tdesign-miniprogram --production`
3. 在微信开发者工具中「构建 npm」
4. 配置 `app.json`：
   - 设置 tabBar（首页 + 我的）
   - 配置分包（packageImage、packageText、packageUtil）
   - 移除 `"style": "v2"`（避免与 TDesign 冲突）
5. 创建首页 `pages/index/`：
   - 顶部搜索栏
   - 分类 Tab（全部 / AI 图片 / AI 文字 / 实用工具）
   - 工具卡片宫格布局（使用 TDesign Grid 组件）
6. 创建「我的」页面 `pages/mine/`（占位，后面填充）
7. 配置全局样式（主题色、字体）

### 验证标准

- [ ] 小程序能正常启动显示首页
- [ ] TDesign 组件正常渲染（Tab、Grid、Card）
- [ ] 首页显示 6 个工具卡片（可点击但跳转空页面）
- [ ] tabBar 切换正常
- [ ] 真机预览正常

### Git 提交

```
feat: init project scaffold with TDesign and home page layout
```

---

## Step 2：字数统计工具（最简单的工具，验证完整流程）

### 任务清单

1. 在 `packageUtil/word-count/` 创建页面
2. UI：文本输入框 + 统计结果展示
3. 功能：实时统计字数、字符数、行数、段落数
4. 从首页卡片点击跳转到该工具

### 验证标准

- [ ] 从首页点击「字数统计」能正确跳转
- [ ] 输入文字后实时显示统计结果
- [ ] 中英文混合计数正确
- [ ] 返回首页正常

### Git 提交

```
feat: add word count tool with real-time statistics
```

---

## Step 3：图片压缩工具（验证 Canvas 图片处理能力）

### 任务清单

1. 在 `packageImage/compress/` 创建页面
2. UI：选择图片按钮 + 压缩质量滑块 + 预览 + 保存按钮
3. 功能：
   - `wx.chooseMedia` 选择图片
   - 显示原图大小
   - Canvas 2D 绘制 + `canvas.toDataURL` 指定质量压缩
   - 显示压缩后大小
   - `wx.saveImageToPhotosAlbum` 保存到相册
4. 封装 Canvas 工具函数到 `utils/canvas-helper.js`

### 验证标准

- [ ] 能从相册选择图片
- [ ] 滑块调节压缩质量，实时显示压缩后预估大小
- [ ] 压缩后图片能正常保存到相册
- [ ] 图片处理时间 < 3 秒
- [ ] 真机测试通过

### Git 提交

```
feat: add image compress tool with Canvas 2D
```

---

## Step 4：AI 证件照制作（核心功能）

### 任务清单

1. 在 `packageImage/id-photo/` 创建页面
2. UI：
   - 拍照/选图按钮
   - 底色选择（白/红/蓝/浅灰）
   - 尺寸选择（1 寸 / 2 寸 / 小 2 寸）
   - 预览区域
   - 保存按钮
3. 功能：
   - `wx.chooseMedia` 获取照片
   - Canvas `getImageData` 获取像素数据
   - 遍历像素，识别接近白色/纯色的背景区域
   - 将背景像素替换为目标底色
   - 按证件照标准尺寸裁剪
   - 保存到相册
4. 抽取图片处理算法到 `utils/image-processor.js`

### 验证标准

- [ ] 纯白/纯蓝背景照片能成功换底色
- [ ] 4 种底色切换正常
- [ ] 3 种尺寸裁剪正确
- [ ] 处理时间 < 3 秒
- [ ] 真机拍照 + 相册选择均正常

### Git 提交

```
feat: add AI ID photo tool with background replacement
```

---

## Step 5：云开发 + 混元 AI 接入

### 任务清单

1. 在小程序后台开通云开发环境
2. 修改 `app.js` 初始化云开发：`wx.cloud.init({ env: 'xxx' })`
3. 编写 AI 调用封装函数 `services/ai-service.js`：
   - `streamChat(systemPrompt, userMessage, onChunk)` — 流式文本生成
   - `generateImage(prompt)` — 文生图
4. 创建测试页面验证 AI 调用
5. 确认混元 Token 额度正常扣减

### 验证标准

- [ ] 云开发环境初始化成功
- [ ] 调用混元大模型返回文本（流式输出正常）
- [ ] 调用文生图返回图片
- [ ] 错误处理正常（网络异常、额度用完等）

### Git 提交

```
feat: integrate WeChat cloud dev and Hunyuan AI SDK
```

---

## Step 6：AI 文案生成

### 任务清单

1. 在 `packageText/copywriting/` 创建页面
2. UI：
   - 文案类型选择（小红书 / 朋友圈 / 广告语 / 自定义）
   - 主题输入框
   - 关键词标签输入
   - 生成按钮
   - 结果展示区（流式打字效果）
   - 复制按钮
3. 功能：
   - 根据类型 + 主题 + 关键词构建 prompt
   - 调用 `ai-service.streamChat` 流式输出
   - 支持一键复制到剪贴板

### 验证标准

- [ ] 选择「小红书文案」+ 输入主题，能生成合理文案
- [ ] 流式输出有打字效果
- [ ] 复制到剪贴板正常
- [ ] 生成时间 < 10 秒

### Git 提交

```
feat: add AI copywriting generator with streaming output
```

---

## Step 7：AI 起名字

### 任务清单

1. 在 `packageText/naming/` 创建页面
2. UI：
   - 起名类型（宝宝取名 / 品牌起名 / 网名 / 英文名）
   - 姓氏输入（宝宝取名时）
   - 性别选择（宝宝取名时）
   - 风格偏好（文艺 / 大气 / 古风 / 简约）
   - 生成按钮
   - 结果列表（名字 + 寓意解释）
3. 功能：
   - 构建起名 prompt（包含姓氏、性别、风格约束）
   - 调用混元 AI，要求返回 JSON 格式（名字 + 解释）
   - 解析并展示结果列表

### 验证标准

- [ ] 输入姓氏 + 性别，生成 5-10 个名字
- [ ] 每个名字有寓意解释
- [ ] 4 种起名类型均正常
- [ ] 结果可复制

### Git 提交

```
feat: add AI naming tool with multiple categories
```

---

## Step 8：广告接入

### 任务清单

1. 在小程序后台申请流量主资格
2. 创建广告位：
   - 激励视频广告位 × 1
   - Banner 广告位 × 1
   - 插屏广告位 × 1
3. 封装广告管理器 `utils/ad-manager.js`：
   - `showRewardedVideo(onSuccess, onFail)` — 激励视频
   - `createBanner(selector)` — Banner 广告
   - `showInterstitial()` — 插屏广告
4. 在各工具页集成广告：
   - 证件照/图片压缩：保存前触发激励视频
   - AI 文案/起名：查看完整结果前触发激励视频
   - 工具页底部：Banner 广告
   - 返回首页时：插屏广告（频率控制）
5. 无广告位时降级处理（直接允许操作）

### 验证标准

- [ ] 激励视频广告能正常弹出和播放
- [ ] 看完广告后回调正常触发
- [ ] Banner 广告正常显示
- [ ] 插屏广告频率控制生效
- [ ] 广告加载失败时降级为直接操作

### Git 提交

```
feat: integrate ad system with rewarded video and banner
```

---

## Step 9：「我的」页面 + 全局优化

### 任务清单

1. 完善「我的」页面：
   - 使用记录（本地缓存，最近使用的工具）
   - 常用工具快捷入口
   - 关于/意见反馈
2. 首页优化：
   - 添加搜索功能（工具名搜索）
   - 「最近使用」模块
   - 工具使用次数角标
3. 全局体验优化：
   - 骨架屏 / loading 状态
   - 错误提示统一处理
   - 页面切换动画
   - 空状态提示

### 验证标准

- [ ] 「我的」页面正常展示使用记录
- [ ] 首页搜索能过滤工具
- [ ] 各页面加载状态友好
- [ ] 全流程无明显卡顿

### Git 提交

```
feat: add mine page and polish overall UX
```

---

## Step 10：审核提交

### 任务清单

1. 自查清单：
   - [ ] 所有页面真机测试通过
   - [ ] 隐私政策配置完成
   - [ ] 类目选择正确（工具类）
   - [ ] 小程序名称/简介/图标就绪
   - [ ] 无测试数据残留
   - [ ] 广告展示合规（无诱导点击）
2. 在微信开发者工具上传代码
3. 在小程序后台提交审核
4. 准备审核素材：功能说明截图

### 验证标准

- [ ] 代码上传成功
- [ ] 审核提交成功
- [ ] 收到审核通过通知后发布

### Git 提交

```
chore: prepare for WeChat review submission
```

---

## 执行铁律

每一步严格遵循：

```
1. 读 memory-bank → 执行当前步骤
2. 先 Plan 模式确认方案，满意后再 Agent 模式执行
3. 执行完成后手动验证（真机预览）
4. 验证通过 → Git 提交
5. 更新 progress.md
6. /clear 清理上下文 → 进入下一步
```
