var mongoose = require('mongoose')

//连接数据库
mongoose.connect('mongodb://localhost:27017/forum', {useNewUrlParser: true, useUnifiedTopology: true})

var Schema = mongoose.Schema
var userSchema = new Schema({
    //邮箱
    email: {
        type: String,
        require: true
    },
    //昵称
    nickname: {
        type: String,
        require: true
    },
    //密码
    password: {
        type: String,
        require: true
    },
    //创建时间
    created_time: {
        type: Date,
        //使用Date.now而不是用Date.now()，避免一加载就直接调用该函数
        default: Date.now
    },
    //最后发表时间
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    //个人简介
    bio: {
        type: String,
        default: " "
    },
    //生日
    birthday: {
        type: Date,
    },
    //性别
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    //头像
    avater: {
        type: String,
        default: "../public/img/avatar-default.png"
    },
    //状态
    status: {
        type: Number,
        //0:任意权限
        //1：不能评论
        //2：不能登录
        enum: [0, 1, 2],
        default: 0
    }
})

//导出
module.exports = mongoose.model('User', userSchema)