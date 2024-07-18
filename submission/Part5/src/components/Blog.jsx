import { useState, useEffect } from 'react'

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [viewVisible, setViewVisible] = useState(false)

  const loggedUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  console.log('Logged User:', loggedUser)
  console.log('Blog User:', blog.user)

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
          <button onClick={removeBlog} style={showRemoveVisible}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog
