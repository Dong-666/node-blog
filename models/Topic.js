var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost:27017/forum', { useNewUrlParser: true, useUnifiedTopology: true })

var topicSchema = {
    title: {
        type: String,
        default: '',
    },
    article: {
        type: String,
        default: '',
    },
    userId: {
        type: String,
    },
    type: {
        type: String
    },
}

module.exports = mongoose.model('Topic', topicSchema)