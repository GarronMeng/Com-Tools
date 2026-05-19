# Com-Tools

A collection of lightweight commercial/productivity tools.

## 客户健康事件助手 / Health Event Copilot

A Vite + React + Tailwind MVP for insurance advisors, wealth advisors, and high-end health service consultants.

It helps users turn a customer's health-related message into:

- a reply script with adjustable tone
- next actions
- required materials checklist
- resource / benefit matching
- follow-up cadence

## 本地运行

```bash
npm install
npm run dev
```

## 构建与逻辑检查

```bash
npm run test:logic
npm run build
```

## GitHub Pages 自动部署

本项目已配置 GitHub Actions：当 `main` 分支有新提交时，会自动执行：

1. `npm install`
2. `npm run build`
3. 将 `dist/` 部署到 GitHub Pages

工作流文件：`.github/workflows/deploy.yml`。

### 首次启用步骤

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Source: GitHub Actions**。
3. 确认默认分支为 `main` 并推送一次提交。

## GitHub Pages 地址（占位）

- https://GarronMeng.github.io/Com-Tools/

## Notes

- `vite.config.js` 已设置 `base: '/Com-Tools/'`，以适配仓库路径部署。
