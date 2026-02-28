# Vibe Coding 实操指南

> 基于本仓库方法论整理的完整开发流程，从零到上手。

---

## 这个仓库是什么？

**Vibe Coding CN** 是一个「AI 结对编程的终极工作站」，核心理念是：

- **规划驱动**：先规划再编码，谨慎让 AI 全局自主规划
- **模块化**：按职责拆模块，先结构后代码
- **上下文为王**：垃圾进 = 垃圾出，上下文是第一性要素

它包含四大核心资产：

| 资产 | 路径 | 用途 |
|:---|:---|:---|
| 知识库 | `documents/` | 哲学/入门/方法论/实战/资源 |
| 提示词库 | `prompts/` | 指向云端 Google 表格 |
| 技能库 | `skills/` | 20 个可复用技能模块 |
| 工作流 | `workflow/` | 自动化工作流模板 |

---

## 推荐学习路线

### 第一阶段：理解核心哲学（30分钟）

| 顺序 | 文档 | 核心要点 |
|:---|:---|:---|
| 1 | [Vibe Coding 哲学原理](./00-Vibe%20Coding%20哲学原理.md) | 你描述意图、AI 执行操作 |
| 2 | [编程之道](../00-基础指南/编程之道.md) | 程序 = 数据 + 函数，理解抽象与模块化 |
| 3 | [血的教训](../00-基础指南/血的教训.md) | 开发前 70% 时间找资料和 AI 充分对齐 |

### 第二阶段：掌握核心方法论（1小时）

| 顺序 | 文档 | 核心要点 |
|:---|:---|:---|
| 4 | [胶水编程](../00-基础指南/胶水编程.md) | 核心银弹：能抄不写，能连不造，能复用不原创 |
| 5 | [常见坑汇总](../00-基础指南/常见坑汇总.md) | 避免踩坑的速查手册 |
| 6 | [强前置条件约束](../00-基础指南/强前置条件约束.md) | 34条通用约束 + 23条胶水约束 |

### 第三阶段：开始实践（动手）

按照下面的「实操开发步骤」逐步执行。

---

## 核心方法论速览

### 胶水编程（最重要）

- 不从零写代码，只复用成熟开源项目
- AI 只负责「连接」模块，不负责「发明」
- 流程：明确目标 → 寻找轮子 → 理解接口 → 描述连接 → 验证运行

### Canvas白板驱动开发

- 白板成为单一真相源，代码是白板的序列化形式
- AI 直接读白板 JSON 理解架构
- 详见：[Canvas白板驱动开发](../02-方法论/图形化AI协作-Canvas白板驱动开发.md)

### AI蜂群协作

- 多个 AI 通过 tmux 互相感知、协作、分工
- 详见：[AI蜂群协作](../02-方法论/AI蜂群协作-tmux多Agent协作系统.md)

### 元方法论

- α-提示词（生成器）+ Ω-提示词（优化器）的递归闭环
- 详见：[元方法论](../00-基础指南/A%20Formalization%20of%20Recursive%20Self-Optimizing%20Generative%20Systems.md)

---

## 实操开发步骤

### 第一步：需求澄清（最重要，不要跳过）

「血的教训」文档强调：**10分开发，7分找资料**。开发前你应该：

1. 用一句话描述你想做什么
2. 把需求交给 AI（Claude/ChatGPT），让它问你问题澄清需求
3. 充分讨论后，让 AI 生成一份 **PRD（产品需求文档）** 或 **设计文档**

**示例提示词**：

```text
你是一个专业的 AI 编程助手。我想用 Vibe Coding 的方式开发一个项目。

请先问我：
1. 你想做什么项目？（一句话描述）
2. 你熟悉什么编程语言？（不熟悉也没关系）
3. 你的操作系统是什么？

然后帮我：
1. 推荐最简单的技术栈
2. 生成项目结构
3. 一步步指导我完成开发

要求：每完成一步问我是否成功，再继续下一步。
```

---

### 第二步：胶水编程思维 — 先找轮子，再动手

这是仓库最核心的方法：**能抄不写，能连不造**。

具体做法：

1. 拿到需求后，先问 AI：「有没有成熟的库/项目已经做过类似的事？」
2. 让 AI 搜索 GitHub Topics 推荐成熟仓库
3. 你只需要写「胶水代码」：连接模块A的输出到模块B的输入

**示例（Telegram Bot 项目）**：

```text
轮子 1: python-telegram-bot（消息推送）
轮子 2: openai SDK（AI 处理）
轮子 3: psycopg2（数据存储）
胶水代码: ~50 行，负责数据流转
```

**GitHub Topics 搜索提示词**：

```text
我需要实现 [你的需求]，请帮我：
1. 分析这个需求可能涉及哪些技术领域
2. 推荐对应的 GitHub Topics 关键词
3. 给出 GitHub Topics 链接（格式：https://github.com/topics/xxx）
```

---

### 第三步：创建「记忆库」文件结构

在你的项目根目录创建 `memory-bank/` 目录：

```text
my-project/
├── memory-bank/
│   ├── prd.md                  # 产品需求文档
│   ├── tech-stack.md           # 技术栈选择
│   ├── implementation-plan.md  # 实施计划（分步骤）
│   ├── progress.md             # 进度记录
│   └── architecture.md         # 架构说明
├── CLAUDE.md / AGENTS.md       # AI 行为规则
└── src/                        # 源代码
```

关键点：

- `CLAUDE.md`/`AGENTS.md` 必须强制 AI 在写代码前先读 memory-bank
- 规则里强调「模块化」和「禁止巨石文件」

**AGENTS.md 中必须包含的规则**：

```text
# 重要提示：
# 写任何代码前必须完整阅读 memory-bank/ 里所有文档
# 每完成一个重大功能后，必须更新 memory-bank/architecture.md
# 禁止创建超过 300 行的单文件
# 必须保持模块化设计
```

---

### 第四步：生成实施计划

让 AI 根据 PRD + 技术栈生成实施计划，要求：

- 每一步要小而具体
- 每一步必须包含验证测试
- 严禁包含代码 — 只写清晰指令
- 先聚焦基础功能，完整功能后面再加

---

### 第五步：逐步执行的工作循环

每步执行的固定节奏：

```text
1️⃣ 告诉 AI：读 memory-bank，执行实施计划第 N 步
2️⃣ 先用 Ask/Plan 模式确认方案，满意后再执行
3️⃣ 执行完成后手动验证测试
4️⃣ 验证通过后：Git 提交
5️⃣ 更新 progress.md 和 architecture.md
6️⃣ 新建对话（/clear），继续下一步
```

重要原则：

- **每步验证后才进下一步**（不要让 AI 连续执行多步）
- **定期 /clear 清理上下文**（避免上下文污染）
- **每步都 git commit**（出问题随时回滚）

---

### 第六步：调试与踩坑处理

踩坑时的处理原则（来自「常见坑汇总」）：

| 情况 | 处理方式 |
|:---|:---|
| 报错 | 复制完整错误信息给 AI |
| AI 反复修改同一问题 | 换个思路描述，或开新对话 |
| 完全卡住 | 回滚到上一个 git commit，换提示词重试 |
| 终极方案 | 把整个代码库丢给 AI 求救 |

**终极调试提示词**：

```text
我遇到了一个问题，已经尝试了很多方法都没解决。

错误信息：
[粘贴完整错误]

我的环境：
- 操作系统：
- Python/Node 版本：
- 相关依赖版本：

我已经尝试过：
1. xxx
2. xxx

请帮我分析可能的原因，并给出解决方案。
```

---

## 「强前置条件约束」中的关键铁律

这些是写在 AGENTS.md/CLAUDE.md 中约束 AI 行为的规则：

- 不得补丁式修改忽视整体设计
- 不得臆测接口行为，必须查文档
- 不得在需求不清晰时直接实现
- 先结构后代码，接口先行实现后补
- 不得自行实现底层逻辑，必须优先复用成熟库（胶水编程约束）
- 所有被调用能力必须来自依赖库的真实实现，不得使用 Mock 或 Stub

---

## 可以直接用的资源

| 资源 | 说明 |
|:---|:---|
| [提示词在线表格](https://docs.google.com/spreadsheets/d/1Ifk_dLF25ULSxcfGem1hXzJsi7_RBUNAki8SBCuvkJA/edit?gid=1254297203#gid=1254297203) | 系统提示词 + 编程提示词 |
| `skills/` 目录 | 20 个技能（详见下方「Skills 技能库详解」） |
| `workflow/` 目录 | 2 个工作流模板（详见下方「Workflow 工作流详解」） |
| `skills/skills-skills/` | 元技能（可用来生成新 Skill） |
| `skills/sop-generator/` | SOP 生成技能 |
| [通用项目架构模板](../00-基础指南/通用项目架构模板.md) | 标准化目录结构参考 |

---

## Skills 技能库详解

`skills/` 目录下包含 20 个可复用技能模块，每个技能有独立的 `SKILL.md` 定义文件。按功能域分类如下：

### 元技能与开发辅助

| 技能 | 路径 | 功能说明 |
|:---|:---|:---|
| **skills-skills（元技能）** | `skills/skills-skills/` | 从领域材料生成/校验/脚手架化其它技能，包含 Skill Seekers 工具、质量门禁、references 拆分、create-skill/validate-skill 脚本 |
| **sop-generator** | `skills/sop-generator/` | 将碎片化资料与需求整理为标准 SOP（目的、步骤、控制点、异常处理、记录），支持多主题拆分与质量自检 |
| **ddd-doc-steward** | `skills/ddd-doc-steward/` | 文档驱动开发（DDD）文档管家，维护单一真相源（SSOT），执行盘点→计划→补丁→摘要→一致性检查，严格证据链 |
| **canvas-dev** | `skills/canvas-dev/` | Canvas 白板驱动开发，以 Obsidian Canvas 为唯一真相源，支持代码⇄白板双向同步，五阶段执行流程 |
| **claude-code-guide** | `skills/claude-code-guide/` | Claude Code 高级开发中文指南，涵盖 REPL、Artifacts、MCP、大文件分析、钩子、多代理协作 |
| **claude-cookbooks** | `skills/claude-cookbooks/` | Claude API 示例与最佳实践，包括工具调用、RAG、多模态、分类、摘要、Text-to-SQL、Agent 模式 |
| **headless-cli** | `skills/headless-cli/` | 无交互批量调用 AI CLI（Gemini/Claude/Codex），支持 YOLO 模式/安全模式、stdin/stdout 管道、多模型编排 |
| **markdown-to-epub** | `skills/markdown-to-epub/` | 将 Markdown 手稿稳定构建为 EPUB，支持图片引用归一化、OPF/NCX/NAV 包结构检查 |
| **snapdom** | `skills/snapdom/` | 高性能 DOM 转图片（SVG/PNG/JPG/WebP），无依赖，比 html2canvas 快 10-40 倍 |

### 终端与运维自动化

| 技能 | 路径 | 功能说明 |
|:---|:---|:---|
| **tmux-autopilot** | `skills/tmux-autopilot/` | tmux 自动化操控与多 AI 终端协作，支持 capture-pane/send-keys、批量巡检、蜂群协作、卡死救援 |
| **proxychains** | `skills/proxychains/` | 自动检测网络问题并强制走代理，连接超时/DNS 失败时自动使用 proxychains4 |

### 数据库

| 技能 | 路径 | 功能说明 |
|:---|:---|:---|
| **postgresql** | `skills/postgresql/` | PostgreSQL 数据库开发与管理，涵盖 SQL 查询、连接控制、数据库设计、性能调优 |
| **timescaledb** | `skills/timescaledb/` | PostgreSQL 时序扩展，支持超表、持续聚合、压缩、实时分析、Hyperfunctions |

### 加密货币与交易

| 技能 | 路径 | 功能说明 |
|:---|:---|:---|
| **ccxt** | `skills/ccxt/` | 加密货币交易所统一 API 库，支持 150+ 交易所，JS/Python/PHP 多语言 |
| **coingecko** | `skills/coingecko/` | CoinGecko API 接入，提供价格、市值、交易量、历史数据等 40+ 参考文档 |
| **cryptofeed** | `skills/cryptofeed/` | 40+ 交易所实时行情 Python 库，WebSocket 流式数据，支持 Redis/Kafka 等后端 |
| **hummingbot** | `skills/hummingbot/` | 加密货币交易机器人框架，支持做市、套利、自动化策略 |
| **polymarket** | `skills/polymarket/` | Polymarket 预测市场 API 与实时数据，支持 REST API 和 WebSocket |

### 社交与消息平台

| 技能 | 路径 | 功能说明 |
|:---|:---|:---|
| **telegram-dev** | `skills/telegram-dev/` | Telegram 生态全栈开发（Bot/Mini Apps/客户端），支持消息、支付、Webhook、内联键盘 |
| **twscrape** | `skills/twscrape/` | 基于 GraphQL 的 Twitter/X 数据抓取，支持账号轮换、异步并行、推文/用户/关注/趋势 |

---

## Workflow 工作流详解

`workflow/` 目录存放可复用工作流模板，将「需求→计划→实施→验证→复盘」固化为可审计的自动化路径。

### 工作流 1：全自动开发闭环（auto-dev-loop）

**路径**：`workflow/auto-dev-loop/`

**核心理念**：基于状态机 + 文件 Hook 的五步 AI Agent 闭环开发流程，适用于最小依赖、可复现的全自动软件流水线。

**五步状态机**：

| 步骤 | 名称 | 说明 |
|:---|:---|:---|
| Step 1 | 需求输入 | 锁定需求规格 |
| Step 2 | 执行计划 | 生成实施计划 |
| Step 3 | 实施变更 | 执行代码修改 |
| Step 4 | 验证发布 | 测试与验证 |
| Step 5 | 总控循环 | 根据验证结果决定完成或回跳 Step 2 重新规划 |

**核心机制**：

- **状态驱动**：`state/current_step.json` 为唯一调度入口，每次更新触发对应 Runner
- **文件 Hook**：`inotifywait` 监听状态变更，自动推进后续步骤
- **失败回跳**：Step 5 根据验证状态写入 `target_step`，失败时回跳 Step 2
- **熔断保护**：同一任务最多重试 3 次，超过后变为 `fatal_error`，需人工介入

**子组件**：

- `workflow_engine/` — 轻量编排引擎（runner.py 状态机调度、hook_runner.sh 监听）
- `workflow-orchestrator/` — 编排技能（定义状态机与 Hook 约定）
- `step1~step5_*.jsonl` — 五步提示词文件

### 工作流 2：Canvas 白板驱动开发（canvas-dev）

**路径**：`workflow/canvas-dev/`

**核心理念**：以 Obsidian Canvas 白板为单一真相源，图形是第一公民，代码是白板的序列化形式，AI 担任架构总师。

**核心步骤**：

| 步骤 | 名称 | 说明 |
|:---|:---|:---|
| 1 | 架构分析 | 从现有代码扫描生成 Obsidian Canvas 架构白板（节点、连线、分组） |
| 2 | 白板驱动编码 | 根据白板 JSON 生成/修改代码：节点→文件/类，连线→依赖关系 |
| 3 | 白板同步检查 | 校验白板与代码一致性（节点完整性、连线准确性、分组正确性） |
| 4 | 人工优化白板 | 人类负责架构设计，在白板上调整布局、补充依赖、标注设计决策 |
| 5 | 持续迭代 | PR 前检查白板更新，定期运行校验脚本，白板优先修正 |

**子组件**：

- `prompts/01-架构分析.md` — 从代码生成 `.canvas` 的提示词
- `prompts/02-白板驱动编码.md` — 根据白板 JSON 生成代码的提示词
- `prompts/03-白板同步检查.md` — 一致性检查提示词（含 Python 脚本与 CI 示例）
- `templates/` — project.canvas、module.canvas 模板
- `examples/` — demo-project.canvas 示例

### 两个工作流对比

| 维度 | auto-dev-loop | canvas-dev |
|:---|:---|:---|
| 触发方式 | 状态文件变更 / 手动 `runner.py start` | 人工提供代码路径或白板 JSON |
| 依赖 | inotify-tools、Python | Obsidian、支持 Canvas JSON 的 AI |
| 产物 | `artifacts/<run_id>/stepN.json` | `.canvas` 文件、代码文件 |
| 适用场景 | 全自动 CI/CD 流水线、批量任务 | 架构可视化、白板驱动开发 |
| 自动化程度 | 高（Hook 自动推进） | 中（需人工参与白板编辑与校验） |

### 工作流实操用法

#### auto-dev-loop 使用方法

**方式 A：手动逐步执行（推荐新手）**

不需要任何脚本，直接把每步的提示词喂给 AI 对话：

```text
步骤 1：打开 workflow/auto-dev-loop/step1_需求输入.jsonl
       → 复制提示词到 AI 对话中，提供你的原始需求
       → AI 会通过「发散→澄清→收敛」帮你生成《锁定规格书》
       → 你回复"确认"后进入下一步

步骤 2：打开 step2_执行计划.jsonl
       → 把《锁定规格书》作为输入，AI 生成分步实施计划

步骤 3：打开 step3_实施变更.jsonl
       → 按计划逐步实施代码修改

步骤 4：打开 step4_验证发布.jsonl
       → 运行测试验证所有变更

步骤 5：打开 step5_总控与循环.jsonl
       → 检查结果，通过则完成，失败则回到步骤 2
```

**方式 B：Python 状态机调度**

```bash
cd workflow/auto-dev-loop

# 启动工作流
python3 workflow_engine/runner.py start

# 查看当前进行到哪一步
python3 workflow_engine/runner.py status
```

状态文件位于 `workflow_engine/state/current_step.json`，每步产物输出到 `workflow_engine/artifacts/<run_id>/stepN.json`。

**方式 C：Hook 自动推进（全自动模式）**

需要 Linux 环境并安装 `inotify-tools`：

```bash
# 终端 1：启动文件监听（状态变更自动触发下一步）
cd workflow/auto-dev-loop
./workflow_engine/hook_runner.sh

# 终端 2：启动工作流
python3 workflow_engine/runner.py start
```

**方式 D：Kiro CLI**

```bash
cd workflow
kiro-cli chat --agent workflow
```

> **注意：** `runner.py` 当前使用 MOCK 模拟 LLM 调用。实际使用需要替换为真实的 LLM API 调用，或者直接采用方式 A 手动执行。

---

#### canvas-dev 使用方法

**第 1 步：安装 Obsidian**

前往 <https://obsidian.md/> 下载安装，这是一个免费的开源笔记和白板工具。

**第 2 步：从现有代码生成架构白板**

将 `workflow/canvas-dev/prompts/01-架构分析.md` 中的提示词复制到 AI 对话中，替换占位符：

```text
# 替换这些变量
{PROJECT_PATH}  → 你的项目路径，如 /home/user/my-project
{GRANULARITY}   → 分析粒度：file（文件级）/ class（类级）/ service（服务级）

# 示例
请分析 /home/user/my-project 项目，生成文件级别的架构白板。
重点关注：
- API 路由和处理函数
- 数据库模型和操作
- 外部服务调用
```

AI 会生成一个 `.canvas` JSON 文件，保存为 `your-project.canvas`。

**第 3 步：用 Obsidian 打开白板**

1. 在 Obsidian 中打开你的项目目录（或包含 `.canvas` 文件的目录）
2. 双击 `.canvas` 文件即可看到可视化架构图
3. 手动调整：拖动节点优化布局、补充遗漏的依赖连线、添加注释

**第 4 步：用白板驱动编码**

使用 `workflow/canvas-dev/prompts/02-白板驱动编码.md` 中的提示词：

```text
# 新功能开发
根据以下白板生成 Python FastAPI 项目代码：
{粘贴 .canvas 文件的 JSON 内容}
技术栈：Python 3.11 + FastAPI + SQLAlchemy
目标目录：/home/user/my-api

# 增量更新（白板有修改时）
白板已更新，请对比新旧版本，只修改变化的部分：
旧白板：{旧的 canvas JSON}
新白板：{新的 canvas JSON}
```

AI 会根据节点→文件/类、连线→依赖关系、分组→目录结构的映射规则生成代码。

**第 5 步：校验白板与代码一致性**

使用 `workflow/canvas-dev/prompts/03-白板同步检查.md` 中的提示词，或直接运行脚本：

```bash
python3 canvas_sync_check.py your-project.canvas /path/to/project
```

输出覆盖率和不一致项，白板与代码保持同步。

**可用模板**：

- `workflow/canvas-dev/templates/project.canvas` — 项目级白板模板，直接复制后修改
- `workflow/canvas-dev/templates/module.canvas` — 单模块白板模板
- `workflow/canvas-dev/examples/demo-project.canvas` — 示例项目，可用 Obsidian 打开参考

---

## 经验总结

来自仓库 README 中沉淀的核心经验：

- **上下文是第一性要素**，垃圾进垃圾出
- **目的主导**，一切动作围绕「目的」展开
- **先结构后代码**，接口先行实现后补
- **模仿优先**，不重复造轮子
- **文档即上下文**，不是事后补
- **明确写清能改什么、不能改什么**
- **Debug 只给预期 vs 实际 + 最小复现**
- **重复多尝试几次**，AI 犯的错误用提示词整理为经验持久化存储

---

## 根据你的情况选择起点

### A. 完全新手（还没编过程）

1. 打开 [claude.ai](https://claude.ai/) 或 [chatgpt.com](https://chatgpt.com/)
2. 复制上面的「1分钟快速开始提示词」
3. 跟着 AI 一步步来

### B. 有编程基础

1. 安装 [Cursor](https://cursor.com/) IDE 或 [Claude Code](https://claude.ai/) CLI
2. 创建 memory-bank + AGENTS.md
3. 按照「记忆库模式」逐步开发

### C. 已有项目，想引入 Vibe Coding

1. 把现有代码库整理出 architecture.md
2. 创建 AGENTS.md 约束 AI 行为
3. 用胶水编程思维处理新功能
