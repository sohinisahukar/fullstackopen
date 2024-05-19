import Anecdotes from "./components/Anecdotes.jsx"
import NewAnecdote from "./components/NewAnecdote.jsx"

const App = () => {
  return(
    <div>
      <h2>Anecdotes</h2>
      <Anecdotes />
      <NewAnecdote />
    </div>
  )
}

export default App