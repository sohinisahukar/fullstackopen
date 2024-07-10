import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi, test, beforeEach, afterEach } from 'vitest'
import Blog from '../components/Blog'

const blog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 0,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

beforeEach(() => {
  // Mock localStorage
  localStorage.setItem('loggedBlogappUser', JSON.stringify({ username: 'testuser' }))
})

afterEach(() => {
  // Clear mock after each test
  localStorage.clear()
})

test('renders blog title and author, but not url or likes by default', () => {
  render(<Blog blog={blog} likeBlog={() => {}} removeBlog={() => {}} />)

  const titleAndAuthor = screen.getByText('Test Blog Test Author')
  expect(titleAndAuthor).toBeInTheDocument()

  const url = screen.queryByText('http://testurl.com')
  expect(url).not.toBeInTheDocument()

  const likes = screen.queryByText('likes 0')
  expect(likes).not.toBeInTheDocument()
})

test('url and likes are shown when the button controlling the shown details has been clicked', async () => {
  render(<Blog blog={blog} likeBlog={() => { }} removeBlog={() => { }} />)

  const button = screen.getByText('view')
  await userEvent.click(button)

  const url = screen.getByText('http://testurl.com')
  expect(url).toBeInTheDocument()

  const likes = screen.getByText('likes 0')
  expect(likes).toBeInTheDocument()
})

test('if the like button is clicked twice, the event handler is called twice', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockHandler} removeBlog={() => {}} />)

  const button = screen.getByText('view')
  await userEvent.click(button)

  const likeButton = screen.getByText('like')
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
