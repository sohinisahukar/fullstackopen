import { createAnecdote } from "../requests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNotification } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
      dispatch({ type: 'SHOW', payload: 'A new anecdote has been created!' })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SHOW', payload: error.response.data.error })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length < 5) {
      dispatch({ type: 'SHOW', payload: 'Anecdote too short, must be at least 5 characters long' })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0})
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
