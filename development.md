# Webase-ide开发文档

## 1、开发环境搭建

### 1.1 依赖环境

| 环境     | 版本              |
| ------   | ---------------  |
| nodejs   | 1.8及以上         |

nodejs下载地址：https://nodejs.org/en/download/

### 1.2 安装依赖包

#### 1.2.1 拉取代码

> 执行命令：

    git clone https://github.com/xyzshen/webase-ide

将代码放在你的工作目录，例如：D：\project

> 切换到项目目录：

    cd D:\project\webase-ide

> 使用命令：

    npm install 

下载依赖包

> 修改依赖：

   在node_modules中找到依赖包`require-from-string`，修改`index.js`文件第2行

   	var Module = require("module");

   改为

   	var Module = module.constructor;


### 1.3 启动项目

> 在项目根目录使用命令：

    npm run dev

> 控制台出现：

    Listening at http ://localhost:8080

> 在浏览器输入"http ://localhost:8080"。

> 默认端口是8080，可在config文件夹index.js中修改。

## 2、项目打包部署

### 2.1 项目打包

> 切换到项目根目录，执行命令：

    npm run build

> 进行打包，生成打包文件dist，在项目根目录下。
