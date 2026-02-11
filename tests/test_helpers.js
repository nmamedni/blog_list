const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'Petya\'s blog',
    'author': 'Petya',
    'url': 'http://www.cs.utexas.edu/bla.html',
    'likes': 252
  },
  {
    'title': 'Ivan\'s blog',
    'author': 'Ivan Petrov',
    'url': 'https://reactpatterns.com/',
    'likes': 21
  }
]

const blogContentToString = function(blog) {
  return `${blog.title}_${blog.author}_${blog.url}_${blog.likes}`
}

const blogsInDb = async function() {
  const result = await Blog.find({})
  return result.map(blog => blog.toJSON())
}

const getValidNonExistentId = async function() {
  const blogObject = new Blog({
    'title': 'bla',
    'author': 'bla',
    'url': 'http://bla/bla.html',
    'likes': 0
  })
  await blogObject.save()
  await blogObject.deleteOne()

  return blogObject._id.toString()
}

module.exports = { initialBlogs, blogsInDb, getValidNonExistentId, blogContentToString }