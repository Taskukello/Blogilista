
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs.map(Blog.format))
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)

        const currentBlog = await Blog.findById(request.params.id)

        if (decodedToken.id.toString() != currentBlog.user.toString()) {
            return response.status(400).json({ error: "Shame on you! This blog doesn't belong to you!" })
        }

        await Blog.findByIdAndRemove(request.params.id)
        const user = await User.findById(decodedToken.id)
        user.blogs = user.blogs.remove(currentBlog._id)
        await user.save()
        response.status(204).end()
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(400).send({ error: 'invalid id' })
        }
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(Blog.format(updatedBlog))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'invalid id' })
        })
})


blogsRouter.post('/', async (request, response) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missin or invalid' })
        }
        const body = request.body
        if (body.title === undefined) {
            return response.status(400).json({ error: 'title missing' })
        } if (body.author === undefined) {
            return response.status(400).json({ error: 'author missing' })
        } if (body.url === undefined) {
            return response.status(400).json({ error: 'url missing' })
        }

        const user = await User.findById(decodedToken.id)
        if (body.likes === undefined) {
            body.likes = 0
        }
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })


        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(Blog.format(blog))
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong...' })
        }
    }
})



module.exports = blogsRouter