const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('chem101', 10)
    const user = new User({ username: 'Adam', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const dupUser = {
      username: 'Adam',
      name: 'Adam Carlsen',
      password: 'chem101',
    }

    const result = await api
      .post('/api/users')
      .send(dupUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })

  test('creation fails with proper statuscode and message if username missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Adam Carlsen',
      password: 'chem101',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password / username required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username invalid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'AC',
      name: 'Adam Carlsen',
      password: 'chem101',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Invalid password / username, minimum length is 3.'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Adam',
      name: 'Adam Carlsen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password / username required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password invalid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Adam',
      name: 'Adam Carlsen',
      password: 'ch',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Invalid password / username, minimum length is 3.'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation succeeds with a fresh username - 2', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Olive',
      name: 'Olive Smith',
      password: 'chem102',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
    await mongoose.connection.close()
})