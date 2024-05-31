import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import BlogList from './components/BlogList.jsx'
import Users from './components/Users.jsx'
import User from './components/User.jsx'
import BlogView from './components/BlogView.jsx'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Navigation from './components/Navigation.jsx'
import { initializeBlogs } from './redux/reducers/blogReducer.jsx'
import { setUser, logoutUser } from './redux/reducers/loginReducer.jsx'
import blogService from './redux/services/blogs'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.login)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        dispatch(setUser(user))
        blogService.setToken(user.token)
      } catch (e) {
        console.error('Failed to parse stored user JSON', e)
        window.localStorage.removeItem('loggedBlogAppUser')
      }
    }
  }, [dispatch])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(logoutUser())
  }

  return (
    <Router>
      <div>
        <Navigation />
        {user === null ? (
          <Login />
        ) : (
          <div>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
            <Routes>
              <Route path="/users/:id" element={<User />} />
              <Route path="/users" element={<Users />} />
              <Route path="/blogs/:id" element={<BlogView />} />
              <Route path="/" element={<BlogList />} />
              <Route path="/create" element={<NewBlog />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
