import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.join(__dirname, '..')
const WEB_DIR = path.join(ROOT_DIR, 'web')

// 分类配置
const CATEGORIES = {
  'algorithm': {
    title: '## 最新解题',
    defaultDesc: '- 暂无文章，敬请期待...'
  },
  'tech': {
    title: '## 最新文章',
    defaultDesc: '- 暂无文章，敬请期待...'
  },
  'tools': {
    title: '## 工具列表',
    defaultDesc: '- 暂无工具，敬请期待...'
  },
  'life': {
    title: '## 最新文章',
    defaultDesc: '- 暂无文章，敬请期待...'
  }
}

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
  
  // 从文件名获取（去掉扩展名，替换 - 和 _ 为空格）
  const fileName = path.basename(filePath, '.md')
  return fileName.replace(/[-_]/g, ' ')
}

/**
 * 更新 intro.md 文件
 */
function updateIntro(category) {
  const categoryDir = path.join(WEB_DIR, category)
  const introPath = path.join(categoryDir, 'intro.md')
  const config = CATEGORIES[category]
  
  if (!fs.existsSync(introPath)) {
    console.log(`⚠️  ${category}/intro.md 不存在，跳过`)
    return
  }
  
  // 获取该分类下所有 md 文件（排除 intro.md）
  const files = glob.sync('*.md', {
    cwd: categoryDir,
    ignore: ['intro.md']
  }).sort()
  
  // 生成链接列表
  const links = files.map(file => {
    const title = getFileTitle(path.join(categoryDir, file))
    const link = `/${category}/${file.replace('.md', '')}`
    return `- [${title}](${link})`
  })
  
  const linksContent = links.length > 0 ? links.join('\n') : config.defaultDesc
  
  // 读取 intro.md 内容
  let content = fs.readFileSync(introPath, 'utf-8')
  
  // 查找并替换对应 section 的内容
  const sectionRegex = new RegExp(
    `(${escapeRegex(config.title)}\\n)([\\s\\S]*?)(?=\\n##|\\n---|$)`,
    'm'
  )
  
  if (sectionRegex.test(content)) {
    content = content.replace(sectionRegex, `$1${linksContent}\n\n`)
  } else {
    // 如果没有找到对应 section，在第一个 ## 之前插入
    const insertPosition = content.search(/\n##/)
    if (insertPosition !== -1) {
      const insertContent = `\n${config.title}\n${linksContent}\n\n`
      content = content.slice(0, insertPosition) + insertContent + content.slice(insertPosition)
    } else {
      // 如果没有任何 ##，在文件末尾添加
      content = content.trimEnd() + `\n\n${config.title}\n${linksContent}\n\n`
    }
  }
  
  // 写回文件
  fs.writeFileSync(introPath, content, 'utf-8')
  console.log(`✅ 已更新 ${category}/intro.md (共 ${files.length} 篇文章)`)
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 主函数
function main() {
  console.log('🔄 开始更新 intro.md...\n')
  
  for (const category of Object.keys(CATEGORIES)) {
    updateIntro(category)
  }
  
  console.log('\n✨ 更新完成!')
}

main()
