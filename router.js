var express = require('express')
var User = require('./models/user.js')
var md5 = require('blueimp-md5')
var Topic = require('./models/Topic.js')

var router = express.Router()


router.get('/', function(req, res, next) {
    // Topic.find(function(err, user) {
    //     if (err) {
    //         next(err)
    //     }
    //     res.render('index.html', {
    //         user: req.session.user, //通过登录赋予session用户信息
    //         topic: user
    //     })

    //     // console.log(user)
    //     // for (var i = 0; i < user.length; i++) {
    //     //     res.render('index.html', {
    //     //         user: req.session.user, //通过登录赋予session用户信息
    //     //         topic: user[i]

    //     //     })
    //     // }
    // })

    //实现分页
    const page = Number.parseInt(req.query.page, 10) //获取当前页页数
    const pageSize = 6 //定义每页显示的数据量
    Topic
        .find() //查询所有信息
        .skip((page - 1) * pageSize) //跳过前(page - 1) * pageSize条，直接从(page - 1) * pageSize + 1开始
        .limit(pageSize) //只截取6条
        .exec((err, user) => {
            if (err) {
                return next(err)
            }
            Topic.count((err, count) => {
                if (err) {
                    return next(err)
                }
                const totalPage = Math.ceil(count / pageSize) // 总页码 = 总记录数 / 每页显示大小，向下取整
                res.render('index.html', {
                    user: req.session.user, //登录状态信息
                    topic: user, //将用户数渲染到页面
                    totalPage, //总页数
                    page, //当前页数
                })
            })
        })
})

router.get('/login', function(req, res) {
    res.render('login.html')
})

router.post('/login', function(req, res, next) {
    // console.log(req.body)
    var body = req.body
    User.findOne({
        email: body.email,
        //密码要获取加密后的密码
        password: md5(md5(body.password))
    }, function(err, user) {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: err.message
            // })
            //将该错误传至app.js处理错误请求,next到下个请求函数
            next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: '用户名或者密码错误'
            })
        }
        //读取完后将用户数据存储至session，注意位置
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

router.get('/register', function(req, res) {
    res.render('register.html')
})

router.post('/register', function(req, res, next) {
    var body = req.body
    User.findOne({
        $or: [
            { email: body.email },
            { nickname: body.nickname }
        ]
    }, function(err, data) {
        if (err) {
            // return res.status(500).json({
            //     // err_code: 500,
            //     success: false,
            //     message: 'Internal error...'
            // })
            next(err)
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            })
        }

        //MD5层数越多，加密性越好
        // body.password = md5(md5(body.password) + 'dongyi')
        body.password = md5(md5(body.password))


        new User(body).save(function(err, user) {
            if (err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal error...'
                // })
                next(err)
            }

            //注册成功，接收用户数据
            req.session.user = user

            //服务端异步请求重定向无用,只针对同步请求才有效
            // res.redirect('/')
            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
        })
    })
})

router.get('/logout', function(req, res) {
    //清除登录状态
    req.session.user = null
    //重定向
    res.redirect('/login')
})

router.get('/topics/new', function(req, res) {
    res.render('./topic/new.html', {
        user: req.session.user //模板引擎，判断是否有当前账户登录
    })
})

router.post('/topics/new', function(req, res, next) {
    var body = req.body
    new Topic(body).save(function(err, topic) {
        if (err) {
            next(err)
        }
        req.session.topic = topic
        // console.log(req.session)
        res.redirect('/')
    })
})

router.get('/topics/show', function(req, res) {
    var query = req.query
    Topic.findOne({ _id: query.id }, function(err, data) {
        if (err) {
            console.log('err')
        }
        res.render('./topic/show.html', {
            topic: data
        })
    })

})

router.get('/settings/profile', function(req, res) {
    res.render('./settings/profile.html', {
        user: req.session.user
    })
    // console.log(req.query)
})

router.post('/settings/profile', function(req, res, next) {
    var body = req.body
    // body.birthday = body.birthday + ''
    // console.log(body.birthday)

    //🔺锁定保存后的数据加{ new: true }
    User.findOneAndUpdate({ _id: req.session.user._id }, body, { new: true }, function(err, data) {
        if (err) {
            next(err)
        }
        // console.log(Date.now())

        req.session.user = data
        // console.log(res.query)

        res.json({
            err_code: 0
        })

    })
})
module.exports = router