const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const ObjectId = require('mongoose').Types.ObjectId

const Blog = require('../models/blog')
const User = require('../models/user')
const { get, forEach, lte } = require('lodash')

const getToken = async (username, password) => {

    const loginUser = {
        username: username,
        password: password
    }

    const response = await api
        .post('/api/login')
        .send(loginUser)

    return response.body.token
}

describe('testing crud operations for blogs api', () => {

    describe('addition of a new blog', () => {

        let token = ''
    
        test.before(async () => {

            const blogs = await Blog.find({})

            if(blogs.length !== 0) {
                 //deleting all blogs
                await  Blog.deleteMany({})
                console.log("All blogs deleted!")
    
                //remove reference of all blogs from respective users
                await User.updateMany({}, { $set: { blogs: []}})
                console.log('Blog references to users deleted!')
            } else {
                console.log('No blogs added yet.')
            }
            
            token = await getToken('Adam', 'chem101')
            console.log('setting the token value for blog addition')
        })
    
        test('succeeds with valid data', async () => {
            const newBlog = helper.blog1
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, 1)
        
            assert.strictEqual(blogsAtEnd[0].title, "React patterns")
        })
    
        test('fails with statuscode 400 if likes property missing - invalid data', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = {
                title: "testBlog1",
                author: "test author1",
                url: "https://test@author1/testBlog1.com"
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
        
        test('fails with statuscode 400 if title property missing - invalid data', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = {
                author: "test author2",
                url: "https://test@author2/testBlog2.com",
                likes: 22
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
        
        test('fails with statuscode 400 if url property missing - invalid data', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = {
                title: "testBlog3",
                author: "test author3",
                likes: 33
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
        
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
    
        test('fails with statuscode 400 if auth token missing', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = {
                title: "testBlog4",
                author: "test author4",
                url: "https://test@author4/testBlog4.com",
                likes: 44
            }
        
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            assert(result.body.error.includes('token missing or invalid'))
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
    
        test('fails with statuscode 400 if auth token invalid', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = {
                title: "testBlog5",
                author: "test author5",
                url: "https://test@author5/testBlog5.com",
                likes: 55
            }
        
            const result = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer invalidToken`)
                .send(newBlog)
                .expect(400)
        
            assert(result.body.error.includes('token missing or invalid'))
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
    
        test('successful adding a second blog with first user', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const newBlog = helper.blog2
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
        
            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes("Canonical string reduction"))
        })
    
    })
    
    describe('when there is initially some blogs saved', () => {
    
        test('blogs are returned as json', async () => {
            await api
              .get('/api/blogs')
              .expect(200)
              .expect('Content-Type', /application\/json/)
        })
        
        test('all blogs are returned', async () => {
            
            const blogs = await helper.blogsInDb()
            const response = await api.get('/api/blogs')
            assert.strictEqual(response.body.length, blogs.length)
        })
          
        test('a specific blog is within the returned blogs', async () => {
            const response = await api.get('/api/blogs')
    
            const titles = response.body.map(r => r.title)
          
            assert(titles.includes('React patterns'))
        })
    })
    
    describe('viewing a specific blog', () => {
    
        test('succeeds with a valid id', async () => {
            const blogsAtStart = await helper.blogsInDb()
    
            const blogToView = blogsAtStart[0]
    
            const response = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
            const resultBlog = JSON.parse(response.text.toString())
            compareBlogs(blogToView, resultBlog)
        })
    
        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()
    
            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })
    
        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = 'invalidId'
    
            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })
    })
    
    describe('deletion of a blog', () => {
    
        let token = ''
    
        test.before(async () => {
    
            token = await getToken('Adam', 'chem101')
            // console.log(token)
            console.log('setting the token value for blog deletion')
            
        })

        test('fails with statuscode 400 if auth token is missing', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            const result = await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(400)
    
            assert(result.body.error.includes('token missing or invalid'))

            const blogsAtEnd = await helper.blogsInDb()   
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
    
        test('fails with statuscode 400 if auth token is invalid', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            const result = await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer invalidToken`)
                .expect(400)
    
            assert(result.body.error.includes('token missing or invalid'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            
            const blogsAtStart = await helper.blogsInDb()

            const nonExistantBlogId = '65f856cf0ba16230c548f3e8'
            
            const result = await api
                .delete(`/api/blogs/${nonExistantBlogId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
    
            assert(result.body.error.includes('blog not found'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })

        test('fails with statuscode 400 if blog id invalid', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            
            const result = await api
                .delete(`/api/blogs/invalidBlogId`)
                .set('Authorization', `Bearer ${token}`)
                .expect(400)
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
            
        test('succeeds with statuscode 204 if id is valid', async () => {
    
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
    
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)
    
            const blogsAtEnd = await helper.blogsInDb()
                
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    
            const authors = blogsAtEnd.map(b => b.author)
            assert(!authors.includes(blogToDelete.author))
        })

        test('fails with statuscode 401 if user unauthorised', async () => {

            unauthorisedUserToken = token = await getToken('Olive', 'chem102')
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
            
            const result = await api
                .delete(`/api/blogs//${blogToDelete.id}`)
                .set('Authorization', `Bearer ${unauthorisedUserToken}`)
                .expect(401)
    
            assert(result.body.error.includes('user unauthorised to delete blog'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })
    
    })

    describe('updation of a blog', () => {

        let token = ''
    
        test.before(async () => {

            token = await getToken('Adam', 'chem101')
            console.log('setting the token value for blog updation')

            const blogs = await Blog.find({})

            if (blogs.length === 0) {
                console.log('adding a blog with first user if there are none to demonstrate updation')
                const newBlog = helper.blog3

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newBlog)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
            }
        })

        test('fails with statuscode 400 if auth token is missing', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                ...blogsAtStart[0],
                likes: 22
            }
            
            const result = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .expect(400)
    
            assert(result.body.error.includes('token missing or invalid'))

            const blogsAtEnd = await helper.blogsInDb()   
            assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
        })

        test('fails with statuscode 400 if auth token is invalid', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                ...blogsAtStart[0],
                likes: 22
            }
            
            const result = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer invalidToken`)
                .expect(400)
    
            assert(result.body.error.includes('token missing or invalid'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            
            const blogsAtStart = await helper.blogsInDb()

            const nonExistantBlogId = '65f856cf0ba16230c548f3e8'
            
            const result = await api
                .put(`/api/blogs/${nonExistantBlogId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
    
            assert(result.body.error.includes('blog not found'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
        })

        test('fails with statuscode 400 if blog id invalid', async () => {
            
            const blogsAtStart = await helper.blogsInDb()
            
            const result = await api
                .put(`/api/blogs/invalidBlogId`)
                .set('Authorization', `Bearer ${token}`)
                .expect(400)
            
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
        })
            
        test('succeeds with statuscode 200 if id is valid', async () => {
    
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                ...blogsAtStart[0],
                likes: 22
            }
    
            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(blogToUpdate)
                .expect(200)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd[0].likes, 22)
        })

        test('fails with statuscode 401 if user unauthorised', async () => {

            unauthorisedUserToken = token = await getToken('Olive', 'chem102')
            
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = {
                ...blogsAtStart[0],
                likes: 22
            }
            
            const result = await api
                .put(`/api/blogs//${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${unauthorisedUserToken}`)
                .send(blogToUpdate)
                .expect(401)
    
            assert(result.body.error.includes('user unauthorised to update blog'))
            
            const blogsAtEnd = await helper.blogsInDb()    
            assert.strictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
        })

    })
    
})

after(async () => {
    await mongoose.connection.close()
})

const compareBlogs = (actual, expected) => {
    // Compare all fields except 'user'
    assert.strictEqual(actual.title, expected.title, "Titles don't match");
    assert.strictEqual(actual.author, expected.author, "Authors don't match");
    assert.strictEqual(actual.url, expected.url, "URLs don't match");
    assert.strictEqual(actual.likes, expected.likes, "Likes don't match");
    assert.strictEqual(actual.id, expected.id, "IDs don't match");

    // Convert 'user' ObjectId to string (if it is an ObjectId), then compare
    const actualUser = actual.user instanceof ObjectId ? actual.user.toString() : actual.user;
    const expectedUser = expected.user instanceof ObjectId ? expected.user.toString() : expected.user;
    assert.strictEqual(actualUser, expectedUser, "Users don't match");
    
}
