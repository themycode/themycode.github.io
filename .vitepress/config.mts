import { defineConfig } from 'vitepress'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 加载最新文章数据
function getLatestPostsData() {
  // 开发时从 web 目录读取
  const webDataPath = path.join(__dirname, '..', 'web', 'latest-posts.json')
  if (fs.existsSync(webDataPath)) {
    return JSON.parse(fs.readFileSync(webDataPath, 'utf-8'))
  }
  return { categories: [] }
}

// 自动生成 sidebar 的函数
function getAutoSidebar(dir: string, title: string) {
  const files = glob.sync(`web/${dir}/**/*.md`, {
    ignore: [`web/${dir}/intro.md`],
  })

  const items = files
    .map((file) => {
      const link = file.replace('web', '').replace('.md', '')
      // 从文件名或 frontmatter 获取显示名称
      const fileName = path.basename(file, '.md')
      return {
        text: fileName,
        link,
      }
    })
    .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))

  return [
    {
      text: title,
      collapsed: false,
      items: [{ text: '📖 开始阅读', link: `/${dir}/intro` }, ...items],
    },
  ]
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  srcDir: 'web',
  base: '/',

  title: '💻 Code & Think 🚀',
  description: '极客的编程笔记 | Code More, Think More',

  // 页面数据转换 - 为首页注入最新文章数据
  transformPageData: (pageData) => {
    if (pageData.relativePath === 'index.md') {
      return {
        latestPosts: getLatestPostsData(),
      }
    }
    return {}
  },

  // 构建设置
  buildEnd: async () => {
    // 构建完成后生成最新文章数据
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    try {
      await execAsync('node scripts/generate-latest-posts.js', {
        cwd: path.join(__dirname, '..'),
      })
      console.log('✅ 已生成 latest-posts.json')

      // 生成 sitemap
      await execAsync('node scripts/generate-sitemap.js', {
        cwd: path.join(__dirname, '..'),
      })
      console.log('✅ 已生成 sitemap')
    } catch (e) {
      console.error('构建失败:', e)
    }
  },

  themeConfig: {
    // 暗色主题配置
    appearance: 'dark',

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    // 导航菜单
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '💡 技术', link: '/tech/intro' },
      { text: '📚 算法', link: '/algorithm/intro' },
      { text: '🛠️ 工具', link: '/tools/intro' },
      { text: '✨ 生活', link: '/life/intro' },
      { text: '📖 关于', link: '/about' },
    ],

    // 侧边栏配置 - 使用 glob 动态生成
    sidebar: {
      '/tech/': getAutoSidebar('tech', '💡 技术文章'),
      '/algorithm/': getAutoSidebar('algorithm', '📚 算法题解'),
      '/tools/': getAutoSidebar('tools', '🛠️ 开源工具'),
      '/life/': getAutoSidebar('life', '✨ 生活随笔'),
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/themycode' }],

    // 页脚配置
    footer: {
      message: 'Made with ❤️ by Code & Think',
      copyright: `Copyright © ${new Date().getFullYear()} All Rights Reserved`,
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/themycode/themycode.github.io/edit/master/web/:path',
      text: '📝 编辑此页',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    // 返回顶部按钮
    returnToTopLabel: '↑ 回到顶部',
  },
})
