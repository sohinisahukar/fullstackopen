const Blog = require('../models/blog')
const User = require('../models/user')

const blog1 = {
  title: "React patterns",
  author: "Michael Chan",
  url: "https://reactpatterns.com/",
  likes: 7
}

const blog2 = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12
}

const blog3 = {
  title: "First class tests",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  likes: 10
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({ 
        title: 'blog0',
        author: 'abc',
        url: 'https://abc@xyz-blog',
        likes: 3
     })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    blog1, blog2, blog3, blogsInDb, nonExistingId, usersInDb
}