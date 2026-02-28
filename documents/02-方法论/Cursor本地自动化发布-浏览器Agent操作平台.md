# Cursor 本地自动化发布：浏览器 Agent 操作平台

> 基于 Cursor IDE + MCP 浏览器自动化实现多平台内容自动发布，无需 VNC/Docker/OpenClaw。

---

## 目录

1. [背景与动机](#1-背景与动机)
2. [核心技术栈](#2-核心技术栈)
3. [架构设计](#3-架构设计)
4. [浏览器操作层详解](#4-浏览器操作层详解)
5. [两种浏览器技术对比](#5-两种浏览器技术对比)
6. [完整操作流程](#6-完整操作流程)
7. [平台 SOP 模板](#7-平台-sop-模板)
8. [定时调度方案](#8-定时调度方案)
9. [登录态维护](#9-登录态维护)
10. [与 OpenClaw 方案对比](#10-与-openclaw-方案对比)
11. [成本估算](#11-成本估算)
12. [常见问题与踩坑](#12-常见问题与踩坑)
13. [下一步扩展方向](#13-下一步扩展方向)

---

## 1. 背景与动机

### 问题

个人 IP 运营需要同时覆盖十几个内容平台（知乎、小红书、公众号、B站、掘金、Twitter 等），传统方式每天至少 4-5 小时，光在各平台之间切换就耗费大量精力。

### 行业方案

OpenClaw 多 Agent 架构 + VNC 远程浏览器 + CDP（Chrome DevTools Protocol），在服务器上运行 16 个 AI Agent 管理 13 个平台。每月成本约 190 美元。

### 本方案

利用 Cursor IDE 自带的浏览器 MCP 能力，**在本地零成本实现等效的自动化发布**，无需额外搭建 VNC、Docker 或购买云服务器。

核心洞察：**Cursor 的 `cursor-ide-browser` MCP 本质上就是 Playwright 驱动的浏览器自动化，与 VNC + CDP 做的是同一件事，但更轻量。**

---

## 2. 核心技术栈

| 组件 | 技术 | 角色 |
|:---|:---|:---|
| 浏览器操作 | `cursor-ide-browser` MCP（Playwright） | 导航、点击、填写、截图 |
| 内容生成 | Cursor Agent（Claude/GPT） | 根据选题生成平台适配内容 |
| 消息通知 | `user-lark-mcp`（飞书 MCP） | 任务结果通知、数据同步 |
| 定时调度 | Windows 任务计划程序 / cron | 定时触发采集/发布任务 |
| 数据存储 | 本地 Markdown 文件 | 任务队列、操作日志、数据记录 |

---

## 3. 架构设计

```
┌──────────────────────────────────────────────────────────┐
│                    Cursor IDE（本地）                      │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  第一层：浏览器操作层（核心能力）                       │ │
│  │                                                     │ │
│  │  cursor-ide-browser MCP                             │ │
│  │  ├── browser_navigate  → 打开平台页面                │ │
│  │  ├── browser_snapshot  → 获取页面结构（DOM树）        │ │
│  │  ├── browser_fill      → 填写内容/表单               │ │
│  │  ├── browser_click     → 点击按钮                    │ │
│  │  ├── browser_type      → 模拟键盘输入                │ │
│  │  └── browser_take_screenshot → 截图确认              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  第二层：内容生成层                                    │ │
│  │                                                     │ │
│  │  Cursor Agent（Claude/GPT）                          │ │
│  │  ├── 根据选题生成内容                                 │ │
│  │  ├── 按平台规范适配格式                               │ │
│  │  └── 调用飞书 MCP 同步数据                            │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  第三层：调度层                                        │ │
│  │                                                     │ │
│  │  Python 脚本 + Windows 任务计划程序                    │ │
│  │  ├── 定时触发采集/发布任务                             │ │
│  │  ├── 任务状态记录到本地文件                            │ │
│  │  └── 飞书/微信通知结果                                │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 4. 浏览器操作层详解

### 4.1 cursor-ide-browser MCP 工具清单

| 工具 | 功能 | 自动化发布中的用途 |
|:---|:---|:---|
| `browser_navigate` | 导航到 URL | 打开平台页面 |
| `browser_snapshot` | 获取页面可访问性树 | 理解页面结构，找到按钮/输入框 |
| `browser_click` | 点击元素 | 点击"写回答"、"发布"等按钮 |
| `browser_fill` | 清空并填入内容 | 在编辑器中填入文章内容 |
| `browser_type` | 追加输入文本 | 在搜索框等输入关键词 |
| `browser_take_screenshot` | 截图 | 确认操作结果 |
| `browser_tabs` | 管理标签页 | 多平台并行操作 |
| `browser_lock` / `browser_unlock` | 锁定/解锁浏览器 | Agent 操作时防止人工误操 |
| `browser_scroll` | 滚动页面 | 长页面内容浏览 |
| `browser_wait_for` | 等待元素出现 | 页面加载完成后再操作 |

### 4.2 操作流程模式

```
browser_navigate → browser_snapshot → browser_click → browser_fill → browser_click → browser_take_screenshot
     打开页面         理解结构           点击按钮         填入内容          点击发布           截图确认
```

关键点：`browser_snapshot` 返回的是 **accessibility tree**（可访问性树），不是截图。它比 CSS 选择器稳定得多——即使平台改版了布局，只要按钮文字还在，就能找到。

### 4.3 Lock/Unlock 工作流

```
1. browser_navigate → 打开目标页面（此时浏览器未锁定，你可以手动操作）
2. browser_lock → 锁定浏览器（Agent 接管控制权）
3. browser_snapshot → 获取页面结构
4. browser_click / browser_fill → 执行操作
5. browser_take_screenshot → 确认结果
6. browser_unlock → 解锁浏览器（还你控制权）
```

---

## 5. 两种浏览器技术对比

Cursor 环境中有两种浏览器操作方式，适用于不同场景：

| 特性 | Task browser-use（子 Agent） | cursor-ide-browser MCP |
|:---|:---|:---|
| 底层 | Playwright（独立实例） | Playwright（IDE 内嵌浏览器） |
| 可见性 | 后台运行，看不到 | IDE 里实时可见 |
| 控制方式 | 子 Agent 自主决策 | 逐步调用 MCP 工具 |
| 登录态 | 独立 Cookie，不共享登录 | 共享 IDE 浏览器 Cookie |
| 适用场景 | 一次性抓取、信息收集 | 需要登录态的平台操作 |
| 交互性 | 无（执行完返回结果） | 有（lock/unlock 切换控制） |

**选择原则**：

- 公开内容抓取（如微信公众号文章）→ Task browser-use
- 需要登录的平台操作（如知乎发布、小红书发布）→ cursor-ide-browser MCP

---

## 6. 完整操作流程

### 6.1 已验证的知乎发布流程

以下流程已在实际环境中完整走通：

| 步骤 | 操作 | MCP 工具 |
|:---|:---|:---|
| 1. 打开知乎 | `browser_navigate` → zhihu.com | browser_navigate |
| 2. 检查登录态 | `browser_snapshot` → 检查是否有"登录"按钮 | browser_snapshot |
| 3. 热榜选题 | `browser_navigate` → /hot → 扫描 AI 相关话题 | browser_navigate + snapshot |
| 4. 打开问题页 | 点击热榜链接 → 新标签页打开 | browser_click |
| 5. 点击写回答 | `browser_click` → "写回答"按钮 | browser_click |
| 6. 填入内容 | `browser_fill` → 编辑器文本框 | browser_fill |
| 7. 确认发布 | 人工确认 → `browser_click` → "发布回答" | browser_click |

### 6.2 三种工作模式

**模式 A：手动触发（推荐起步）**

```
你："帮我把这篇文章发到知乎"
Agent：
  1. 读取文章内容
  2. 读取 platform-sops/zhihu-publish.md 了解操作步骤
  3. 调用 cursor-ide-browser MCP 执行
  4. 结果写入 logs/
  5. 通过飞书 MCP 通知你
```

**模式 B：批量发布**

```
你："把今天的文章分发到知乎、小红书、公众号"
Agent：
  1. 读取文章
  2. 为每个平台适配格式
  3. 依次打开各平台新标签页（browser_navigate + newTab: true）
  4. 按 SOP 逐个发布
  5. 汇总结果到日志
```

**模式 C：定时自动化（进阶）**

```
Python 脚本 + Windows 任务计划程序
  1. 定时触发数据采集脚本
  2. 脚本调用 Playwright 直接操作浏览器
  3. 采集数据写入本地文件
  4. 通过飞书 API 推送日报
```

---

## 7. 平台 SOP 模板

### 推荐目录结构

```
workflow/auto-publish/
├── README.md                    # 使用说明
├── tasks/
│   ├── pending/                 # 待发布任务
│   │   └── 2026-02-28-知乎-AI编程.md
│   ├── published/               # 已发布
│   └── failed/                  # 发布失败
├── templates/
│   ├── zhihu.md                 # 知乎内容模板
│   ├── xiaohongshu.md           # 小红书内容模板
│   └── weixin.md                # 公众号内容模板
├── platform-sops/
│   ├── zhihu-publish.md         # 知乎发布 SOP（给 Agent 看）
│   ├── xiaohongshu-publish.md   # 小红书发布 SOP
│   └── weixin-publish.md        # 公众号发布 SOP
└── logs/
    └── 2026-02-28.md            # 当日操作日志
```

### 知乎发布 SOP 示例

```markdown
# 知乎发布 SOP

## 前置检查
1. browser_navigate 到 zhihu.com
2. browser_snapshot 检查是否存在"写文章"或用户头像
3. 如果看到"登录"按钮 → 停止，通知用户手动登录

## 发布回答
1. browser_navigate 到目标问题 URL
2. browser_snapshot 获取页面结构
3. 找到"写回答"按钮 → browser_click
4. 等待 2 秒 → browser_snapshot 确认编辑器加载
5. 在编辑器中 browser_fill 填入内容
6. browser_snapshot 找到"发布回答"按钮
7. 等待人工确认 → browser_click 点击发布
8. 等待 3 秒 → browser_take_screenshot 确认

## 数据采集
1. browser_navigate 到创作者中心
2. browser_snapshot 提取关键指标
3. 写入 logs/YYYY-MM-DD.md
```

---

## 8. 定时调度方案

### Windows 任务计划程序

```powershell
# 创建定时任务：每天早上 8:00 触发数据采集
$action = New-ScheduledTaskAction `
    -Execute "python" `
    -Argument "E:\vibe-coding-cn\workflow\auto-publish\scripts\collect_data.py"

$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM

Register-ScheduledTask `
    -TaskName "AI-Platform-DataCollect" `
    -Action $action `
    -Trigger $trigger `
    -Description "每日平台数据采集"
```

### Python 数据采集脚本框架

```python
"""
auto_collect.py - 定时数据采集入口
通过 Playwright 直接操作浏览器，不依赖 Cursor IDE
"""
from playwright.sync_api import sync_playwright
from datetime import datetime
import json

PLATFORMS = {
    "zhihu": {
        "url": "https://www.zhihu.com/creator",
        "selectors": {
            "views": ".data-item:nth-child(1) .data-value",
            "likes": ".data-item:nth-child(2) .data-value",
        }
    },
    # 更多平台...
}

def collect_platform_data():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir="./chrome_profile",
            headless=False,
        )
        page = browser.new_page()
        for name, config in PLATFORMS.items():
            page.goto(config["url"])
            page.wait_for_load_state("networkidle")
            data = {}
            for key, selector in config["selectors"].items():
                try:
                    data[key] = page.text_content(selector)
                except Exception:
                    data[key] = "N/A"
            results[name] = data
        browser.close()
    return results

def save_daily_report(results):
    today = datetime.now().strftime("%Y-%m-%d")
    report = f"# 平台数据日报 {today}\n\n"
    for platform, data in results.items():
        report += f"## {platform}\n"
        for k, v in data.items():
            report += f"- {k}: {v}\n"
        report += "\n"
    with open(f"logs/{today}.md", "w", encoding="utf-8") as f:
        f.write(report)

if __name__ == "__main__":
    data = collect_platform_data()
    save_daily_report(data)
    print(f"数据采集完成: {json.dumps(data, ensure_ascii=False)}")
```

---

## 9. 登录态维护

### 优势

Cursor 的 `cursor-ide-browser` 复用 IDE 内嵌浏览器环境，Cookie 默认持久化。

### 维护策略

| 策略 | 说明 |
|:---|:---|
| 首次登录 | 用 `browser_navigate` 打开登录页，手动完成（特别是有验证码的平台） |
| Cookie 持久化 | Cursor 内置浏览器 Cookie 自动保存 |
| 登录态检测 | 每次操作前 `browser_snapshot` 检查是否还在登录状态 |
| 失效处理 | 检测到登录失效 → Agent 停止操作 → 通过飞书通知你 |
| 定时心跳 | 定期访问平台保持 Session 活跃 |

### 反检测要点

| 措施 | 目的 |
|:---|:---|
| 随机化操作间隔 | 避免被判定为机器人 |
| 模拟平滑滚动 | 行为更接近真人 |
| 使用 accessibility tree 而非 CSS 选择器 | 对前端改版更稳定 |
| 控制操作频率 | 避免触发平台风控 |

---

## 10. 与 OpenClaw 方案对比

| 维度 | OpenClaw + VNC + CDP | Cursor 本地方案 |
|:---|:---|:---|
| 浏览器操作 | VNC + Chrome + CDP | `cursor-ide-browser` MCP（Playwright） |
| 多 Agent | 16 个独立 workspace | Cursor 单会话 + 脚本编排 |
| 跨 Agent 通信 | sessions_send | 文件系统 + Shell 脚本 |
| 定时调度 | OpenClaw cron（27 个任务） | Windows 任务计划程序 / cron |
| 消息通知 | Telegram Bot | 飞书 MCP / 微信 |
| 运行模式 | 7×24 无人值守 | 人在回路（human-in-the-loop） |
| 部署成本 | 云服务器 + API 费用（~¥1300/月） | 零额外成本 |
| 适合场景 | 全自动运营、大规模平台 | 个人 IP、渐进式自动化 |
| 启动难度 | 需配置服务器/Docker/Agent/Telegram | 即开即用，当天可用 |

### 选择建议

- **想快速开始** → 本方案（Cursor 本地），零成本、即刻可用
- **需要 7×24 全自动** → OpenClaw + VNC + CDP（需云服务器）
- **渐进路径**：先用本方案跑通流程 → 验证 SOP → 再迁移到服务器方案

---

## 11. 成本估算

### Cursor 本地方案

| 项目 | 月费用 |
|:---|:---|
| Cursor Pro（含 Agent 额度） | 已有 |
| 飞书 / 微信通知 | 免费 |
| 本地电脑运行 | 已有 |
| **合计** | **¥0 额外成本** |

### OpenClaw 服务器方案（对比）

| 项目 | 月费用 |
|:---|:---|
| 阿里云服务器（4vCPU+16GB，香港） | ¥300-500 |
| OpenClaw Pro / 自托管 | $0-20 |
| 大模型 API 调用 | ¥200-500 |
| Telegram Bot | 免费 |
| **合计** | **¥500-1300** |

---

## 12. 常见问题与踩坑

| 问题 | 原因 | 解决 |
|:---|:---|:---|
| `Stale element reference` 错误 | 页面变化导致元素引用失效 | 重新 `browser_snapshot` 获取最新引用 |
| 点击后页面在新标签页打开 | 平台链接 `target="_blank"` | 用 `browser_tabs` list 找到新标签页 viewId |
| 知乎编辑器填入内容后字数显示 0 | contenteditable 元素的特殊处理 | 使用 `browser_fill` 而非 `browser_type` |
| 登录态突然失效 | Cookie 过期或平台安全策略 | `browser_snapshot` 检测 → 通知人工重新登录 |
| 操作频率过高触发风控 | 平台反自动化检测 | 加入随机延迟，控制操作间隔 |
| `user-chrome-mcp-server` errored | MCP 服务器配置问题 | 在 Cursor Settings 中检查 MCP 状态 |

### 操作稳健性建议

1. **每次操作前必须 snapshot**：先理解页面结构再操作
2. **操作后必须截图确认**：`browser_take_screenshot` 验证结果
3. **发布前必须人工确认**：最后一步"发布"始终由你决定
4. **失败时优雅降级**：操作失败 → 记录日志 → 通知你 → 跳过该平台

---

## 13. 下一步扩展方向

| 方向 | 说明 | 优先级 |
|:---|:---|:---|
| 编写各平台 SOP | 知乎/小红书/公众号/B站/掘金的完整操作 SOP | 高 |
| 搭建 auto-publish workflow | 在 `workflow/auto-publish/` 创建完整工作流 | 高 |
| 数据采集自动化 | Python + Playwright 定时采集各平台数据 | 中 |
| 飞书数据看板 | 通过 `user-lark-mcp` 将数据写入飞书多维表格 | 中 |
| 内容质量闭环 | Agent 根据平台数据反馈自动调整内容策略 | 低 |
| 迁移到服务器 | 验证 SOP 后迁移到云服务器实现 7×24 无人值守 | 低 |

---

## 参考资料

- [OpenClaw 多 Agent 架构文档](https://docs.openclaw.ai/zh-CN/concepts/multi-agent)
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp/)
- [Browser-Use：AI 浏览器自动化](https://browser-use.com/)
- [agent-browser：Vercel 出品的浏览器自动化 CLI](https://github.com/vercel-labs/agent-browser)
- 本仓库相关文档：
  - [AI 蜂群协作：tmux 多 Agent 协作系统](./AI蜂群协作-tmux多Agent协作系统.md)
  - [图形化 AI 协作：Canvas 白板驱动开发](./图形化AI协作-Canvas白板驱动开发.md)
