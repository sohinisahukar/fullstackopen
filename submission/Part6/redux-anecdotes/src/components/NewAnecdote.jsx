// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer.jsx'

const NewAnecdote = () => {
    const dispatch = useDispatch()

    const handleAddAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecd.value.trim()
        if (content) {
            dispatch(createAnecdote(content))
            event.target.anecd.value = ''
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
