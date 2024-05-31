// redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer.jsx'
import userReducer from './reducers/userReducer.jsx'
import loginReducer from './reducers/loginReducer.jsx'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    users: userReducer,
    login: loginReducer,
  },
})

export default store
