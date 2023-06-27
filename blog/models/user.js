const mongoose = require('mongoose')
const logger = require('../utils/logger')
const config = require('../utils/config')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    name: String,
    passwordHash: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User