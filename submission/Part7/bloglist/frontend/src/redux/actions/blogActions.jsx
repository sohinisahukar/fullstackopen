// redux/actions/blogActions.js
import axios from 'axios'
import { setBlogs, addBlog, updateBlog, deleteBlog } from '../reducers/blogReducer.jsx'

const baseUrl = '/api/blogs'

export const initializeBlogs = () => {
  return async dispatch => {
    const response = await axios.get(baseUrl)
    dispatch(setBlogs(response.data))
  }
}

export const createBlog = (newBlog) => {
  return async dispatch => {
    const response = await axios.post(baseUrl, newBlog)
    dispatch(addBlog(response.data))
  }
}

export const modifyBlog = (id, updatedBlog) => {
  return async dispatch => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
    dispatch(updateBlog(response.data))
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await axios.delete(`${baseUrl}/${id}`)
    dispatch(deleteBlog(id))
  }
}
