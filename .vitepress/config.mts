import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  srcDir: 'web',

  title: '💻 Code & Think 🚀',
  description: '极客的编程笔记 | Code More, Think More',

  // 搜索配置
  search: {
    provider: 'local',
  },

  themeConfig: {
    // 暗色主题配置
    appearance: 'dark',

    // 导航菜单
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '💡 技术', link: '/tech/intro' },
      { text: '📚 算法', link: '/algorithm/intro' },
      { text: '🛠️ 工具', link: '/tools/intro' },
      { text: '✨ 生活', link: '/life/intro' },
      { text: '📖 关于', link: '/about' },
    ],

    // 侧边栏配置
    sidebar: {
      '/tech/': [
        {
          text: '💡 技术文章',
          collapsed: false,
          items: [
            { text: '开始阅读', link: '/tech/intro' },
            { text: 'Markdown Examples', link: '/markdown-examples' },
          ],
        },
      ],
      '/algorithm/': [
        {
          text: '📚 算法题解',
          collapsed: false,
          items: [
            { text: '开始学习', link: '/algorithm/intro' },
            { text: 'Runtime API Examples', link: '/api-examples' },
          ],
        },
      ],
      '/tools/': [
        {
          text: '🛠️ 开源工具',
          collapsed: false,
          items: [{ text: '工具导览', link: '/tools/intro' }],
        },
      ],
      '/life/': [
        {
          text: '✨ 生活随笔',
          collapsed: false,
          items: [{ text: '生活记录', link: '/life/intro' }],
        },
      ],
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
