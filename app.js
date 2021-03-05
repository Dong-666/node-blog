var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router.js')
var session = require('express-session')

var app = express()


//配置session中间件
app.use(session({
	//自定义字符串来对sessionid进行加密处理，避免出现相同的sessionid
    secret: 'dong yi',
    //
    resave: false,
    //无论是否使用了session，设置为true都会默认都会给予钥匙(sessionid)
    saveUninitialized: false
}))

//开放静态资源
app.use("/node_modules", express.static(path.join(__dirname, './node_modules/')))
app.use("/public", express.static(path.join(__dirname, './public/')))

//配置模板引擎
//模板默认渲染后缀名
app.engine('html', require("express-art-template"))
//模板默认路径
app.set('/views', path.join(__dirname, './views/'))

//引用中间件,配置post表单请求体中间件时一定要在挂载路由之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//挂载路由
app.use(router)

//处理错误页面
app.use(function(req,res){
	res.render('404.html')
})

//配置全局错误处理🔺中间件,四个参数缺一不可
app.use(function(err,req,res,next){
	res.status(500).json({
		err_code: 500,
		message: err.message
	})
})

//开放端口
app.listen(3000, function() {
    console.log('server is running...')
})