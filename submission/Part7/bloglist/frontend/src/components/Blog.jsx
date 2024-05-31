import React from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const showDeleteButton = user && blog.user && blog.user.name === user.name

  return (
    <div>
      <h3>{blog.title}</h3>
      <p>by {blog.author}</p>
      <p>{blog.url}</p>
      <p>{blog.likes} likes <button onClick={onLike}>like</button></p>
      {blog.user && <p>added by {blog.user.name}</p>}
      {showDeleteButton && <button onClick={onDelete}>delete</button>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default Blog
