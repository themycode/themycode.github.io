# 🚀 OpenClaw 操作指南

> - 环境信息：Ubuntu Server | 版本：2026.3.2
> - 核心用途：本地 LLM 网关与多渠道集成
> - 软件环境：

      *后端： 用Ollama或vLLm 运行开源模型（deepseek、qwen等）
      模型管理层： LiteLLm Proxy
      前端： OpenClaw 链接LiteLLM*

## 🛠️ 插件与渠道管理

### 1. qqbot配置机器人

#### **qq机器人：**[https://q.qq.com/qqbot/openclaw/index.html](https://q.qq.com/qqbot/openclaw/index.html)

- 安装插件:

```bash
    openclaw plugins install @sliverp/qqbot@latest`
    openclaw channels add --channel qqbot --token   "token"`
```

### openclaw 获取令牌

unauthorized: too many failed authentication attempts (retry later)获取最新令牌
`openclaw dashboard --no-open`

### ssh 反代理

`ssh -N -L 18789:127.0.0.1:18789 -p2222 echo@192.168.110.1`

### gateway 局域网访问配置

```json
"gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "controlUi": {
      "allowedOrigins": [
        "http://localhost:18789",
        "http://127.0.0.1:18789",
        "http://192.168.110.1:18789"
      ]
    },
    "auth": {
      "mode": "token",
      "token": "xxxx"
    },
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    },
    "nodes": {
      "denyCommands": [
        "camera.snap",
        "camera.clip",
        "screen.record",
        "contacts.add",
        "calendar.add",
        "reminders.add",
        "sms.send"
      ]
    }
  }
```

### **自定义模型和外网第三方模型配置**

```json
 "models": {
        // mode: 配置合并模式。"merge" 表示将此处的配置与全局默认配置合并，而不是完全覆盖。
    "mode": "merge",
    "providers": {
        // --- 第三方服务配置 (远程 API) ---
        "claude-code": {
            // baseUrl: 远程 API 的访问地址，这里通过中转接口接入 Claude。
            "baseUrl": "https://www.openai.com/api/v1",
            // apiKey: 你的访问令牌（通行证），用于身份校验。
            "apiKey": "sk-xxx",
            // api: 协议类型。anthropic-messages 表示使用 Claude 特有的对话格式。
            "api": "anthropic-messages",
            "models": [
                {
                    // id: 传给 API 的原始模型名称。
                    "id": "claude-haiku-4-5-20251001",
                    // name: 在 OpenClaw 界面上显示给用户看的友好名称。
                    "name": "Claude Haiku 4.5"
                }
            ]
        },
        // --- 本地模型配置 (通过 LiteLLM 代理) ---
        "vllm": {
            // baseUrl: 指向你本地运行的 LiteLLM 服务端口（4000）。
            "baseUrl": "http://127.0.0.1:4000/v1",
            // apiKey: 因为是本地自建服务，通常填 sk-none 或自定义即可。
            "apiKey": "sk-none",
            // api: 协议类型。openai-responses 表示遵循标准的 OpenAI 聊天接口协议。
            "api": "openai-responses",
            "models": [
                {
                    // id: 对应 LiteLLM config.yaml 里的 model_name。
                    "id": "qwen-coder-local",
                    "name": "qwen-coder-local",
                    // reasoning: 是否开启深度思考/推理链显示。Qwen 1.5B 属于常规模型，选 false。
                    "reasoning": false,
                    // input: 接受的输入类型。
                    "input": ["text"],
                    // cost: 计费设置。因为是本地运行，所有消耗设为 0（免费）。
                    "cost": {
                        "input": 0,
                        "output": 0,
                        "cacheRead": 0,
                        "cacheWrite": 0
                    },
                    // contextWindow: 允许的最大上下文长度。虽然设为 128k，但 8G 内存建议实测时保持警惕。
                    "contextWindow": 128000,
                    // maxTokens: 单次回复允许生成的最大长度。2048 是个稳健的选择。
                    "maxTokens": 2048
                },
                {
                    // 第二个本地模型：DeepSeek-R1 推理模型。
                    "id": "deepseek-r1-local",
                    "name": "local deepseek r1"
                }
            ]
        }
    }
    },
    "agents": {
        "defaults": {
            // 模型路由配置：定义 Agent 优先使用谁，以及失败后的替补方案
            "model": {
                // primary: 默认启动模型。
                // 选 Qwen-Coder 1.5B 是明智的，因为它在你 8GB 内存上加载极快。
                "primary": "vllm/qwen-coder-local",

                // fallbacks: 备选模型列表（按顺序尝试）。
                // 如果本地 Qwen 崩溃或 OOM（内存溢出），会自动尝试 DeepSeek，最后求助于云端 Claude。
                "fallbacks": [
                    "vllm/deepseek-r1-local",
                    // 这个名称对应的是agent中的模型前缀！！！
                    "claude-code/claude-haiku-4-5-20251001"
                ]
            },

            // 活跃模型池：只有出现在这里的模型，Agent 才有权调用。
            // 格式为 "供应商ID/模型ID": {局部参数微调}
            "models": {
                "vllm/qwen-coder-local": {},
                "vllm/deepseek-r1-local": {},
                "claude-code/claude-haiku-4-5-20251001": {}
            },

            // 上下文剪裁：决定如何清理过期的对话历史，防止内存被撑爆。
            "contextPruning": {
                // mode: 剪裁模式。cache-ttl 表示基于缓存生存时间。
                "mode": "cache-ttl",
                // ttl: 存活时间。1h 表示 1 小时前的对话上下文会被自动清理。
                "ttl": "1h"
            },

            // 压缩策略：当对话太长超过 contextWindow 时，Agent 如何“总结”前面的内容。
            "compaction": {
                // mode: safeguard 是一种保护模式。
                // 它会在接近内存极限时强制进行摘要压缩，确保程序不崩溃。
                "mode": "safeguard"
            },

            // 心跳检查：Agent 的自我状态监测。
            "heartbeat": {
                // every: 频率。每 30 分钟检查一次后台 Provider（如 LiteLLM）是否还在工作。
                "every": "30m"
            }
        }
}


agent/auth-profiles.json 配置

{
  "version": 1,
  "profiles": {
    "anthropic:default": {
      "type": "api_key",
      "provider": "anthropic",
      "anthropicAuthToken": "sk-xxxx",
      "anthropicBaseUrl": "https://www.oepnai.com/api/v1"
    }
  },
  "activeProfile": "default"
}
agent/models.json 配置

{
  "providers": {
    "claude-code": {
      "baseUrl": "https://www.openai.com/api/v1",
      "apiKey": "sk-xxxx",
      "api": "anthropic-messages",
      "models": [
        {
          "id": "claude-haiku-4-5-20251001",
          "name": "Claude Haiku 4.5",
          "reasoning": false,
          "input": [
            "text"
          ],
          "cost": {
            "input": 0,
            "output": 0,
            "cacheRead": 0,
            "cacheWrite": 0
          },
          "contextWindow": 200000,
          "maxTokens": 8192,
          "api": "anthropic-messages"
        }
      ]
    }
  }
}
```

---

## Ollama 安装及常用命令

### **安装部署**

**Ollama 官网：** **[https://ollama.com/](https://ollama.com/)**
**ubuntu install:** **_`curl -fsSL https://ollama.com/install.sh | sh`_**

### **使用参考**

**拉取模型**: `ollama pull deepseek-r1:7b`
**删除模型**: `ollama rm xxx`
**通过系统启动**：`sudo systemctl start ollama`
**运行模型**：`olama run deepseek-r1:7b`

> **设置模型运行方式**
> 如果部署的环境显卡太老不能使用，需要进行服务启动的时候设置，不要使用显卡,打开service `vim /etc/system/system/ollama.service `,添加如下配置使用cpu模式运行`Environment="OLLAMA_LLM_LIBRARY=cpu"`,然后在重载服务启动。
> Environment="OLLAMA_LLM_LIBRARY=cpu" # 配置cpu兼容模式 vim /etc/system/system/ollama.service  
> sudo systemctl daemon-reload # 重载服务

### **使用方法**

#### 常用命令

以下是 **Ollama 最常用命令的整理**，涵盖模型管理、运行、服务控制等核心功能，适合快速上手使用：

---

#### **一、模型管理**

| 命令                          | 说明                               | 示例                         |
| ----------------------------- | ---------------------------------- | ---------------------------- |
| `ollama pull <模型名>`        | 从仓库下载模型到本地               | `ollama pull llama2`         |
| `ollama list`                 | 列出本地已下载的模型               | `ollama list`                |
| `ollama rm <模型名>`          | 删除本地模型                       | `ollama rm llama2`           |
| `ollama cp <源模型> <新模型>` | 复制模型生成副本（用于实验或修改） | `ollama cp llama2 my-llama2` |

---

#### **二、模型运行**

| 命令                             | 说明                                         | 示例                           |
| -------------------------------- | -------------------------------------------- | ------------------------------ |
| `ollama run <模型名>`            | 启动模型并进入交互式对话                     | `ollama run llama2`            |
| `ollama run <模型名> --temp 0.7` | 运行模型时指定参数（如温度值控制生成随机性） | `ollama run gemma3 --temp 0.5` |
| `ollama chat <模型名>`           | 启动聊天模式（适用于聊天机器人模型）         | `ollama chat code-llama`       |

---

#### **三、服务控制**

| 命令                   | 说明                                | 示例                 |
| ---------------------- | ----------------------------------- | -------------------- |
| `ollama serve`         | 启动本地 API 服务（默认端口 11434） | `ollama serve`       |
| `ollama ps`            | 查看当前运行的模型实例              | `ollama ps`          |
| `ollama stop <模型名>` | 停止指定模型实例                    | `ollama stop llama2` |

---

#### **四、自定义模型**

| 命令                                    | 说明                          | 示例                                   |
| --------------------------------------- | ----------------------------- | -------------------------------------- |
| `ollama create <模型名> -f <Modelfile>` | 基于 Modelfile 创建自定义模型 | `ollama create mymodel -f ./Modelfile` |

---

#### **五、其他实用命令**

| 命令             | 说明                     | 示例                 |
| ---------------- | ------------------------ | -------------------- |
| `ollama version` | 查看 Ollama 版本         | `ollama version`     |
| `ollama help`    | 显示帮助信息             | `ollama help`        |
| `ollama logs`    | 查看运行日志（调试使用） | `ollama logs llama2` |

---

#### **快速使用示例**

1. **下载并运行模型**：
   ```bash
   ollama pull llama2 && ollama run llama2
   ```
2. **创建自定义模型**：
   ```bash
   # 创建 Modelfile
   echo "FROM llama2\nSYSTEM '你是一个编程助手'" > Modelfile
   ollama create code-helper -f Modelfile
   ollama run code-helper
   ```
3. **通过 API 调用模型**：
   ```bash
   curl http://127.0.0.1:11434/api/chat -d '{
     "model": "llama2",
     "messages": [{"role": "user", "content": "你好"}]
   }'
   ```

---

#### **参数调优（可选）**

在 `run` 或 `generate` 命令中可添加参数优化输出：

```bash
ollama run llama2 --temp 0.3 --max-tokens 500  # 降低随机性，限制输出长度
```

---

以上命令覆盖了 Ollama 的核心功能，如需更详细参数说明，可参考 https://ollama.ai/ 或通过 `ollama help <命令>` 查看具体用法。

### **API调用**

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma3",
  "messages": [{ "role": "user", "content": "Hello!" }]
}'
```

如果模型有返回就说明模型运行成功。

### **流式调用**

```python
from ollama import chat

stream = chat(
  model='qwen3',
  messages=[{'role': 'user', 'content': 'What is 17 × 23?'}],
  stream=True,
)

in_thinking = False
content = ''
thinking = ''
for chunk in stream:
  if chunk.message.thinking:
    if not in_thinking:
      in_thinking = True
      print('Thinking:\n', end='', flush=True)
    print(chunk.message.thinking, end='', flush=True)
    # accumulate the partial thinking
    thinking += chunk.message.thinking
  elif chunk.message.content:
    if in_thinking:
      in_thinking = False
      print('\n\nAnswer:\n', end='', flush=True)
    print(chunk.message.content, end='', flush=True)
    # accumulate the partial content
    content += chunk.message.content

  # append the accumulated fields to the messages for the next request
  new_messages = [{ role: 'assistant', thinking: thinking, content: content }]
```

## LiteLLM Proxy 部署

### 1. **个人配置记录**

```bash
# 新建目录
mkdir ~/litellm-server && cd ~/litellm-server
# 创建新的python虚拟环境
python3 -m venv env && source env/bin/activate
# 安装核心库（包含代理功能）
pip install 'litellm[proxy]'

```

### 2.**编写配置文件**

```YAML
model_list:
  - model_name: qwen-coder-local  # 你给 OpenClaw 用的名字
    litellm_params:
      model: ollama/qwen2.5-coder:1.5b
      api_base: "http://localhost:11434" # 连你的本地 Ollama
      tpm: 100000 # 每分钟 token 限制，防止内存瞬间撑爆

  - model_name: deepseek-r1-local
    litellm_params:
      model: ollama/deepseek-r1:7b
      api_base: "http://localhost:11434"
      num_ctx: 4096 # 8G 内存下，强烈建议限制上下文长度

  # 如果以后你申请了云端 API，直接在这里加一行即可，OpenClaw 无需改动
  # - model_name: deepseek-v3
  #   litellm_params:
  #     model: deepseek/deepseek-chat
  #     api_key: "sk-..."

litellm_settings:
  set_verbose: False # 生产环境关掉详细日志，省点 CPU

```

### 3. **服务运行**

`litellm --config config.yaml --port 4000  # 启动代理`

### 4. **服务验证**

```bash
验证是否配置成功
curl --location 'http://localhost:4000/v1/chat/completions' \
--header 'Content-Type: application/json' \
--data '{
    "model": "qwen-coder-local",
    "messages": [{"role": "user", "content": "hi"}]
}'
# 如果能看到 JSON 格式的回答，说明部署大功告成

# 使用 nohup 后台运行并记录日志
nohup litellm --config config.yaml --port 4000 > litellm.log 2>&1 &

```

### LiteLLM Proxy 官方网页

**LiteLLM: [https://docs.litellm.ai/](https://docs.litellm.ai/)**

### 1. 概述

LiteLLM Proxy 是一个开源的 **大语言模型网关**，通过统一 OpenAI 兼容 API 接口，实现 **多模型管理、路由控制、安全防护** 等核心功能。支持本地模型（如 Ollama）、云服务（OpenAI/Azure）及混合部署，适用于企业级 LLM 应用开发与管理。

---

### 2. 核心功能

#### 2.1 统一接口

- **标准化调用**：将 100+ 模型的 API 统一为 OpenAI 格式（如 `chat.completions`）
- **跨平台兼容**：支持本地 Ollama、Azure OpenAI、Anthropic Claude 等服务

#### 2.2 集中式管理

- **模型目录**：通过 `config.yaml` 定义模型别名、API 地址、认证密钥
- **权限控制**：基于 Virtual Key 的访问控制，支持速率限制（RPM/TPM）和预算管理
- **监控审计**：记录请求日志、成本统计、错误追踪

#### 2.3 高级路由

- **负载均衡**：轮询、最低延迟等策略分配请求
- **故障转移**：自动切换备用模型实例
- **语义缓存**：缓存高频请求响应，降低 API 调用成本

---

### 3. 快速部署

#### 3.1 环境要求

- Python 3.8+
- Docker（推荐生产环境）

#### 3.2 Docker 部署（推荐）

```bash
# 下载配置文件
curl -O https://raw.githubusercontent.com/BerriAI/litellm/main/docker-compose.yml

# 创建 .env 文件
echo 'LITELLM_MASTER_KEY="sk-123456"' > .env
echo 'STORE_MODEL_IN_DB="True"' >> .env

# 启动服务
docker compose -p litellm up -d
```

#### 3.3 原生安装

```bash
pip install 'litellm[proxy]'
litellm --config config.yaml --port 4000
```

---

### 4. 配置详解

#### 4.1 `config.yaml` 结构

```yaml
model_list:
  - model_name: gpt-3.5-turbo
    litellm_params:
      model: openai/gpt-3.5-turbo
      api_key: os.environ/OPENAI_API_KEY
      rate_limit: 100 # 每分钟请求数

  - model_name: ollama-llama3
    litellm_params:
      model: ollama/llama3
      api_base: http://host.docker.internal:11434

general_settings:
  database_url: postgresql://user:pass@localhost:5432/litellm
  master_key: sk-123456 # 管理员密钥
```

#### 4.2 关键参数

| 参数         | 说明               | 示例                           |
| ------------ | ------------------ | ------------------------------ |
| `model_name` | 对外暴露的模型别名 | `claude-sonnet`                |
| `api_base`   | 模型服务地址       | `http://localhost:11434`       |
| `rate_limit` | 速率限制（RPM）    | `500`                          |
| `fallbacks`  | 故障转移策略       | `[{"model": "gpt-3.5-turbo"}]` |

---

### 5. 使用场景

#### 5.1 企业级 API 网关

- **多模型路由**：根据成本/延迟动态选择 OpenAI/Gemini/Ollama
- **安全防护**：IP 白名单、请求签名验证
- **成本控制**：按团队分配预算，超支自动告警

#### 5.2 本地开发环境

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-123456",
    base_url="http://localhost:4000"  # LiteLLM Proxy 地址
)

response = client.chat.completions.create(
    model="ollama-llama3",
    messages=[{"role": "user", "content": "解释量子纠缠"}]
)
```

#### 5.3 多租户管理

- **团队隔离**：为不同团队分配独立 Virtual Key
- **资源配额**：限制每个 Key 的 API 调用频率和预算

---

### 6. 高级功能

#### 6.1 流式响应

```python
response = litellm.completion(
    model="ollama/llama3",
    messages=[{"role": "user", "content": "写一首俳句"}],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content, end="", flush=True)
```

#### 6.2 回退策略

```yaml
fallbacks:
  - priority: 1
    condition: latency > 2.0 # 延迟超过 2 秒触发
    model: gpt-3.5-turbo
  - priority: 2
    condition: error_rate > 0.1
    model: ollama/mistral
```

#### 6.3 监控仪表盘

访问 `http://localhost:4000/ui` 查看：

- 实时请求统计
- 模型使用率热力图
- 错误日志分析

---

### 7. 最佳实践

1. **生产环境建议**
   - 使用 PostgreSQL 持久化数据
   - 配置 HTTPS 反向代理（如 Nginx）
   - 定期备份数据库

2. **性能优化**

   ```yaml
   router_settings:
     enable_cache: true
     cache_ttl: 300 # 缓存有效期（秒）
     batch_size: 5 # 并行请求数
   ```

3. **安全加固**
   - 启用双因素认证
   - 限制管理接口 IP 访问
   - 定期轮换 `master_key`

---

### 8. 常见问题

#### Q1: 如何迁移现有模型？

```bash
# 导出现有配置
litellm export-config > legacy_config.yaml

# 转换为新格式
litellm convert-config legacy_config.yaml
```

#### Q2: 如何监控 API 成本？

通过管理界面查看 `Cost Analytics` 面板，或使用 Prometheus 导出指标：

```promql
sum(rate(litellm_requests_total[5m])) by (model)
```

---

### 9. 参考资料

- https://github.com/BerriAI/litellm
- https://github.com/BerriAI/litellm-config-examples
- https://docs.litellm.ai/docs/proxy/deployment

---

本网页覆盖 LiteLLM Proxy 的核心功能与典型用法，如需更详细的技术细节，可参考官方文档或通过社区论坛获取支持。
