import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
    appendComment(state, action) {
      const { id, comment } = action.payload
      const blog = state.find(blog => blog.id === id)
      if (blog) {
        blog.comments = blog.comments.concat(comment)
      }
    },
  },
})

export const { setBlogs, addBlog, updateBlog, deleteBlog, appendComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newBlog) => {
  return async dispatch => {
    const blog = await blogService.create(newBlog)
    dispatch(addBlog(blog))
  }
}

export const likeBlog = (id, updatedBlog) => {
  return async dispatch => {
    const blog = await blogService.update(id, updatedBlog)
    dispatch(updateBlog(blog))
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    await blogService.addComment(id, comment)
    dispatch(appendComment({ id, comment }))
  }
}

export default blogSlice.reducer
