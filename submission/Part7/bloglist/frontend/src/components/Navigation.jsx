import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  const style = {
    padding: 5,
  }
  return (
    <div>
      <Link style={style} to="/">Blogs</Link>
      <Link style={style} to="/users">Users</Link>
      <Link style={style} to="/create">Create New Blog</Link>
    </div>
  )
}

export default Navigation
