import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [viewVisible, setViewVisible] = useState(false)

  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

  const showRemoveVisible = { display: (blog.user.username !== loggedUser.username) ? 'none' : '' }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setViewVisible(!viewVisible)}>
          {viewVisible ? 'hide' : 'view'}
        </button>
      </div>
      {viewVisible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={likeBlog}>like</button>
          </p>
          <p>{blog.user.name}</p>
        </div>
      )}
      <button onClick={removeBlog} style={showRemoveVisible}>remove</button>
    </div>
  )
}

export default Blog
