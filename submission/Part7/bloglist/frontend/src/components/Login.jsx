import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/reducers/loginReducer.jsx'
import blogService from '../redux/services/blogs.js'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await dispatch(loginUser({ username, password }))
      console.log('User logged in:', user)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user.payload)
      )
      blogService.setToken(user.payload.token)
    } catch (exception) {
      console.error('Wrong credentials')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
