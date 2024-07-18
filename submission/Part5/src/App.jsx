import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    isError: false
  })

  const timeout = () => {
    setTimeout(() => {
      setNotificationMessage({
        message: null,
        isError: false
      })
    }, 5000)
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(true)

  const getAllBlogs = () => {
    blogService.getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
  }

  useEffect(getAllBlogs, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage({
        message: 'Wrong credentials',
        isError: true
      })
      timeout()
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken('')
      setUser(null)
    } catch (exception) {
      setNotificationMessage({
        message: `Error while logging out! -> ${exception}`,
        isError: true
      })
      timeout()
    }
  }

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: { username: user.username, name: user.name, id: user.id } }))
        setNotificationMessage({
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          isError: false
        })
        timeout()
      })
      .catch(error => {
        setNotificationMessage({
          message: `Error while adding blog -> ${error}`,
          isError: true
        })
        timeout()
      })
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleBlogLike = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes + 1,
      url: blog.url,
      user: blog.user.id
    }

    blogService
      .update(id, changedBlog)
      .then(updatedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
        setNotificationMessage({
          message: 'Blog updated.',
          isError: false
        })
        timeout()
      })
      .catch(error => {
        setNotificationMessage({
          message: `Error while updating blog: ${error}`,
          isError: true
        })
        timeout()
      })
  }

  const handleBlogRemove = id => {
    const blog = blogs.find(b => b.id === id)
    if(window.confirm(`Are you sure you want to delete blog ${blog.title} ?`)) {
      blogService
        .deleteBlog(id)
        .then(response => {
          getAllBlogs()
          setNotificationMessage({
            message: `Blog ${blog.title} removed successfully.`,
            isError: false
          })
          timeout()
        })
        .catch(error => {
          setNotificationMessage({
            message: `Error while removing blog: ${error}`,
            isError: true
          })
          timeout()
        })
    } else {
      setNotificationMessage({
        message: `Deleting blog ${blog.title} was aborted.`,
        isError: false
      })
      timeout()
    }

  }

  const blogsHomepage = () => (
    <div>
      {blogs.sort((a,b) => a.likes - b.likes).reverse().map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={() => handleBlogLike(blog.id)}
          removeBlog={() => handleBlogRemove(blog.id)}
        />
      )}
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMessage.message} isError={notificationMessage.isError}/>
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          <button type="submit" onClick={handleLogout}>logout</button><pre/>
          <div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm
                createBlog={addBlog}
              />
            </Togglable>
            <pre/>
            {blogsHomepage()}
          </div>
        </div>
      }
      <Footer/>
    </div>
  )
}

export default App