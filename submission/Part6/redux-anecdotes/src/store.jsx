import { configureStore } from '@reduxjs/toolkit'

import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer.jsx'
import filterReducer from './reducers/filterReducer.jsx'
import notificationReducer from './reducers/notificationReducer.jsx'

import anecdoteService from './services/anecdotes.js'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

anecdoteService.getAll().then(anecdotes => {
  store.dispatch(setAnecdotes(anecdotes))
})

export default store