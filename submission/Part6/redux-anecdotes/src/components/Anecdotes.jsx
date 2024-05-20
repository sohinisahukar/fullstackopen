/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'
// import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer.jsx'
import { displayNotification } from '../reducers/notificationReducer.jsx'

const Anecdote = ({ anecdote, handleClick }) => (
    <li>
        <div>
            {anecdote.content}
        </div>
        <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
        </div>
    </li>
)

const Anecdotes = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const filteredAnecdotes = anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )

    const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

    // const [sortedAnecdotes, setSortedAnecdotes] = useState([])

    // useEffect(() => {
    //     const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
    //     setSortedAnecdotes(sortedAnecdotes)
    // }, [filteredAnecdotes])

    if (!anecdotes) {
        return <div>Loading...</div>
    }

    const handleVote = (anecdote) => {
        dispatch(vote(anecdote.id))
        dispatch(displayNotification(`You voted for '${anecdote.content}'`, 5))
    }

    return (
        <ul>
            {sortedAnecdotes.map(anecdote => (
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => handleVote(anecdote)}
                />
            ))}
        </ul>
    )
}

export default Anecdotes
