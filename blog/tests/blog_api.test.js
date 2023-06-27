const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { error } = require('../utils/logger')

let token

// Add the creation of user to beforeEach, and set the Header: "Authorization"
let testBlogs = [
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      user: [],
      __v: 0
    },
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      user: [],
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: [],
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: [],
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      user: [],
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      user: [],
      __v: 0
    }
]

beforeAll(async() => {
   const testUser = {
    username: 'test',
    name: 'dummy',
    password: 'qwerty123'
   }

   const user = await api
   .post('/api/users')
   .send(testUser)
   const userId = user._body.id

   testBlogs.map(blog => blog.user = userId)
   let body = await api
   .post('/api/login')
   .send({
    username: 'test',
    password: 'qwerty123'
   })
   body = body._body
   token = `Bearer ${body.token}`
})
beforeEach(async() => {
    await Blog.deleteMany({})
    for(const blog of testBlogs){
      const blogObject = new Blog(blog)
      await blogObject.save()
    }
    console.log("Set and Saved")
})


test('Blogs are returned as JSON', async() =>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

}, 60000)

test('Blogs length match', async() =>{
    const response = await api.get('/api/blogs')
    expect(response._body).toHaveLength(testBlogs.length)
})

test('Blog contains the `id` field', async() => {
  let response = await api.get('/api/blogs')
  response = response._body
  response.forEach(blog => expect(blog.id).toBeDefined())
})

test('POST adds new blogs to the db', async() => {
  const entry = {
    title: 'Test',
    author: 'Dummy',
    url: 'test.zip',
    likes: 9001
  }

  await api
  .post('/api/blogs')
  .send(entry)
  .expect(201)
  .set({'Authorization': `${token}`})


  let response = await api.get('/api/blogs')
  response = response._body
  expect(response).toHaveLength(testBlogs.length + 1)

  let data = response.map(response => response.title)

  expect(data).toContain(entry.title)
})

test('Expect Imporper submission to have default values', async () => {
  const entry = {
    title: 'Test',
    author: 'Dummy',
    url: 'test.zip',
  }
  await api
  .post('/api/blogs')
  .send(entry)
  
})

test('Expect missing values to be thrown out', async () =>{
  const entry = {
    title: 'test.zip'
  }
  await api
  .post('/api/blogs')
  .send(entry)
  .expect(400)

})

test('Deletion is possible', async () => {
  let blogs = await api.get('/api/blogs')
  blogs = blogs._body
  const id = blogs[0].id
  await api
  .delete(`/api/blogs/${id}`)
  .expect(204)
  .set({'Authorization': `${token}`})


  
  blogs = await api.get('/api/blogs')
  blogs = blogs._body
  expect(blogs).toHaveLength(testBlogs.length - 1)

})

test('Updating is possible', async () => {
  let blogs = await api.get('/api/blogs')
  blogToUpdate = blogs._body[0]
  blogToUpdate.likes = 102103124
  const id = blogToUpdate.id
  
  await api.put(`/api/blogs/${id}`)
  .send(blogToUpdate)
  .expect(200)

  blogs = await api.get('/api/blogs')
  blogs = blogs._body
  expect(blogs[0].likes).toBe(blogToUpdate.likes)
})
test('Token Error Bozo', async () => {
  const entry = {
    title: 'Test',
    author: 'Dummy',
    url: 'test.zip',
    likes: 9001
  }

  await api
  .post('/api/blogs')
  .send(entry)
  .expect(400)
  .set({'Authorization': 'qqwurgurwhqwruqwru'})
})
afterAll(async() =>{
    await User.deleteMany({})
    mongoose.connection.close()
})