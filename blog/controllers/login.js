const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body
    const user  = await User.findOne({username: username}).lean()

    const verified = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if(!(user && verified)){
        return response.status(401).json({error: 'Username or Password is Incorrect'})
    }

    const tokenID = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(tokenID, config.SECRET)

    response.status(200).send({token,  username: user.username, name: user.name}) //Bearer moment
})

module.exports = loginRouter