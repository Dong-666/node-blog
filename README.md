# 简介

基于b站[周老师](https://www.bilibili.com/video/BV1Ns411N7HU)的教程搭建而来，添加了发表帖子和修改账户功能，以及在首页添加了帖子分页效果

# 技术

使用Express框架搭建node服务器，数据库采用MongoDB

使用bootstrap以及jquery搭建页面

art-template模板引擎以及搭配express-art-template渲染前端页面

body-parse插件解析客户端发送过来的请求体

blueimp-md5进行用户密码加密

express-session存储关于用户会话（session）

# 起步

安装插件

```bash
npm i
```

启动服务

```bash
node app.js
```

浏览器输入

```
http://localhost:3000/
```

