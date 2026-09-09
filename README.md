# 杨嘉昊 · 演员个人主页

杨嘉昊的沉浸式演员个人主页，以滚动叙事呈现演员档案、大祭司、妖王、舞台影像与生日视觉章节。

## 本地预览

这是一个无构建依赖的静态网站。可以直接打开 `index.html`，也可以在项目目录运行 `python -m http.server 4173`，然后访问 `http://localhost:4173/`。

## 项目结构

- `index.html`：页面内容与语义结构
- `styles.css`：视觉系统、响应式布局与动效
- `script.js`：滚动叙事、视差、画布粒子与交互
- `assets/`：演员照片、剧照与生成视觉素材

## 开源范围

网页源代码采用 [MIT License](LICENSE)。人物肖像、演出剧照、项目标识与 AI 生成的人物视觉不包含在 MIT 授权中，详见 [ASSET_LICENSE.md](ASSET_LICENSE.md)。

## 部署

仓库已配置 GitHub Pages 工作流。推送到 `main` 分支后，在仓库的 **Settings → Pages** 中将 Source 设为 **GitHub Actions** 即可自动发布。
