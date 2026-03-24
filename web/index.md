---
layout: home

hero:
  name: "π 开发者🚀"
  text: "无限不循环的编程之路"
  # tagline: 开发者技术分享
  actions:
    - theme: brand
      text: 全部文章
      link: /sitemap
    - theme: alt
      text: 关于本站
      link: /about

features:
  - title: 💡 技术
    details: 编程技术、框架教程、开发经验
    link: /tech/intro
  - title: 📚 算法
    details: 算法题解、数据结构、面试刷题
    link: /algorithm/intro
  - title: 🛠️ 工具
    details: 开源工具、效率软件、开发资源
    link: /tools/intro
  - title: ✨ 生活
    details: 生活随笔、读书笔记、思考感悟
    link: /life/intro

---

## 📰 最近更新

<div class="posts-grid">
  <div class="category-card">
    <div class="category-header">
      <span class="category-icon">💡</span>
      <h3 class="category-name">技术</h3>
      <a href="/tech/intro" class="more-link">更多 →</a>
    </div>
    <ul class="post-list">
      <li class="post-item">
        <a href="/tech/Linux常用命令" class="post-link">
          <span class="post-title">Linux常用命令</span>
        </a>
      </li>
    </ul>
  </div>

  <div class="category-card">
    <div class="category-header">
      <span class="category-icon">📚</span>
      <h3 class="category-name">算法</h3>
      <a href="/algorithm/intro" class="more-link">更多 →</a>
    </div>
    <ul class="post-list">
      <li class="post-item">
        <a href="/algorithm/常见排序算法" class="post-link">
          <span class="post-title">常见排序算法</span>
        </a>
      </li>
    </ul>
  </div>

  <div class="category-card">
    <div class="category-header">
      <span class="category-icon">🛠️</span>
      <h3 class="category-name">工具</h3>
      <a href="/tools/intro" class="more-link">更多 →</a>
    </div>
    <ul class="post-list">
      <li class="post-item">
        <a href="/tools/发布操作指南" class="post-link">
          <span class="post-title">发布操作指南</span>
        </a>
      </li>
    </ul>
  </div>

</div>

<style>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.category-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.category-icon {
  font-size: 2rem;
}

.category-name {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.more-link {
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.more-link:hover {
  opacity: 0.8;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item {
  margin-bottom: 12px;
}

.post-item:last-child {
  margin-bottom: 0;
}

.post-link {
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: background 0.2s, color 0.2s;
  line-height: 1.5;
  font-size: 0.95rem;
}

.post-link:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.post-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
