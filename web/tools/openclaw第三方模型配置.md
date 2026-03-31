# openclaw第三方模型配置

## 直接修改openclaw.json文件最方面
```json
"models": {
    "mode": "merge",
    "providers": {
      "local": {
        "baseUrl": "https://api.scnet.cn/api/llm/v1",
        "apiKey": "您的模型API Key",
        "api": "openai-completions",
        "models": [
          {
            "id": "MiniMax-M2.5",
            "name": "MiniMax-M2.5",
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
            "contextWindow": 128000,
            "maxTokens": 16000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "local/MiniMax-M2.5"
      },
      "models": {
        "local/MiniMax-M2.5": {}
      },
    }
  },
```