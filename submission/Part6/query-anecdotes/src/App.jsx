import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { NotificationProvider, useNotification } from './contexts/NotificationContext'

const App = () => {

  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const {data: anecdotes, isLoading, isError, error} = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
      dispatch({ type: 'SHOW', payload: 'An anecdote has been voted on!' })
      setTimeout(() => {
        dispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    console.log('vote')
  }

  if ( isLoading ) {
    return <div>loading data...</div>
  }

  if( isError ) {
    return (
      <div> 
        <p>Anecdote service not available due to problems in server.</p>
        <p>Error: {error.message} </p>
      </div>)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const WrappedApp = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
)

export default WrappedApp
