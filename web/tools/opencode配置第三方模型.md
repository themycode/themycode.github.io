# opencode 配置第三方模型

## 安装部署

### 安装
- Node.js
```bash
npm isntall -g opencode-ai # npm
bun install -g opencode-ai # bun
pnpm install -g opencode-ai # pnpm
```
- Macos & Linux
```bash
brew install anomalyco/tap/opencode
```
- Windows
```bash
choco install opencode # choco
scoop install opencode # scoop
```

### 配置文件
- 配置第三方模型的ID， 执行`opencode auth login`
- 选择other，然后输入provider id， 输入模型的key
- 然后在`~/.config/opencode/`,创建一个opencode.json文件，输入以下内容
```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "local",
      "options": {
        "baseURL": "https://api.scnet.cn/api/llm/v1",
      },
      "models": {
        "DeepSeek-V3.2": { "name": "DeepSeek-V3.2" },
        "MiniMax-M2.5": { "name": "MiniMax-M2.5" },
        "Qwen3-30B-A3B-Instruct-2507":{"name":"Qwen3-30B-A3B-Instruct-2507"},
        "Qwen3-235B-A22B-Thinking-2507":{"name":"Qwen3-235B-A22B-Thinking-2507"}
      }
    }
  }
}
```
- 然后重新打开模型，检查是否可以使用
  
- 注意事项：在第一步填写的provider id，在配置文件中对应的provider的key不要填错！


### 基础命令
- 模型切换 switch model `ct + x m`
- 切换绘画 switch session `ct + x l`
- tab 切换模型的模式，ask/plan
- 常用命令 `ct + p` 