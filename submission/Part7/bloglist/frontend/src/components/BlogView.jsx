import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { likeBlog, addComment, removeBlog } from '../redux/reducers/blogReducer'
import Blog from './Blog.jsx'

const BlogView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blog = useSelector(state => state.blogs.find(blog => blog.id === id))
  const user = useSelector(state => state.login)

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    dispatch(likeBlog(blog.id, updatedBlog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      navigate('/') // Redirect to the home page
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    if(comment) {
      dispatch(addComment(blog.id, comment))
      event.target.comment.value = ''
    }
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <Blog blog={blog} onLike={handleLike} onDelete={handleDelete} user={user}/>
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
