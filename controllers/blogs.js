const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async(request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
    return
  }

  blog.title = request?.body?.title
  blog.author = request?.body?.author
  blog.url = request?.body?.url
  blog.likes = request?.body?.likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})


module.exports = blogsRouter