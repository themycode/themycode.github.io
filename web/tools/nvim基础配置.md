# nvim 配置记录

## 安装

### Windows系统配置
1. 安装nvim,最快捷方便的方法 `scoop install nvim` 
2. 安装 Lazy插件: `git clone  https://github.com/folke/lazy.nvim.git ~/.local/share/nvim/lazy.nvim`
3. 在`~/.config/nvim/init.lua`中配置Lazy:
```lua

```lua
require('lazy').setup({
  --插件列表
  {'nvim-lua/penary.nvim'},
  {'nvim-telescope/telescope.nvim'},
})  
``` 

4. 启动 Neovim, Lazy会自动安装插件
5. 常用命令:
  - :Lazy 打开 Lazy管理界面
  - :Lazy sync 插件同步
  - :Lazy update 更新插件
