# 网站维护说明

这套网站已经把个人信息、论文、项目、专利和荣誉集中在 `content/site.json` 中。日常更新通常只需要修改这个文件，不需要接触页面结构代码。

## 最常用的更新流程

1. 修改 `content/site.json` 中对应内容。
2. 将新图片放入 `public/assets/`，并在数据中填写 `/assets/文件名`。
3. 在项目目录运行：

   ```bash
   npm run build
   npm run validate
   ```

4. 本地预览：

   ```bash
   npm run serve
   ```

5. 浏览器访问 `http://localhost:4173`。确认无误后提交并推送到 GitHub，GitHub Pages 会自动发布。

## 替换个人照片

- 最省事的方式：将正式照片命名为 `profile-placeholder.svg` 并覆盖现有文件。
- 更推荐的方式：把照片保存为 `public/assets/profile.jpg`，然后在 `scripts/build.mjs` 中把 `/assets/profile-placeholder.svg` 改为 `/assets/profile.jpg`。
- 建议使用正方形或接近 4:5 的半身照，短边至少 800 像素，背景简洁。

## 新增论文

在 `content/site.json` 的 `publications` 数组开头加入一条记录：

```json
{
  "year": 2026,
  "title": "Paper Title",
  "authors": "Yingbo Fan, Coauthor Name",
  "venue": "Conference or Journal",
  "doi": "10.xxxx/xxxxx",
  "url": "https://doi.org/10.xxxx/xxxxx",
  "firstAuthor": true,
  "selected": true,
  "image": "/assets/paper-teaser.jpg",
  "tags": ["Embodied Intelligence", "3D Vision"],
  "summary": "One concise sentence explaining the contribution."
}
```

- `selected: true`：进入首页精选论文。
- `firstAuthor: true`：进入第一作者筛选。
- `image` 和 `summary` 可省略；有高质量代表图时建议保留。
- 新增论文后，记得同步修改顶部 `stats` 中的论文数字。

## 更新 Research Highlights

首页最重要的研究工作位于 `featured` 数组。论文公开后，可以在 `links` 中加入入口：

```json
"links": [
  {"label": "Paper", "url": "https://arxiv.org/abs/xxxx.xxxxx"},
  {"label": "Project", "url": "https://example.github.io/project"},
  {"label": "Code", "url": "https://github.com/username/repository"}
]
```

正式方法图可直接覆盖当前同名 SVG，也可以上传新的 JPG、PNG、WebP 或 SVG，并修改 `image` 路径。推荐横向图片，比例约为 16:10。

## 更新学术主页入口

Google Scholar、ORCID、Semantic Scholar 和邮箱位于 `site.profiles`。目前 Scholar 与 Semantic Scholar 使用作者检索链接；创建或确认个人主页后，将其中的 `url` 换成准确的作者主页地址即可。

## 页面与代码位置

- `content/site.json`：全部可维护内容
- `public/assets/`：照片、论文代表图和图标
- `src/styles.css`：字体、颜色、间距和响应式布局
- `src/site.js`：移动端导航和论文筛选
- `scripts/build.mjs`：页面结构与静态生成逻辑
- `dist/`：自动生成的发布目录，不要手工编辑
- `.github/workflows/pages.yml`：GitHub Pages 自动部署

## 发布前集中检查

- 替换正式个人照片。
- 确认当前英文职务和院系写法。
- 将 Scholar 与 Semantic Scholar 改为个人主页直链。
- 为 CARVE-VLA、One Sphere, Many Charts 等公开工作补充论文、项目、代码和演示链接。
- 用公开版本的论文代表图替换概念图。
- 提供正式 CV PDF 后，在导航和 Hero 中增加下载入口。

