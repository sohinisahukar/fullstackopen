import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: newBlog.likes
    })

    setNewBlog({
      title: '',
      author: '',
      url: '',
      likes: 0
    })
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <table>
          <tbody>
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
          </tbody>
        </table>
        <pre />
        <button type="submit">add blog</button>
      </form>
    </div>
  )
}

export default BlogForm