import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [viewVisible, setViewVisible] = useState(true)

  const hideWhenVisible = { display: viewVisible ? 'none' : '' }
  const showWhenVisible = { display: viewVisible ? '' : 'none' }

  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

  const showRemoveVisible = { display: (blog.user.username !== loggedUser.username) ? 'none' : '' }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setViewVisible(false)} style={showWhenVisible}>view</button>
        <button onClick={() => setViewVisible(true)} style={hideWhenVisible}>hide</button>
      </div>
      <div style={hideWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes}
          <button onClick={likeBlog}>like</button>
        </p>
        <p>{blog.user.name}</p>
      </div>
      <button onClick={removeBlog} style={showRemoveVisible}>remove</button>
    </div>
  )

}

export default Blog