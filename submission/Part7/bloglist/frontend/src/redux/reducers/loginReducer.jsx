// redux/reducers/loginReducer.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import loginService from '../services/login.js'

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      return action.payload
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      console.error('Login rejected:', action.payload)  // Add this line to log rejected login
    })
  }
})

export const { setUser, clearUser } = loginSlice.actions

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginService.login(credentials)
      console.log('Login successful:', user)  // Add this line to debug the login response
      return user
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)  // Add error logging
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const logoutUser = () => {
  return dispatch => {
    dispatch(clearUser())
  }
}

export default loginSlice.reducer
