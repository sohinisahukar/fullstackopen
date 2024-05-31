// redux/actions/userActions.js
import axios from 'axios'
import { setUsers, addUser } from '../reducers/userReducer.jsx'

const baseUrl = '/api/users'

export const initializeUsers = () => {
  return async dispatch => {
    const response = await axios.get(baseUrl)
    dispatch(setUsers(response.data))
  }
}

export const createUser = (newUser) => {
  return async dispatch => {
    const response = await axios.post(baseUrl, newUser)
    dispatch(addUser(response.data))
  }
}
