import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const WEB_DIR = path.join(ROOT_DIR, 'web')

// 分类配置
const CATEGORIES = [
  { id: 'tech', name: '技术', icon: '💡', link: '/tech/intro' },
  { id: 'algorithm', name: '算法', icon: '📚', link: '/algorithm/intro' },
  { id: 'tools', name: '工具', icon: '🛠️', link: '/tools/intro' },
  { id: 'life', name: '生活', icon: '✨', link: '/life/intro' },
]

/**
 * 从 markdown 文件 frontmatter 或文件名获取标题
 */
function getFileTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/)
    if (titleMatch) {
      return titleMatch[1].trim()
    }
  }

  const fileName = path.basename(filePath, '.md')
  return fileName.replace(/[-_]/g, ' ')
}

/**
 * 获取文件修改时间
 */
function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtimeMs
  } catch {
    return 0
  }
}

/**
 * 获取所有分类的最新文章
 */
function getLatestPosts(limitPerCategory = 3) {
  const result = []

  for (const category of CATEGORIES) {
    const categoryDir = path.join(WEB_DIR, category.id)

    if (!fs.existsSync(categoryDir)) {
      continue
    }

    // 获取该分类下所有 md 文件（排除 intro.md）
    const files = glob.sync('*.md', {
      cwd: categoryDir,
      ignore: ['intro.md'],
    })

    // 获取文件信息并排序（按修改时间）
    const filesWithMeta = files.map((file) => {
      const filePath = path.join(categoryDir, file)
      return {
        title: getFileTitle(filePath),
        link: `/${category.id}/${file.replace('.md', '')}`,
        mtime: getFileMtime(filePath),
        category: category.name,
        categoryIcon: category.icon,
        categoryLink: category.link,
      }
    })

    // 按修改时间倒序排序，取最新的
    filesWithMeta.sort((a, b) => b.mtime - a.mtime)
    const latest = filesWithMeta.slice(0, limitPerCategory)

    result.push({
      category: category.name,
      categoryIcon: category.icon,
      categoryLink: category.link,
      posts: latest,
    })
  }

  return result
}

/**
 * 生成主页最新文章 HTML 片段
 */
function generateHomeSection(latestPosts) {
  let html = `<div class="posts-grid">\n`

  for (const category of latestPosts) {
    if (category.posts.length === 0) continue

    html += `  <div class="category-card">\n`
    html += `    <div class="category-header">\n`
    html += `      <span class="category-icon">${category.categoryIcon}</span>\n`
    html += `      <h3 class="category-name">${category.category}</h3>\n`
    html += `      <a href="${category.categoryLink}" class="more-link">更多 →</a>\n`
    html += `    </div>\n`
    html += `    <ul class="post-list">\n`

    for (const post of category.posts) {
      html += `      <li class="post-item">\n`
      html += `        <a href="${post.link}" class="post-link">\n`
      html += `          <span class="post-title">${post.title}</span>\n`
      html += `        </a>\n`
      html += `      </li>\n`
    }

    html += `    </ul>\n`
    html += `  </div>\n\n`
  }

  html += `</div>`
  return html
}

/**
 * 更新 index.md 中的最新文章区域
 */
function updateIndexMd(latestPosts) {
  const indexMdPath = path.join(WEB_DIR, 'index.md')

  if (!fs.existsSync(indexMdPath)) {
    console.log('⚠️  index.md 不存在，跳过')
    return
  }

  let content = fs.readFileSync(indexMdPath, 'utf-8')

  // 匹配 ## 📰 最近更新 下面的 posts-grid 区域（非贪婪模式，到第一个 </div> 结束）
  const postsGridRegex = /(## 📰 最近更新\n\n)<div class="posts-grid">[\s\S]*?<\/div>(\n\n<style>)/
  const newPostsGrid = generateHomeSection(latestPosts)

  if (postsGridRegex.test(content)) {
    content = content.replace(postsGridRegex, `$1${newPostsGrid}$2`)
    console.log('✅ 已更新 index.md 最新文章区域')
  } else {
    console.log('⚠️  未找到 posts-grid 区域，跳过更新')
  }

  fs.writeFileSync(indexMdPath, content, 'utf-8')
}

/**
 * 生成 JSON 文件供 VitePress 使用
 */
function main() {
  console.log('📝 生成最新文章数据...')

  const latestPosts = getLatestPosts(3)

  const output = {
    generated: new Date().toISOString(),
    categories: latestPosts,
  }

  // 输出到 web 目录，这样 dev 和 build 都能访问
  const outputPath = path.join(WEB_DIR, 'latest-posts.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`✅ 已生成 ${outputPath}`)
  console.log(`   共 ${latestPosts.reduce((sum, c) => sum + c.posts.length, 0)} 篇文章`)

  // 同时更新 index.md
  updateIndexMd(latestPosts)
}

main()
