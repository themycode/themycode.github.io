# pixi 和 uv 的使用与配置

## 安装

### pixi/uv
- 安装pixi ` scoop install pixi`
- 安装uv `scoop install uv`

### 常见设置
1. pixi需要设置环境变量, 使其安装的全局语言解释器可以使用`%USERPROFILE%\.pixi\bin`, 默认pixi安装在~/.pixi/bin目录下
2. pixi查看安装的工具`pixi global list`
3. pixi全局安装`pixi global install python`

### uv的使用记录
1. **uv提供的强大的功能,比如想在项目下检查代码`uvx ruff check .` , 这样可以在项目下运行,不占用空间影响环境,针对不同的项目可以根据项目来运行 `uv add --dev ruff`**
2. ruff使用
   1. 临时使用: 直接`uvx ruff format .`
   2. 项目中长期使用: 在项目中`uv add --dev ruff`,然后会在项目根目录放一个ruff.toml
3. 更改uv缓存目录, 在命令行临时设置`$env:UV_CACHE_DIR = "D:\uv_cache"`,永久生效添加环境变量 `UV_CACHE_DIR`,然后设置路径
4. 空间清理命令
   1. 清理不再使用的旧版本缓存: uv cache prune
   2. 清理所有缓存: uv cache clean
5. uv 使用节省空间方式, `uv sync --link-mode hardlink`,或者在全局配置文件中设置(~/.python/uv/config.toml),设置config.toml中写入`link-mode = "hardlink"`,也可以使用离线模式 `uv sync --offline`

### uv项目中使用
#### **uv 项目使用**
1. 初始化 `uv init `
2. 创建环境 `uv venv --python 3.12`
3. 添加依赖 `uv add pandas requests`
4. 进阶技巧：如果你懒得手动加依赖
如果你代码里的 import 太多了，不想一个一个 uv add，可以先让工具帮你扫描一下。
  1. 安装 pipreqs（临时运行）：
  `uvx pipreqs . --force`
这会扫描你的 .py 文件并自动生成一个 requirements.txt。

  2. 一次性导入到 uv：
  `uv add -r requirements.txt`
5. 环境验证, 查看python路径
   `uv run which python`
6. 在项目中运行脚本
   `uv run script.py`



这份文档旨在为你构建一套基于 **Pixi（全局基础设施）** 与 **uv（项目执行专家）** 的高效开发流。考虑到你拥有两台不同年代的设备（2015 MacBook 和 10 年老台式机），这套方案将重心放在了**磁盘空间优化**与**环境一致性**上。

# ---

**🚀 现代 Python 开发环境指南 (2026 版)**

## **一、 核心架构：双剑合璧**

为了实现系统级的纯净与项目级的高效，我们采用以下分工：

* **Pixi (全局管家)**：负责安装 Python 解释器、Git、Node.js 及常用的 Rust 命令行工具（CLI）。  
* **uv (项目尖刀)**：负责管理具体项目的依赖、虚拟环境及运行脚本。

## ---

**二、 Pixi：全局基础设施管理**

### **1\. 基础配置**

确保使用 **Scoop** 安装 Pixi 以便统一管理软件生命周期：

PowerShell

scoop install pixi

### **2\. 全局工具清单**

通过 Pixi 安装开发必备的底层运行时。这些工具会进入全局缓存，多个项目共享，不占额外空间。

PowerShell

\# 安装核心语言环境  
pixi global install python=3.12 git uv

\# 安装终端增强工具 (Rust 编写)  
pixi global install bat eza zoxide ripgrep

### **3\. 常用维护命令**

* **查看已装工具**：pixi global list  
* **更新所有工具**：pixi global upgrade-all  
* **清理过期缓存 (MacBook 必做)**：pixi clean cache

## ---

**三、 uv：项目级极速管理**

### **1\. 初始化一个新项目（或重置旧项目）**

当你进入一个只有 .py 脚本的目录，或想重构旧环境时：

PowerShell

\# 初始化项目配置文件 (生成 pyproject.toml)  
uv init

\# 关联 Pixi 的 Python 创建虚拟环境  
uv venv \-\-python 3.12

### **2\. 依赖管理**

uv 不会重复下载包，它通过硬链接（Hardlink）引用缓存，极大地节省了 250GB 硬盘的空间。

PowerShell

\# 添加生产依赖 (如量化库)  
uv add pandas numpy matplotlib

\# 添加开发工具 (如 Ruff)  
uv add \-\-dev ruff

\# 同步环境 (当你修改了配置文件或在 MacBook 上拉取了代码)  
uv sync

### **3\. 运行与脚本**

* **运行脚本**：uv run main.py（自动激活虚拟环境运行）。  
* **临时运行工具**：uvx ruff check .（无需安装，直接运行最新版工具）。

## ---

**四、 插件与工具配置**

### **1\. Tabby 终端设置**

为了让你的 **Tabby** 飞起来，建议在配置文件中添加以下 Alias（别名）：

PowerShell

\# 编辑 PowerShell 配置文件: notepad $PROFILE  
\# 快速跳转  
alias ls\='eza \--icons'  
alias cd\='z'

\# 一键清理双重缓存  
function cleanup-all {  
    pixi clean cache  
    uv cache prune  
}

### **2\. VS Code / Cursor 插件配置**

为了配合这套流程，建议安装以下扩展：

* **Python (Microsoft)**：在右下角解释器选择器中，指向项目目录下的 .venv\\Scripts\\python.exe。  
* **Ruff (Astral Software)**：  
  * **设置**：在 settings.json 中开启 editor.formatOnSave: true。  
  * **优势**：它能完美替代 Flake8 和 Black，且速度快 10-100 倍。

### **3\. 缓存位置优化（针对 MacBook）**

如果你想精确控制 uv 的缓存位置（例如统一放在用户目录下）：

PowerShell

\# 在环境变量中设置  
$env:UV\_CACHE\_DIR \= "$HOME\\.cache\\uv"

## ---

**五、 每日工作流建议**

1. **开启新任务**：cd project \-\> uv sync  
2. **写代码**：在 Tabby 中使用 vi 或在 VS Code 中编写。  
3. **运行实验**：uv run strategy.py  
4. **定期瘦身**：每周运行一次 cleanup-all。

\[\!TIP\]

**注意顺序**：如果在 Tabby 里提示找不到 python，请检查 where.exe python 是否指向了 \\.pixi\\bin\\python.exe。如果被 WindowsApps 拦截，请在“应用执行别名”中关闭微软自带的 Python 选项。