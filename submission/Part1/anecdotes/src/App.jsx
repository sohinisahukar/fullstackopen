import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0])

  const [mostVotedAnecdote, setMostVotedAnecdote] = useState({
    anecdote: "",
    votes: 0
  })

  const nextAnecdote = () => {
    const randInt = Math.floor(Math.random() * anecdotes.length)
    setSelected(randInt)
  }

  const handleVote = () => {
    votes[selected] = votes[selected] + 1
    setVotes(votes)
    determineMostVotedAnecdote()
  }

  const determineMostVotedAnecdote = () => {
    const voteVal = Math.max.apply(null, votes)
    const indx = votes.indexOf(voteVal)
    setMostVotedAnecdote({
      anecdote: anecdotes[indx],
      votes: voteVal
    })
  }

  if(votes.every(vote => vote === 0)) {
    return (
      <div>
        <h1>Anecdote of the day</h1>
        <p>
          {anecdotes[selected]}
        </p>
        <button onClick={handleVote}>
          vote
        </button>
        <button onClick={nextAnecdote}>
          next anecdote
        </button>
        <h1>Anecdote with most votes</h1>
        <p>No votes registered yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>
        {anecdotes[selected]}
      </p>
      <button onClick={handleVote}>
        vote
      </button>
      <button onClick={nextAnecdote}>
        next anecdote
      </button>
      <h1>Anecdote with most votes</h1>
      <p>{mostVotedAnecdote.anecdote} has {mostVotedAnecdote.votes} votes</p>
    </div>
  )
}

export default App