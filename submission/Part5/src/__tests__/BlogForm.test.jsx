import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi, test } from 'vitest'
import BlogForm from '../components/BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const likesInput = screen.getByPlaceholderText('likes')

  await userEvent.type(titleInput, 'Test Title')
  await userEvent.type(authorInput, 'Test Author')
  await userEvent.type(urlInput, 'http://testurl.com')
  await userEvent.type(likesInput, '5')

  const createButton = screen.getByText('add blog')
  await userEvent.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
  })
})
