import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const WEB_DIR = path.join(ROOT_DIR, 'web')

// 分类配置
const CATEGORIES = [
  { id: 'tech', name: '技术', icon: '💡' },
  { id: 'algorithm', name: '算法', icon: '📚' },
  { id: 'tools', name: '工具', icon: '🛠️' },
  { id: 'life', name: '生活', icon: '✨' },
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
    return stats.mtime
  } catch {
    return new Date(0)
  }
}

/**
 * 获取所有文章
 */
function getAllPosts() {
  const allPosts = []
  
  for (const category of CATEGORIES) {
    const categoryDir = path.join(WEB_DIR, category.id)
    
    if (!fs.existsSync(categoryDir)) {
      continue
    }
    
    // 获取该分类下所有 md 文件（排除 intro.md）
    const files = glob.sync('*.md', {
      cwd: categoryDir,
      ignore: ['intro.md']
    })
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file)
      allPosts.push({
        title: getFileTitle(filePath),
        link: `/${category.id}/${file.replace('.md', '')}`,
        mtime: getFileMtime(filePath),
        category: category.name,
        categoryIcon: category.icon,
        categoryLink: `/${category.id}/intro`
      })
    }
  }
  
  // 按修改时间倒序排序
  allPosts.sort((a, b) => b.mtime - a.mtime)
  
  return allPosts
}

/**
 * 生成所有文章列表的 markdown 页面
 */
function generateSitemapMd() {
  const allPosts = getAllPosts()
  
  let content = `---
title: 全部文章
---

# 📚 全部文章

本站所有文章列表，共 **${allPosts.length}** 篇。

## 目录

`
  
  // 按分类分组
  const postsByCategory = {}
  for (const post of allPosts) {
    if (!postsByCategory[post.category]) {
      postsByCategory[post.category] = []
    }
    postsByCategory[post.category].push(post)
  }
  
  // 生成目录索引
  for (const category of CATEGORIES) {
    const posts = postsByCategory[category.name]
    if (posts && posts.length > 0) {
      content += `- [${category.icon} ${category.name}](#${category.id}) - ${posts.length} 篇\n`
    }
  }
  
  content += `\n---\n\n`
  
  // 生成各分类文章列表
  for (const category of CATEGORIES) {
    const posts = postsByCategory[category.name]
    if (posts && posts.length > 0) {
      content += `## ${category.icon} ${category.name}\n\n`
      
      for (const post of posts) {
        const date = post.mtime.toLocaleDateString('zh-CN')
        content += `- [${post.title}](${post.link}) - ${date}\n`
      }
      
      content += `\n`
    }
  }
  
  const outputPath = path.join(WEB_DIR, 'sitemap.md')
  fs.writeFileSync(outputPath, content, 'utf-8')
  console.log(`✅ 已生成 ${outputPath}`)
  console.log(`   共 ${allPosts.length} 篇文章`)
}

/**
 * 生成 JSON 文件
 */
function generateJson() {
  const allPosts = getAllPosts()
  
  const output = {
    generated: new Date().toISOString(),
    total: allPosts.length,
    posts: allPosts
  }
  
  const outputPath = path.join(WEB_DIR, 'all-posts.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`✅ 已生成 ${outputPath}`)
}

// 主函数
function main() {
  console.log('📝 生成全部文章列表...\n')
  
  generateSitemapMd()
  generateJson()
  
  console.log('\n✨ 完成!')
}

main()
