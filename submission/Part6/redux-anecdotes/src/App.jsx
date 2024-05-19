import Anecdotes from "./components/Anecdotes.jsx"
import NewAnecdote from "./components/NewAnecdote.jsx"
import Filter from "./components/Filter.jsx"

const App = () => {
  return(
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Anecdotes />
      <NewAnecdote />
    </div>
  )
}

export default App