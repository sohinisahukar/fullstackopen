// redux/actions/loginActions.js
import axios from 'axios'
import { setUser, clearUser } from '../reducers/loginReducer.jsx'

const baseUrl = '/api/login'

export const loginUser = (credentials) => {
  return async dispatch => {
    const response = await axios.post(baseUrl, credentials)
    dispatch(setUser(response.data))
  }
}

export const logoutUser = () => {
  return dispatch => {
    dispatch(clearUser())
  }
}
