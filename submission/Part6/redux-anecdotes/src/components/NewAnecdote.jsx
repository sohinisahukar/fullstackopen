// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer.jsx'
import { displayNotification } from '../reducers/notificationReducer.jsx'
import anecdoteService from '../services/anecdotes.js'

const NewAnecdote = () => {
    const dispatch = useDispatch()

    const handleAddAnecdote = async(event) => {
        event.preventDefault()
        const content = event.target.anecd.value.trim()
        if (content) {
            const newAnecdote = await anecdoteService.createNew(content)
            dispatch(createAnecdote(newAnecdote))
            event.target.anecd.value = ''
            dispatch(displayNotification(`You created '${content}'`, 5))
        }
    }

    return (
        <form onSubmit={handleAddAnecdote}>
            <div><input name="anecd" /></div>
            <button type="submit">create</button>
        </form>
    )
}

export default NewAnecdote
