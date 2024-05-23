import { useEffect } from "react"
import Anecdotes from "./components/Anecdotes.jsx"
import NewAnecdote from "./components/NewAnecdote.jsx"
import Filter from "./components/Filter.jsx"
import Notification from "./components/Notification.jsx"

// import anecdoteService from './services/anecdotes.js'
import { initializeAnecdotes } from "./reducers/anecdoteReducer.jsx"
import { useDispatch } from "react-redux"

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    // anecdoteService
    //   .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))

  dispatch(initializeAnecdotes())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return(
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <NewAnecdote />
    </div>
  )
}

export default App