const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        if (body.password.length < 3) {
            return response.status(400).json({ error: 'password is too short!' })
        }

        const users = await User.find({})
        if (users.find(r => r.username === body.username)) {
            return response.status(400).json({ error: 'username is already in use!' })
        }

        if (body.adult === undefined) {
            body.adult = true
        }


        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            adult: body.adult
        })

        const savedUser = await user.save()

        response.json(User.format(savedUser))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, url: 1 })

    response.json(users.map(User.format))
})




module.exports = usersRouter