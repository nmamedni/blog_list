const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('../tests/test_helpers')
const Blog = require('../models/blog')

const api = supertest(app)



beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Testing blogs api', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blog posts', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blog posts have "id"', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => blog?.id)
    assert(!ids.includes(undefined))
  })

  test('get blog post with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const oldBlog = blogsAtStart[0]

    const response = await api
      .get(`/api/blogs/${oldBlog.id}`)
      .expect(200)

    assert.deepStrictEqual(response.body, oldBlog)
  })

  describe('Add new blog', () => {
    test('success with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const newBlog = {
        'title': 'Coco\'s blog',
        'author': 'Coco',
        'url': 'https://reactpatterns.com/',
        'likes': 45
      }
      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const newBlogString = helper.blogContentToString(newBlog)
      assert(blogsAtEnd.some(blog => helper.blogContentToString(blog) === newBlogString))
      // assert.partialDeepStrictEqual(result.body, newBlog)
    })

    test('success with missing likes, likes set to 0', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const newBlog = {
        title: 'Daddy\'s blog',
        author: 'Daddy',
        url: 'https://auweia.com/',
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const newBlogString = helper.blogContentToString({ ...newBlog, likes:0 })
      assert(blogsAtEnd.some(blog => helper.blogContentToString(blog) === newBlogString))

      // assert.strictEqual(result.body?.likes, 0)
    })

    test('adding new blog with missing url should fail', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const newBlog = {
        'title': 'Bobby\'s blog',
        'author': 'Bobby',
      }
      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      assert(typeof result?.body?.error === 'string')
      assert(/url.*is required/.test(result.body.error))

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('adding new blog with missing title should fail', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const newBlog = {
        'author': 'Ataboy',
        'url': 'https://blabla.com/',
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  test('delete a blog with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

    const validId = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${validId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert(!blogsAtEnd.some(blog => blog.id === validId))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  describe('Update an individual blog', () => {
    test('update a complete blog with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const validId = blogsAtStart[0].id
      const newBlog = {
        'title': 'Daddy\'s blog',
        'author': 'Daddy',
        'url': 'https://auweia.com/',
        'likes': 261
      }

      await api
        .put(`/api/blogs/${validId}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === validId )
      assert.partialDeepStrictEqual(updatedBlog, newBlog)
    })

    test('update likes of a blog with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)

      const oldBlog = blogsAtStart[0]
      const validId = oldBlog.id
      const newBlog = {
        'title': oldBlog.title,
        'author': oldBlog.author,
        'url': oldBlog.url,
        'likes': oldBlog.likes + 1
      }

      await api
        .put(`/api/blogs/${validId}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === validId )
      assert.partialDeepStrictEqual(updatedBlog, newBlog)
    })

    test('update a blog with non-existent valid id should return 404', async () => {
      const invalidId = await helper.getValidNonExistentId()
      const newBlog = { 'title': 'Dad', 'author': 'bla', 'url': 'bla' }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newBlog)
        .expect(404)
    })

    test('update a blog with invalid id should return 400', async () => {
      const invalidId = '2'
      const newBlog = { 'title': 'Dad', 'author': 'bla', 'url': 'bla' }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newBlog)
        .expect(400)
        .expect({ error: 'malformatted id' })
    })

  })


})


after(async() => {
  await mongoose.connection.close()
})
