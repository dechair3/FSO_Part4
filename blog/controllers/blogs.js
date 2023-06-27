const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


blogsRouter.get('/',  async (request, response) => {
    const blogs = await Blog
    .find({})
    .populate("user", {
      username: 1,
      name: 1,
      id: 1
    })
    .exec()
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, config.SECRET)
    if(!(decodedToken)){
      response.status(400).json({'error' : 'Invalid Token'}).end()
    }
    else if(!(body.author || body.url)){
      response.status(400).end()
    }

    else{
      let blog = new Blog(body)
      const user = request.user

      blog.user = user._id
      const updatedUser = {...user, blogs: user.blogs.concat(blog._id)}
      await User.findByIdAndUpdate(user._id, updatedUser)

      blog = await blog.populate('user', {id : 1, username: 1, name: 1})
      await blog.save()
      response.status(201).json(blog)
    }
})
blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const token = request.token
  const blog = await Blog.findById(blogId)
  const decodedToken = jwt.verify(token, config.SECRET)

  if(!(decodedToken)){
    return response.json({'error' : 'Invalid Token'})
  }
  if(decodedToken.id ===  blog.user[0].toString()){
    await Blog.findByIdAndDelete(blogId)
    return response.status(204).end()
  }
  else{
    response.status(401).json({'error' : 'Client is not Authorized to Perform this Action (Deletion of Resource)'})
  }

 
})
blogsRouter.put('/:id',async (request, response) => {
  const id = (request.params.id)
  const body = request.body
  const entry = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  await Blog.findByIdAndUpdate(id, entry)
  response.status(200).json(entry)
})
module.exports = blogsRouter