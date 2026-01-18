# 简历生成器 (Resume Builder)

一个现代、响应式的简历生成器，支持 AI 辅助优化、头像上传与背景去除、多套模板和实时预览。

> 说明：请在 `client/public/screenshot.png` 放置一张截图，GitHub 将在页面显示。

## 主要功能

- 多套模板：Classic、Minimal、Minimal Image、Modern
- 实时预览与主题强调色（Accent Color）选择
- 头像上传并可选择去背景（基于 ImageKit / AI 转换）
- AI 自动优化职业简介（Professional Summary）
- 保存简历到用户账户、设置公开/私密与分享链接
- 后端：Express；前端：React + Vite

---

## 本地运行（开发）

在两个终端分别启动后端与前端：

```bash
# 后端（在 /server）
cd server
npm install
npm run server

# 前端（在 /client）
cd client
npm install
npm run dev
```

打开浏览器访问 Vite 提示的地址（通常为 `http://localhost:5173`）。

---

## 快速开始

1. 克隆仓库：

```bash
git clone <your-repo-url>
cd Resueme
```

2. 配置后端环境变量（见下节）并启动服务。

3. 启动前端开发服务器并访问页面。

---

## 环境变量（示例）

在 `server/.env` 中添加如下变量：

```
MONGODB_URI=你的MongoDB连接字符串
JWT_SECRET=你的JWT密钥
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
OPENAI_API_KEY=...     # 或者 Qwen 相关配置
QWEN_MODEL=...         # aiController 使用的模型标识
VITE_BASE_URL=http://localhost:5000  # 若前端需要调用本地后端
```

说明：若使用 ImageKit 的图片上传/转换功能，请确保填写 ImageKit 的密钥与 urlEndpoint。

---

## 去背景与主题色的推荐实现（项目说明）

该项目推荐的流程：

1. 上传阶段只保存原始图片到 ImageKit（获得原图 URL）。
2. 预览阶段前端生成带 `bgremove` 效果且 `format=png` 的 ImageKit 转换 URL（透明 PNG），再在前端使用 CSS 或 Canvas 将该透明图合成到所选 `accent_color` 背景上，用户即可即时看到更换背景色的效果。这样无需为每个颜色生成并存储不同的变体。

注意与提示：

- 若去背后的图片仍然有白底或蓝色残影，可能是去背算法对相近颜色（服装与背景相近）无法完全分离。可尝试更换照片或使用更强的去背服务，并在前端对边缘做羽化（feather）处理。 
- 为确保显示背景色，请确认生成的去背 URL 返回透明 PNG（Content-Type 为 image/png 且包含 alpha 通道）。

---

## AI 简历优化

- 前端将当前职业简介发送到：`POST /api/ai/enhance-pro-sum`。
- 后端调用已配置的 AI 模型（Qwen/OpenAI），返回字段名为 `enhancedContent`。
- 前端接收后应使用该字段更新输入框内容以供用户确认。

调试小贴士：如果点击「AI Enhance」后文本没有变化，请在浏览器 Network 里查看响应，确认服务端返回了 `enhancedContent` 字段。

---

## 项目结构概览

- `/client` — React + Vite 前端
  - `/src/pages` — 页面，例如 `ResumeBuilder.jsx`, `Preview.jsx`
  - `/src/pages/components` — 表单、预览与模板组件
- `/server` — Express 后端
  - `/controllers` — 业务逻辑（resume、ai、user）
  - `/config` — ImageKit、multer、AI 客户端、数据库配置

---

## 贡献指南

- Fork 仓库并创建 feature 分支，完成后提交 PR 并说明变更点。
- 提交前请本地运行并保证主要流程（上传、保存、预览、AI 优化）可用。

---



