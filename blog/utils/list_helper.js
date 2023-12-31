const lodash = require('lodash')
const testBlogs = [
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    },
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    }
  ]
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const sumLikes = blogs.reduce((sum, blog) => {return sum + blog.likes}, 0)
    return sumLikes
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const favoriteBlog = blogs[likes.indexOf(Math.max(...likes))]
    return favoriteBlog
}

const mostBlogs = (blogs) => {
    let authors = blogs.map( blog => blog.author )
    authors = lodash.values(lodash.groupBy(authors))
    const blogNumber = authors.map(author => author.length)
    const index = blogNumber.indexOf(Math.max(...blogNumber))
    const mostBlogs = {
        author: authors[index][0],
        blogs: blogNumber[index]
    }

    return mostBlogs
}

const mostLikes = (blogs) => {
    let info = blogs.map( blog => {return {author: blog.author, likes: blog.likes}} )
    let length = (lodash.uniq(blogs.map(blog => blog.author))).length
    let likes = []
    let entry = []
    console.log(info)
    for(i = 0; i<length; i++){
        const name = info[0].author


        const authorLikes = info.reduce((sum, entry) => {
            console.log(i, entry.author)
            if(entry.author == name){
                return sum + entry.likes
            }
            else{
                return sum
            }
        },0)
        
        likes.push(authorLikes)
        entry.push({
            author: name,
            likes: authorLikes
        })        
        info = info.filter(entry => entry.author !== name)
        
    }
    const mostLikes = entry[likes.indexOf(Math.max(...likes))]
    return mostLikes
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }