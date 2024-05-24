import axios from 'axios'

const baseUrl = 'http://localhost:3002/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote =>
    axios.post(baseUrl, newAnecdote).then(res => res.data)

export const voteAnecdote = voteAnecdote =>
    axios.put(`${baseUrl}/${voteAnecdote.id}`, voteAnecdote).then(res => res.data)