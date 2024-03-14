const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
      
    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
      
        const titles = response.body.map(r => r.title)
      
        assert(titles.includes('First class tests'))
    })

    describe('viewing a specific blog', () => {

        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]

            const resultBlog = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a new blog', () => {

        test('succeeds with valid data', async () => {
            const newBlog = {
                title: "blog1",
                author: "Ace Hernandez",
                url: "https://ace@hernandez-blogs/healthCoaching",
                likes: 23
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
            const authors = blogsAtEnd.map(b => b.author)
            assert(authors.includes('Ace Hernandez'))
        })

        test('fails with statuscode 400 if likes property missing - invalid data', async () => {
            const newBlog = {
                title: "blog2",
                author: "Bob Ross",
                url: "https://bob#ross-blogs/artYourWayOut"
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
        
        test('fails with statuscode 400 if title property missing - invalid data', async () => {
            const newBlog = {
                author: "Charlie Sheen",
                url: "https://charlie$sheen-blogs/charmer",
                likes: 69
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
        
        test('fails with statuscode 400 if url property missing - invalid data', async () => {
            const newBlog = {
                title: "blog3",
                author: "David Henrie",
                likes: 100
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {

        test('succeeds with statuscode 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
                
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

            const authors = blogsAtEnd.map(b => b.author)
            assert(!authors.includes(blogToDelete.author))
        })
    })

    describe('updation of a blog', () => {

        test('succeeds with valid modified data - updated likes', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                title: blogsAtStart[0].title,
                author: blogsAtStart[0].author,
                url: blogsAtStart[0].url,
                likes: 11
            }

            await api
                .put(`/api/blogs/${blogsAtStart[0].id}`)
                .send(blogToUpdate)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const updatedBlogs = await helper.blogsInDb()

            assert.strictEqual(updatedBlogs[0].likes, 11)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})