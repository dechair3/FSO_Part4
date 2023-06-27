const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1,author: 1, url: 1, likes: 1, id:1})
    response.json(users)
})
usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    if(!(username.length > 3 && name.length > 3)){
        return response.status(400).json({'error' : 'Username or Name did not meet length requirements'})
    }
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

})

module.exports = usersRouter