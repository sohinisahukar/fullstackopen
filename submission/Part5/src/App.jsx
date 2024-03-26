import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({message, isError}) => {
  if(message === null) {
    return null
  }
  return (
    <div className={isError ? 'error' : 'notification'}>
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Blog app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author:'',
    url:'',
    likes:0
  })
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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({
          title: '',
          author: '',
          url: '',
          likes: 0
        })
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

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
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

  const blogsHomepage = ()=> (
    <div>
      <table>
        <tr>
          <td>Title:</td>
          <td>Author:</td>
        </tr>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </table>
    </div>
  )

  const addNewBlogForm = () => (
    <form onSubmit={addBlog}>
      <table>
        <tr>
          <td>title:</td>
          <td>
            <input
              type="text"
              value={newBlog.title}
              name="title"
              onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            />
          </td>
        </tr>
        <tr>
          <td>author:</td>
          <td>
            <input
              type="text"
              value={newBlog.author}
              name="author"
              onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
            />
          </td>
        </tr>
        <tr>
          <td>url:</td>
          <td>
            <input
              type="text"
              value={newBlog.url}
              name="url"
              onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            />
          </td>
        </tr>
        <tr>
          <td>likes:</td>
          <td>
            <input
              type="text"
              value={newBlog.likes}
              name="likes"
              onChange={({ target }) => setNewBlog({ ...newBlog, likes: target.value })}
            />
          </td>
        </tr>
      </table>
      <pre/>
      <button type="submit">add blog</button>
    </form>
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
          {addNewBlogForm()}
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