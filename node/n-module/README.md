#### n命令安装升级node
* 安装n模块
```

npm install -g n

```
* 安装最新的版本的node
```

sudo n latest 

```
* 安装稳定版本的node
```

node stable

```

* 删除n命令安装的node版本
```

# 例如：删除node版本11.3.0
sudo n rm 11.3.0

```
* 使用n命令切换node版本
```

sudo n 
然后使用键盘上下箭头移动，回车确定

```

#### nvm命令安装升级node
* nvm命令
```
nvm install stable

nvm install 10.13.0

// 远程服务器所有可用node版本
nvm ls-remote

// 切换到10.13.0版本
nvm use 10.13.0

// 切换到最新的版本
nvm use node

// 列出所有已经安装的版本
nvm ls
```