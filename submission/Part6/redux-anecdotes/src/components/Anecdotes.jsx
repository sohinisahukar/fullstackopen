/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer.jsx'

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
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()
    const [sortedAnecdotes, setSortedAnecdotes] = useState([])

    useEffect(() => {
        const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
        setSortedAnecdotes(sortedAnecdotes)
    }, [anecdotes])

    if (!anecdotes) {
        return <div>Loading...</div>
    }

    return (
        <ul>
            {sortedAnecdotes.map(anecdote => (
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => dispatch(vote(anecdote.id))}
                />
            ))}
        </ul>
    )
}

export default Anecdotes
