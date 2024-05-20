import { configureStore } from '@reduxjs/toolkit'

import anecdoteReducer from './reducers/anecdoteReducer.jsx'
import filterReducer from './reducers/filterReducer.jsx'
import notificationReducer from './reducers/notificationReducer.jsx'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store