import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../redux/reducers/blogReducer.jsx'

const NewBlog = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)
  const dispatch = useDispatch()

  const handleCreateBlog = (event) => {
    event.preventDefault()
    dispatch(createBlog({ title, author, url, likes }))
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes(0)
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          likes
          <input
            type="number"
            value={likes}
            name="Likes"
            onChange={({ target }) => setLikes(Number(target.value))}  // Ensure likes is a number
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewBlog
