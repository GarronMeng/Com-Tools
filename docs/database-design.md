# Health Event Copilot 数据库设计（Supabase）

> 目标：先完成数据层建模与初始化，后续再接前端，不在当前 PR 引入 Supabase SDK。

## 1. 设计原则

- **配置数据与业务记录分离**：事件配置（事件、话术、行动清单）和顾问操作记录（客户案例、跟进）独立建模。
- **可迭代上线**：先支持当前 `src/logic.js` 的静态内容平移，再逐步引入后台管理与权限。
- **兼容现有前端逻辑**：字段命名尽量和当前逻辑语义一致，便于未来将 `eventConfig` 切换成数据库读取。

## 2. 表结构说明

## `health_events`

**用途**：存放事件主数据（当前 `eventConfig` 的事件元信息）。

核心字段：
- `title`：事件标题（如“体检报告异常”）
- `group_name`：分组（报告与复诊 / 权益与资源等）
- `badge`、`icon_key`、`output_title`：UI 展示所需
- `urgency_base`：优先级基础分
- `short_description`、`summary`：列表描述与详情摘要
- `sort_order`：前端场景卡片排序
- `is_active`：软开关（未来可下线某事件）

## `event_playbooks`

**用途**：存放每个事件的行动与清单类配置。

核心字段：
- `event_id`：关联 `health_events`
- `next_actions`：顾问下一步动作（jsonb 数组）
- `checklist`：资料清单（jsonb 数组）
- `resources`：资源/权益（jsonb 数组）
- `follow_up`：跟进节奏（jsonb 数组）

说明：每个事件对应一条 playbook，`unique(event_id)` 做唯一约束。

## `script_templates`

**用途**：存放话术模板，支持语气版本管理。

核心字段：
- `event_id`：关联 `health_events`
- `tone`：`warm` / `balanced` / `professional`
- `template`：模板正文
- `is_active`：模板启用状态（未来支持版本切换）

说明：`unique(event_id, tone)` 保证每个事件每种语气只有一个活动模板主版本。

## `client_cases`

**用途**：记录顾问实际创建的客户健康事件案例（未来可用于 CRM 回溯与统计）。

核心字段：
- `advisor_id`：顾问 ID（可空，预留未来用户体系）
- `client_name`：客户/家庭名称
- `event_id`：关联事件
- `subject`、`age_group`、`material_status`、`emotion`、`region`、`advisor_goal`、`note`：当前前端表单字段
- `generated_script`：当时生成的话术快照（避免模板变化导致历史回放不一致）

## `case_followups`

**用途**：记录单个 case 的可执行跟进事项（从 `follow_up` 派生或人工新增）。

核心字段：
- `case_id`：关联 `client_cases`
- `followup_label`：跟进项标题
- `due_date`：到期日期（可空）
- `status`：`pending` / `done` / `skipped`
- `note`：跟进备注

## 3. SQL 文件说明

- `db/schema.sql`
  - 建立 5 张核心表
  - 设置约束、外键、枚举约束（通过 `check`）
  - 添加常用索引
- `db/seed.sql`
  - 将当前 `src/logic.js` 中全部事件配置迁移为初始数据
  - 包含：7 条 `health_events`、7 条 `event_playbooks`、21 条 `script_templates`

## 4. 与当前前端映射关系（未来接入）

当前前端来源：
- `eventConfig[eventType]`：事件详情 + playbook + scriptByTone

未来替换建议：
1. 页面初始化拉取 `health_events`（按 `sort_order`，`is_active=true`）。
2. 选择事件后联查：
   - `event_playbooks`（动作、清单、资源、跟进）
   - `script_templates`（按 tone）
3. `generateScript` 可继续保留“note 拼接逻辑”，仅把基础模板改为数据库返回。
4. 用户点击“复制完整方案”前后，可把核心输入 + 生成结果写入 `client_cases`。
5. 依据 `follow_up` 数组自动拆分插入 `case_followups`（后续可配提醒任务）。

## 5. Supabase 接入建议（下一阶段，不在本 PR）

- 新建 `supabase/migrations`，将 `db/schema.sql` 拆成可版本化迁移。
- 用 Supabase SQL Editor 或 CLI 执行 `schema.sql` 与 `seed.sql`。
- 为匿名读取配置场景设计 RLS：
  - `health_events` / `event_playbooks` / `script_templates`：可读
  - `client_cases` / `case_followups`：登录后按 `advisor_id` 隔离
- 前端先做只读接入，再逐步接入写入（创建 case / 跟进状态更新）。
