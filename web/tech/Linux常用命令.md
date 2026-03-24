# 常用的命令做记录 <Badge type="info" text="default" />

---   

### 1.文件搜索与内容处理

* **全局搜索，忽略大小写，忽略掉没有权限的目录**  
`sudo find / -iname "*keyword*" 2>/dev/null`  

* **全局搜索包含特定字符串的文件内容**  
`grep -rnw "." -e "search_term"`  
参数含义：-r 递归, -n 行号, -w 全字匹配

* **查找最近24小时内修改过的文件**  
`find . -mtime -1`  

* **清理当前目录下所有 .DS_Store 文件**  
`find . -name ".DS_Store" -delete`  

* **统计当前目录下文件大小**  
`du -sh *`

* **查看目录占用大小并排序**  
`du -sh */ | sort -rh`

---

### 2.网络与端口调试 (Networking)

在排查服务启动失败（如 address already in use）时最常用。
* **查询指定端口被哪个进程占用：**  
  `lsof \-i :8080`
  *(提示：-i 表示网络，后面直接跟冒号和端口号)*
  
* **查看所有监听状态的端口 (macOS 推荐)：**  
  `netstat \-ant | grep LISTEN`

* **测试远程端口是否开启 (代替 telnet)：**    
  `nc \-vz 127.0.0.1 8080`
  *(参数 \-z 表示扫描而不发送数据，-v 是详细输出)*

* **按名称模糊搜索并杀掉进程**  
`pkill -9 -f "keyword"`

* **查看资源占用情况**  
`top -o cpu`   macOS 按 CPU 排序  
`top -o mem`  macOS 按内存 排序
