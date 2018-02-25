const mongoose = require('mongoose')
require('dotenv').config()


const Blog = mongoose.model('Blog', {
    title: String,
    author: String,
    url: String,
    likes: Number
})

module.exports = Mongoose