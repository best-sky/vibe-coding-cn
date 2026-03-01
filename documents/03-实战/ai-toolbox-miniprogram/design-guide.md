# 智藏 — 样式风格指南

> 版本：v2.0 | 更新日期：2026-03-01

---

## 一、设计理念

### 一句话

**留白即高级，动画即灵魂。**

### 风格关键词

**极简 · 干净 · 呼吸感 · 精致微动效**

### 设计参考

- Apple Liquid Glass（2025）— 层次感、通透、动态响应
- 线性 Linear App — 极简工具美学
- Notion — 大量留白、黑白灰为主、色彩点缀
- Things 3 — 精致动效、舒适交互

### 核心原则

| 原则 | 做法 | 反面 |
|:---|:---|:---|
| **留白为王** | 页面内容只占 60%，40% 是呼吸空间 | 信息塞满屏幕 |
| **色彩克制** | 黑白灰为主体，仅一个主色做点缀 | 彩虹配色、大面积渐变 |
| **动画有意义** | 每个动效都传递状态变化，不是装饰 | 无目的的炫技动画 |
| **层次清晰** | 用间距和字重区分层级，不用线条分隔 | 到处画分割线 |
| **触感反馈** | 点击有弹性，滑动有惯性，操作有呼应 | 硬切换、无反馈 |

---

## 二、配色方案

### 核心思路：黑白灰 + 一个点缀色

整个小程序 95% 的面积是黑白灰，只用一个主色做关键操作的高亮。

```
主色（唯一点缀色）
└── #3B82F6  (清爽蓝, 用于主按钮/关键操作/链接)

黑色系（文字 & 标题）
├── #000000  纯黑（大标题，极少使用）
├── #171717  主标题
├── #404040  正文
├── #737373  次要文字
└── #A3A3A3  占位符/禁用

灰色系（背景 & 边界）
├── #FAFAFA  页面背景
├── #FFFFFF  卡片/容器背景
├── #F5F5F5  输入框背景/次级背景
├── #E5E5E5  分割线（尽量少用）
└── #D4D4D4  边框（仅在必要时）

功能色（极少使用，仅在状态提示时出现）
├── #22C55E  成功
├── #EAB308  警告
└── #EF4444  错误
```

### CSS 变量定义（app.wxss）

```css
page {
  /* 主色 — 唯一点缀 */
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-primary-bg: rgba(59, 130, 246, 0.06);

  /* 文字 */
  --color-text-title: #171717;
  --color-text-body: #404040;
  --color-text-secondary: #737373;
  --color-text-placeholder: #A3A3A3;

  /* 背景 */
  --color-bg-page: #FAFAFA;
  --color-bg-white: #FFFFFF;
  --color-bg-input: #F5F5F5;
  --color-bg-hover: #F5F5F5;

  /* 边界 */
  --color-border: #E5E5E5;
  --color-divider: #F0F0F0;

  /* 功能色 */
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-error: #EF4444;

  /* 圆角 — 偏大，柔和感 */
  --radius-sm: 12rpx;
  --radius-md: 20rpx;
  --radius-lg: 28rpx;
  --radius-xl: 40rpx;
  --radius-full: 999rpx;

  /* 阴影 — 极淡，只做层次暗示 */
  --shadow-xs: 0 1rpx 4rpx rgba(0, 0, 0, 0.03);
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  --shadow-float: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);

  /* 间距 — 宽松呼吸 */
  --space-xs: 8rpx;
  --space-sm: 16rpx;
  --space-md: 24rpx;
  --space-lg: 40rpx;
  --space-xl: 64rpx;
  --space-2xl: 96rpx;

  /* 页面安全边距 */
  --page-padding: 40rpx;

  /* 字体 */
  --font-xs: 22rpx;
  --font-sm: 24rpx;
  --font-base: 28rpx;
  --font-md: 32rpx;
  --font-lg: 36rpx;
  --font-xl: 44rpx;
  --font-2xl: 56rpx;

  /* 动画 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

### TDesign 主题覆盖

```css
page {
  --td-brand-color: #3B82F6;
  --td-brand-color-light: rgba(59, 130, 246, 0.06);
  --td-warning-color: #EAB308;
  --td-error-color: #EF4444;
  --td-success-color: #22C55E;
  --td-radius-default: 20rpx;
  --td-radius-large: 28rpx;
  --td-font-size: 28rpx;
  --td-bg-color-page: #FAFAFA;
  --td-bg-color-container: #FFFFFF;
}
```

---

## 三、字体规范

### 原则：只用字号和字重区分层级，不加额外装饰

| 用途 | 字号 | 字重 | 颜色 | 示例 |
|:---|:---|:---|:---|:---|
| 页面大标题 | 56rpx | 700 | --color-text-title | "AI 工具箱" |
| 区块标题 | 36rpx | 600 | --color-text-title | "AI 图片工具" |
| 卡片标题 | 32rpx | 500 | --color-text-title | "证件照制作" |
| 正文内容 | 28rpx | 400 | --color-text-body | AI 生成的结果文字 |
| 辅助说明 | 24rpx | 400 | --color-text-secondary | "支持 JPG、PNG 格式" |
| 标签/角标 | 22rpx | 500 | --color-primary | "AI" |

### 行高

- 标题类：1.3
- 正文类：1.7（阅读舒适的关键）
- 辅助类：1.5

### 字体栈

```css
page {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
               "PingFang SC", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

---

## 四、首页设计

### 布局：大标题 + 搜索 + 分类列表

不用 Tab 切换，用垂直滚动的分类区块，更干净。

```
┌──────────────────────────────────┐
│  状态栏                           │
│                                   │
│  AI 工具箱                        │  ← 大标题，56rpx，左对齐
│                                   │     顶部大量留白
│  ┌──────────────────────────┐    │
│  │  🔍  搜索工具...          │    │  ← 圆角搜索框，#F5F5F5 背景
│  └──────────────────────────┘    │     无边框，内嵌感
│                                   │
│  AI 图片                          │  ← 区块标题，36rpx
│                                   │
│  ┌────────┐  ┌────────┐         │
│  │        │  │        │         │  ← 工具卡片，白底，极淡阴影
│  │  📷    │  │  📐    │         │     图标 + 标题 + 一句话描述
│  │ 证件照  │  │ 压缩   │         │
│  │ 一键换底色│ │ 极速无损 │        │
│  └────────┘  └────────┘         │
│                                   │
│  ┌────────┐  ┌────────┐         │
│  │        │  │        │         │
│  │  🎨    │  │  🖼     │         │
│  │ 风格化  │  │ 拼图   │         │
│  │ AI一键转换│ │ 多种模板 │        │
│  └────────┘  └────────┘         │
│                                   │  ← 区块间 64rpx 间距
│  AI 文字                          │
│                                   │
│  ┌────────┐  ┌────────┐         │
│  │  ✍️    │  │  ✨    │         │
│  │ 文案    │  │ 起名   │         │
│  │ 小红书爆款│ │ 寓意好名 │        │
│  └────────┘  └────────┘         │
│                                   │
│  实用工具                         │
│                                   │
│  ┌────────┐  ┌────────┐         │
│  │  #     │  │  ...   │         │
│  │ 字数    │  │ 更多   │         │
│  └────────┘  └────────┘         │
│                                   │
├──────────────────────────────────┤
│   🏠 首页             👤 我的     │  ← TabBar，极简无文字也可
└──────────────────────────────────┘
```

### 工具卡片样式

```css
.tool-card {
  display: flex;
  flex-direction: column;
  padding: 36rpx 28rpx;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-normal) var(--ease-spring),
              box-shadow var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

/* 点击弹性效果 — 按下缩小，松开弹回 */
.tool-card:active {
  transform: scale(0.96);
  box-shadow: var(--shadow-xs);
}

/* 工具图标 — 纯 emoji 或极简线性图标，无背景容器 */
.tool-card__icon {
  font-size: 52rpx;
  margin-bottom: 20rpx;
  transition: transform var(--duration-slow) var(--ease-spring);
}

/* 点击时图标微弹 */
.tool-card:active .tool-card__icon {
  transform: scale(1.15);
}

.tool-card__title {
  font-size: var(--font-md);
  font-weight: 500;
  color: var(--color-text-title);
  margin-bottom: 6rpx;
  line-height: 1.3;
}

.tool-card__desc {
  font-size: var(--font-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* AI 标签 — 小巧不抢眼 */
.tool-card__ai-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-bg);
  padding: 4rpx 14rpx;
  border-radius: var(--radius-full);
  letter-spacing: 2rpx;
}
```

### 宫格布局

```css
.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  padding: 0 var(--page-padding);
}

/* 区块标题 */
.section-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-title);
  padding: 0 var(--page-padding);
  margin-bottom: var(--space-md);
}
```

---

## 五、工具页通用布局

### 结构：大量留白 + 居中聚焦

```
┌──────────────────────────────────┐
│  ←                                │  ← 导航栏：透明背景，仅一个返回箭头
│                                   │     页面标题放在内容区而非导航栏
│                                   │
│  证件照制作                        │  ← 页面标题，44rpx，顶部留白
│  一键更换底色，支持多种证件尺寸       │  ← 副标题，24rpx，灰色
│                                   │
│  ┌──────────────────────────┐    │
│  │                          │    │  ← 操作预览区
│  │      [图片预览区域]        │    │     圆角 28rpx
│  │                          │    │     底色 #F5F5F5
│  │                          │    │
│  └──────────────────────────┘    │
│                                   │
│  底色                             │  ← 选项区
│  ○ 白   ○ 红   ○ 蓝   ○ 灰       │     用圆形色块选择
│                                   │     选中态加蓝色环
│  尺寸                             │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  ← 胶囊按钮组
│  │ 1 寸  │ │ 2 寸  │ │小 2 寸│     │     选中态填充主色
│  └──────┘ └──────┘ └──────┘     │
│                                   │
│                                   │  ← 底部留白
│  ┌──────────────────────────┐    │
│  │       保存到相册            │    │  ← 主按钮，黑色实心，纯净
│  └──────────────────────────┘    │
│                                   │
└──────────────────────────────────┘
```

### 主操作按钮

```css
/* 主按钮 — 纯黑，不用渐变，干净利落 */
.btn-primary {
  width: calc(100% - 80rpx);
  height: 100rpx;
  margin: 0 var(--page-padding);
  border-radius: var(--radius-xl);
  background: var(--color-text-title);
  color: #FFFFFF;
  font-size: var(--font-base);
  font-weight: 500;
  border: none;
  letter-spacing: 2rpx;
  transition: transform var(--duration-normal) var(--ease-spring),
              opacity var(--duration-fast) ease;
}

/* 按下弹性 */
.btn-primary:active {
  transform: scale(0.97);
  opacity: 0.85;
}

/* 禁用态 */
.btn-primary--disabled {
  opacity: 0.3;
  pointer-events: none;
}

/* 次要按钮 — 灰底 */
.btn-secondary {
  width: calc(100% - 80rpx);
  height: 100rpx;
  margin: 0 var(--page-padding);
  border-radius: var(--radius-xl);
  background: var(--color-bg-input);
  color: var(--color-text-body);
  font-size: var(--font-base);
  font-weight: 500;
  border: none;
  transition: transform var(--duration-normal) var(--ease-spring);
}

.btn-secondary:active {
  transform: scale(0.97);
  background: var(--color-bg-hover);
}
```

### 选项组样式

```css
/* 胶囊选项按钮组 */
.option-group {
  display: flex;
  gap: 16rpx;
  padding: 0 var(--page-padding);
}

.option-item {
  padding: 16rpx 36rpx;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-input);
  transition: all var(--duration-normal) var(--ease-out);
}

/* 选中态 — 黑底白字 */
.option-item--active {
  color: #FFFFFF;
  background: var(--color-text-title);
}

/* 颜色选择器 — 圆形色块 */
.color-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid transparent;
  transition: all var(--duration-normal) var(--ease-spring);
}

.color-dot--active {
  border-color: var(--color-primary);
  transform: scale(1.15);
  box-shadow: 0 0 0 4rpx var(--color-primary-bg);
}
```

---

## 六、动画系统（灵魂所在）

### 设计哲学

> 好的动画不是让人"哇好炫"，而是让人感觉"一切都恰到好处"。
> 像呼吸一样自然，像水一样流动。

### 四条铁律

1. **物理感**：一切运动遵循现实世界的惯性和弹性，没有匀速直线运动
2. **可中断**：动画进行中可以被新操作打断，不会卡住等完
3. **有节奏**：快的地方果断（点击反馈 100ms），慢的地方从容（页面过渡 500ms）
4. **60fps**：只用 `transform` + `opacity`，不触发布局重排

### 技术方案选择

微信小程序提供四种动画方案，按场景选用：

| 方案 | 性能 | 场景 | 本项目使用场景 |
|:---|:---|:---|:---|
| **关键帧 `animate` API** | 极高 | 复杂多步动画 | 页面转场、结果弹入、成功动画 |
| **WXS 响应式动画** | 最高 | 手势跟随、滚动驱动 | 下拉刷新、滑动操作 |
| **CSS animation/transition** | 高 | 简单状态变化 | 按钮反馈、hover、AI光标 |
| ~~wx.createAnimation~~ | 低 | ~~不推荐~~ | ~~不使用~~ |

### 缓动曲线体系

五条曲线覆盖所有场景，每条都有明确的"性格"：

```css
page {
  /*
   * 曲线 1：柔出（Gentle Out）
   * 性格：快速启动 → 缓缓停下，像滑冰刹车
   * 场景：页面进入、元素出现、面板展开
   */
  --ease-gentle: cubic-bezier(0.22, 1, 0.36, 1);

  /*
   * 曲线 2：弹性（Bouncy）
   * 性格：冲过终点再弹回来，像果冻被戳了一下
   * 场景：按钮点击、卡片按压、选中态切换
   */
  --ease-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);

  /*
   * 曲线 3：敏捷（Snappy）
   * 性格：极速到达、干脆利落、没有拖泥带水
   * 场景：点击反馈、Toast 弹出、即时状态变化
   */
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  /*
   * 曲线 4：呼吸（Breath）
   * 性格：慢进慢出，像深呼吸一样均匀
   * 场景：循环动画（光标闪烁、加载指示、脉冲）
   */
  --ease-breath: cubic-bezier(0.4, 0, 0.6, 1);

  /*
   * 曲线 5：强调（Emphasis）
   * 性格：先稍微往回蓄力，再弹射出去
   * 场景：重要结果出现、成功/完成的庆祝动画
   */
  --ease-emphasis: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

---

### 动效详解

#### 1. 触控反馈 — 果冻按压

**感觉**：像按在一块软橡皮上——按下去会缩小，松手后弹回来还会微微超过原始大小再稳定。这种弹性让界面有"活"的感觉。

```css
.pressable {
  transition: transform 500ms var(--ease-bouncy);
  will-change: transform;
}

.pressable:active {
  transform: scale(0.94);
  transition-duration: 120ms;
  transition-timing-function: var(--ease-snappy);
}
```

**关键细节**：

- 按下去是 **120ms**（快速响应，不能有延迟感）
- 弹回来是 **500ms**（慢慢弹回，有余韵）
- 按下用 `ease-snappy`（果断），弹回用 `ease-bouncy`（柔软）
- `scale(0.94)` 而不是 0.96 — 缩放幅度大一点，手感更明显

**WXS 增强版**（更丝滑的触摸跟随）：

```javascript
// touch-feedback.wxs — 在渲染层直接处理，零延迟
var SCALE_DOWN = 'transform: scale(0.94);transition: transform 120ms cubic-bezier(0.2, 0, 0, 1);'
var SCALE_UP = 'transform: scale(1);transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);'
var SCALE_NONE = ''

module.exports = {
  onTouchStart: function (e, ins) {
    ins.selectComponent('.pressable').setStyle(SCALE_DOWN)
    return false
  },
  onTouchEnd: function (e, ins) {
    ins.selectComponent('.pressable').setStyle(SCALE_UP)
    return false
  },
  onTouchCancel: function (e, ins) {
    ins.selectComponent('.pressable').setStyle(SCALE_UP)
    return false
  }
}
```

WXML 使用：

```html
<wxs src="./touch-feedback.wxs" module="touch" />
<view
  class="tool-card pressable"
  bind:touchstart="{{touch.onTouchStart}}"
  bind:touchend="{{touch.onTouchEnd}}"
  bind:touchcancel="{{touch.onTouchCancel}}"
>
  ...
</view>
```

---

#### 2. 页面进入 — 丝绸上浮

**感觉**：打开一个工具页，内容像被一阵轻风托起来一样，从下方柔和地升起并渐显。不是生硬地"弹出"，而是"浮现"。

**使用关键帧 `animate` API 实现**（性能远高于 CSS animation）：

```javascript
// 在 page 的 onReady 中调用
onReady() {
  this.animate('.page-content', [
    { opacity: 0, translateY: 40, ease: 'ease-out' },
    { opacity: 1, translateY: 0 }
  ], 600, () => {
    // 动画完成的回调
  })
}
```

**分层入场**（标题和内容分开动，有先后次序）：

```javascript
onReady() {
  // 标题先出来（快）
  this.animate('.page-title', [
    { opacity: 0, translateY: 24 },
    { opacity: 1, translateY: 0 }
  ], 450)

  // 副标题慢 80ms
  this.animate('.page-subtitle', [
    { opacity: 0, translateY: 24 },
    { opacity: 1, translateY: 0 }
  ], 450, {
    delay: 80
  })

  // 主内容区慢 160ms
  this.animate('.page-body', [
    { opacity: 0, translateY: 32 },
    { opacity: 1, translateY: 0 }
  ], 500, {
    delay: 160
  })

  // 底部按钮最后出来
  this.animate('.page-footer', [
    { opacity: 0, translateY: 20 },
    { opacity: 1, translateY: 0 }
  ], 400, {
    delay: 280
  })
}
```

**效果**：标题 → 副标题 → 内容 → 按钮，像瀑布一样从上到下依次浮现，间隔 80ms，整体流畅不拖沓。

---

#### 3. 首页卡片交错入场 — 涟漪铺开

**感觉**：首页加载时，工具卡片不是一下子全部出现，而是像往水面扔石子产生的涟漪，从第一张开始依次铺开。每张卡片同时有"上浮 + 淡入 + 微缩放"三重变化，组合起来非常柔和。

```css
.tool-card {
  opacity: 0;
  transform: translateY(24rpx) scale(0.97);
}

.tool-card--visible {
  animation: cardRippleIn 500ms var(--ease-gentle) both;
}

@keyframes cardRippleIn {
  from {
    opacity: 0;
    transform: translateY(24rpx) scale(0.97);
  }
  60% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

JS 侧 — 使用 `IntersectionObserver` 只在可视区域内播放：

```javascript
onReady() {
  const observer = this.createIntersectionObserver({ observeAll: true })
  observer.relativeToViewport({ bottom: 0 })
    .observe('.tool-card', (res) => {
      if (res.intersectionRatio > 0) {
        const dataset = res.dataset
        this.setData({
          [`tools[${dataset.index}].visible`]: true
        })
      }
    })
}
```

WXML：

```html
<view
  wx:for="{{tools}}"
  wx:key="id"
  class="tool-card {{item.visible ? 'tool-card--visible' : ''}}"
  data-index="{{index}}"
  style="animation-delay: {{index * 80}}ms;"
>
  ...
</view>
```

**关键细节**：

- 间隔 **80ms**（比 60ms 稍慢，更从容）
- 三重变化：上浮 24rpx + 淡入 + 缩放 0.97→1.0
- opacity 在 60% 时就已经完全显现，后面 40% 时间只做位移和缩放的微调
- 使用 `IntersectionObserver`，只有进入视野的卡片才播放动画（滚动下方卡片也有动效）

---

#### 4. AI 思考中 — 水波呼吸

**感觉**：AI 正在处理时，不是干巴巴的"加载中..."文字，而是三个小圆点像水面上的波纹一样此起彼伏，有一种安静的"正在酝酿"的感觉。

```css
.thinking {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 32rpx 0;
}

.thinking__dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--color-text-placeholder);
  animation: waveFloat 1.6s var(--ease-breath) infinite;
}

.thinking__dot:nth-child(1) { animation-delay: 0s; }
.thinking__dot:nth-child(2) { animation-delay: 0.2s; }
.thinking__dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes waveFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.35;
  }
  40% {
    transform: translateY(-14rpx) scale(1.2);
    opacity: 1;
  }
}
```

**关键细节**：

- 不只是上下移动，同时有 **scale(1.2)** 的膨胀感
- opacity 从 0.35 到 1.0 的变化让点有"亮起来"的呼吸感
- 间隔 **0.2s** 形成波浪传递感
- 1.6s 周期不快不慢，不焦虑也不呆滞

---

#### 5. AI 文字输出 — 墨水渗透

**感觉**：AI 生成文字时，不是硬邦邦地一个字一个字蹦出来，而是像墨水渗透纸面——每个字从半透明逐渐变实，伴随微微的上浮，末尾有柔和的光标呼吸。

```css
/* 每个新出现的字符 */
.char-enter {
  display: inline;
  animation: inkSoak 300ms var(--ease-gentle) both;
}

@keyframes inkSoak {
  from {
    opacity: 0;
    transform: translateY(4rpx);
    filter: blur(2rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* 光标 — 柔和的脉搏而非生硬闪烁 */
.typing-cursor {
  display: inline-block;
  width: 3rpx;
  height: 36rpx;
  background: var(--color-text-title);
  margin-left: 4rpx;
  vertical-align: middle;
  border-radius: 2rpx;
  animation: cursorPulse 1.2s var(--ease-breath) infinite;
}

@keyframes cursorPulse {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.2; transform: scaleY(0.85); }
}
```

JS 侧实现逐字渲染：

```javascript
async renderStream(textStream) {
  let fullText = ''
  this.setData({ isGenerating: true })

  for await (const chunk of textStream) {
    fullText += chunk
    this.setData({
      resultText: fullText,
      newCharsCount: chunk.length
    })
    await this.sleep(30)
  }

  this.setData({ isGenerating: false })
},

sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

**关键细节**：

- 每个字符有 **blur(2rpx) → blur(0)** 的去模糊效果，像墨水从模糊变清晰
- 光标不是简单的 opacity 闪烁，而是同时有 **scaleY** 的伸缩，像在"呼吸"
- 光标 opacity 最低到 0.2 而非 0 — 不完全消失，更柔和
- `sleep(30)` 控制字符出现节奏，30ms 一个字符最舒服

---

#### 6. 结果出现 — 弹性浮现

**感觉**：处理完成，结果卡片从虚无中凝聚出来——先是轻微放大超过目标尺寸，再柔和地缩回正常大小。像气泡浮出水面的瞬间。

**使用关键帧 `animate` API**：

```javascript
showResult() {
  // 背景蒙层淡入
  this.animate('.result-overlay', [
    { opacity: 0 },
    { opacity: 1 }
  ], 300)

  // 结果卡片 — 弹性浮现
  this.animate('.result-card', [
    { opacity: 0, scale: [0.88, 0.88], translateY: 20 },
    { opacity: 1, scale: [1.02, 1.02], translateY: -4, offset: 0.7 },
    { opacity: 1, scale: [1, 1], translateY: 0 }
  ], 550)
}
```

CSS 备选方案：

```css
.result-card--enter {
  animation: elasticPop 550ms var(--ease-emphasis) both;
}

@keyframes elasticPop {
  0% {
    opacity: 0;
    transform: scale(0.88) translateY(20rpx);
  }
  70% {
    opacity: 1;
    transform: scale(1.02) translateY(-4rpx);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**关键细节**：

- 三阶段：0.88 → **1.02**（微微超过）→ 1.0（回正）
- 70% 的时候就已经超调到 1.02，后面 30% 时间用来优雅地回弹
- translateY 也有对应的超调：先上浮超过 4rpx 再回到 0
- 总时长 **550ms**，比快速弹入多 200ms 的从容感

---

#### 7. 成功完成 — 对勾绽放

**感觉**：操作成功的瞬间，一个圆环从无到有画出来，紧接着一个对勾像花朵一样从中心绽开。搭配轻微的缩放脉冲，给人"完成了！"的满足感。

WXML：

```html
<view class="success-anim" wx:if="{{showSuccess}}">
  <canvas type="2d" id="success-canvas" class="success-canvas" />
</view>
```

JS（使用 Canvas 2D 绘制，动效更丝滑）：

```javascript
playSuccessAnimation() {
  const query = wx.createSelectorQuery()
  query.select('#success-canvas').fields({ node: true, size: true }).exec((res) => {
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const w = res[0].width
    const h = res[0].height
    const cx = w / 2, cy = h / 2, r = w * 0.36

    canvas.width = w * 2
    canvas.height = h * 2
    ctx.scale(2, 2)

    let progress = 0
    const circleEnd = 0.55
    const checkStart = 0.4
    const checkEnd = 1.0
    const totalDuration = 900

    const startTime = Date.now()
    const draw = () => {
      const elapsed = Date.now() - startTime
      progress = Math.min(elapsed / totalDuration, 1)

      ctx.clearRect(0, 0, w, h)

      // 圆环
      if (progress <= circleEnd) {
        const circleP = this.easeOutCubic(progress / circleEnd)
        ctx.beginPath()
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * circleP)
        ctx.strokeStyle = '#22C55E'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = '#22C55E'
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // 对勾
      if (progress >= checkStart) {
        const checkP = this.easeOutBack(
          Math.min((progress - checkStart) / (checkEnd - checkStart), 1)
        )
        const points = [
          { x: cx - r * 0.32, y: cy + r * 0.05 },
          { x: cx - r * 0.05, y: cy + r * 0.32 },
          { x: cx + r * 0.35, y: cy - r * 0.25 }
        ]
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        if (checkP <= 0.5) {
          const segP = checkP / 0.5
          ctx.lineTo(
            points[0].x + (points[1].x - points[0].x) * segP,
            points[0].y + (points[1].y - points[0].y) * segP
          )
        } else {
          ctx.lineTo(points[1].x, points[1].y)
          const segP = (checkP - 0.5) / 0.5
          ctx.lineTo(
            points[1].x + (points[2].x - points[1].x) * segP,
            points[1].y + (points[2].y - points[1].y) * segP
          )
        }
        ctx.strokeStyle = '#22C55E'
        ctx.lineWidth = 3.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      if (progress < 1) {
        canvas.requestAnimationFrame(draw)
      }
    }
    canvas.requestAnimationFrame(draw)
  })
},

easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) },
easeOutBack(t) { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) }
```

**关键细节**：

- 使用 **Canvas requestAnimationFrame** 绘制，比 CSS 动画更精确
- 圆环和对勾有**重叠时间**（圆环画到 40% 时对勾就开始了），衔接更自然
- 对勾使用 **easeOutBack** 缓动（先超调再回弹），有"甩出去"的力度感
- 总时长 **900ms**，给人充分的"满足一刻"

---

#### 8. 图片处理进度 — 水位上升

**感觉**：不用常见的环形进度条，而是一个圆形容器内"水位"从底部慢慢上升，搭配轻微的水波纹。更有"填充感"，让等待不那么焦虑。

```css
.water-progress {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: var(--color-bg-input);
  position: relative;
  overflow: hidden;
}

/* 水位 — 从底部上升 */
.water-progress__fill {
  position: absolute;
  bottom: 0;
  left: -10%;
  width: 120%;
  background: var(--color-primary);
  opacity: 0.15;
  border-radius: 45% 48% 0 0;
  transition: height 600ms var(--ease-gentle);
  animation: waveMotion 2.5s var(--ease-breath) infinite;
}

/* 波浪晃动 */
@keyframes waveMotion {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(6rpx) rotate(1deg); }
  50% { transform: translateX(-4rpx) rotate(-0.5deg); }
  75% { transform: translateX(2rpx) rotate(0.5deg); }
}

/* 第二层波浪（错开相位，更自然） */
.water-progress__fill--second {
  opacity: 0.08;
  border-radius: 48% 44% 0 0;
  animation-delay: -1.2s;
  animation-duration: 3s;
}

.water-progress__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--color-text-title);
  z-index: 1;
}
```

WXML：

```html
<view class="water-progress">
  <view
    class="water-progress__fill"
    style="height: {{progress}}%;"
  />
  <view
    class="water-progress__fill water-progress__fill--second"
    style="height: {{progress}}%;"
  />
  <text class="water-progress__text">{{progress}}%</text>
</view>
```

**关键细节**：

- 双层波浪（错开 1.2s 相位），避免单调
- 波浪用 `translateX` + `rotate` 的微小变化，不是大幅摇晃
- `opacity: 0.15` 极淡的蓝色，保持极简基调
- 水位高度用 **600ms ease-gentle** 过渡，涨水过程丝滑

---

#### 9. 选项切换 — 胶囊滑移

**感觉**：切换选项（如底色选择、尺寸选择）时，选中态的背景色块像果冻一样滑到新位置，而不是瞬间跳转。

```css
.option-group {
  display: flex;
  gap: 16rpx;
  padding: 0 var(--page-padding);
  position: relative;
}

.option-group__indicator {
  position: absolute;
  height: 100%;
  background: var(--color-text-title);
  border-radius: var(--radius-full);
  transition: left 400ms var(--ease-bouncy),
              width 400ms var(--ease-bouncy);
  z-index: 0;
}

.option-item {
  position: relative;
  z-index: 1;
  padding: 16rpx 36rpx;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 250ms var(--ease-gentle);
}

.option-item--active {
  color: #FFFFFF;
}
```

JS 侧计算滑块位置：

```javascript
switchOption(e) {
  const index = e.currentTarget.dataset.index
  const query = wx.createSelectorQuery()
  query.selectAll('.option-item').boundingClientRect()
  query.exec((res) => {
    const items = res[0]
    const target = items[index]
    this.setData({
      activeIndex: index,
      indicatorLeft: target.left - items[0].left,
      indicatorWidth: target.width
    })
  })
}
```

**关键细节**：

- 背景色块用 **ease-bouncy** 曲线滑过去，到达时有微弹
- `left` 和 `width` 同时过渡（适应不同文字宽度的选项）
- 文字颜色用 **ease-gentle** 单独过渡，比背景慢一点，形成层次

---

#### 10. 搜索框聚焦 — 轻盈浮起

**感觉**：点击搜索框时，它像被轻轻托起——背景变白、出现极淡阴影、搜索图标缩小并变色。整个过程像吸了一口气。

```css
.search-bar {
  margin: 0 var(--page-padding) var(--space-lg);
  height: 84rpx;
  border-radius: var(--radius-full);
  background: var(--color-bg-input);
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  transition: background 350ms var(--ease-gentle),
              box-shadow 350ms var(--ease-gentle),
              transform 350ms var(--ease-bouncy);
}

.search-bar--focus {
  background: var(--color-bg-white);
  box-shadow: var(--shadow-md);
  transform: translateY(-2rpx);
}

.search-bar__icon {
  font-size: 32rpx;
  color: var(--color-text-placeholder);
  margin-right: 16rpx;
  transition: color 300ms var(--ease-gentle),
              transform 300ms var(--ease-bouncy);
}

.search-bar--focus .search-bar__icon {
  color: var(--color-primary);
  transform: scale(0.9);
}
```

**关键细节**：

- `translateY(-2rpx)` 轻微上浮，配合阴影产生"浮起"的空间感
- 图标 `scale(0.9)` + 变色 — 微妙但可感知的状态变化
- 三个属性用**不同缓动**：背景用 gentle（平滑），位移用 bouncy（弹性）

---

### 动效完整速查表

| 场景 | 动画描述 | 时长 | 缓动 | 实现方式 |
|:---|:---|:---|:---|:---|
| 触控反馈 | scale 0.94 → 弹回 1.0 | 按下 120ms / 弹回 500ms | snappy / bouncy | WXS 触摸事件 |
| 页面进入 | 分层上浮淡入 | 450~500ms，间隔 80ms | gentle | animate API |
| 卡片入场 | 上浮 + 淡入 + 微缩放 | 500ms，间隔 80ms | gentle | CSS + Observer |
| AI 思考 | 三点水波呼吸 | 1600ms 循环 | breath | CSS animation |
| AI 输出 | 墨水渗透 + 光标脉搏 | 每字 300ms / 光标 1200ms | gentle / breath | JS + CSS |
| 结果浮现 | 弹性缩放 0.88→1.02→1.0 | 550ms | emphasis | animate API |
| 成功对勾 | Canvas 绘制圆环+对勾 | 900ms | easeOutBack | Canvas rAF |
| 处理进度 | 双层水波上升 | 600ms 高度过渡 | gentle | CSS transition |
| 选项切换 | 胶囊背景滑移 | 400ms | bouncy | CSS transition |
| 搜索聚焦 | 上浮 + 变白 + 阴影 | 350ms | gentle + bouncy | CSS transition |

### 性能保障

- 所有动画**只修改 `transform` 和 `opacity`**，不触发布局重排
- 触控反馈使用 **WXS 脚本**在渲染层直接处理，绕过逻辑层通信延迟
- 复杂序列动画使用 **`animate` 关键帧 API**，性能比 CSS animation 高 100 倍
- 成功动画使用 **Canvas requestAnimationFrame**，帧率稳定 60fps
- 列表动画使用 **IntersectionObserver**，只在可视区域内触发

---

## 七、图标方案

### 风格：用 Emoji 做图标

极简方案：直接用 Emoji 做工具图标，零资源开销，天然跨平台一致。

| 工具 | Emoji | 备选（TDesign Icon） |
|:---|:---|:---|
| AI 证件照 | 📷 | camera |
| 图片压缩 | 📐 | file-image |
| 图片拼图 | 🖼 | dashboard |
| AI 风格化 | 🎨 | palette |
| AI 文案 | ✍️ | edit |
| AI 起名 | ✨ | star |
| AI 润色 | 💎 | gem（自定义） |
| 字数统计 | #️⃣ | numbers |
| 二维码 | 📱 | qrcode |

如果后期觉得 Emoji 不够精致，可以换成统一的 SVG 线性图标集（如 Lucide Icons），但 MVP 阶段 Emoji 足够。

---

## 八、间距与留白

### 核心数值

```
页面左右边距:      40rpx （比常规 32rpx 更宽松）
页面顶部留白:      48rpx （给大标题呼吸空间）
区块间距:          64rpx （区块之间要有明显断开感）
区块标题到卡片:    24rpx
卡片间距:          24rpx
卡片内边距:        36rpx 28rpx
输入框内边距:      28rpx 32rpx
按钮高度:          100rpx
搜索框高度:        80rpx
```

### 留白检查

设计完成后用这个标准自查：

- [ ] 页面顶部标题上方有 ≥ 48rpx 的留白
- [ ] 每个区块之间有 ≥ 64rpx 的间距
- [ ] 卡片内容不贴边，四周均匀留白
- [ ] 按钮距离页面底部有足够安全距离
- [ ] 没有两个元素"紧贴在一起"的情况

---

## 九、搜索框样式

```css
.search-bar {
  margin: 0 var(--page-padding) var(--space-lg);
  height: 80rpx;
  border-radius: var(--radius-full);
  background: var(--color-bg-input);
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  transition: box-shadow var(--duration-normal) var(--ease-out),
              background var(--duration-normal) var(--ease-out);
}

/* 聚焦时浮起 */
.search-bar--focus {
  background: var(--color-bg-white);
  box-shadow: var(--shadow-md);
}

.search-bar__icon {
  font-size: 32rpx;
  color: var(--color-text-placeholder);
  margin-right: 16rpx;
}

.search-bar__input {
  flex: 1;
  font-size: var(--font-base);
  color: var(--color-text-title);
}
```

---

## 十、深色模式（v2.0 预留）

```css
@media (prefers-color-scheme: dark) {
  page {
    --color-text-title: #F5F5F5;
    --color-text-body: #D4D4D4;
    --color-text-secondary: #A3A3A3;
    --color-text-placeholder: #737373;
    --color-bg-page: #0A0A0A;
    --color-bg-white: #171717;
    --color-bg-input: #262626;
    --color-bg-hover: #262626;
    --color-border: #404040;
    --color-divider: #262626;
    --shadow-xs: none;
    --shadow-sm: none;
    --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  }
}
```

---

## 十一、设计检查清单

- [ ] 页面 95% 面积是黑白灰，彩色只出现在主按钮和关键状态
- [ ] 没有渐变色大面积铺在背景上
- [ ] 没有不必要的分割线（用间距替代）
- [ ] 所有可点击元素有弹性缩放反馈
- [ ] 页面进入有上浮淡入动画
- [ ] AI 输出有打字机效果 + 光标闪烁
- [ ] 列表/卡片有交错入场动画
- [ ] 所有动画时长在 150ms ~ 400ms 之间
- [ ] 留白充足，没有"拥挤感"
- [ ] 文字层级清晰，只用字号 + 字重 + 颜色区分
