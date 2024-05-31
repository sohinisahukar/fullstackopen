// eslint-disable-next-line @typescript-eslint/no-var-requires
const blogsRouter = require('express').Router()
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
	
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	
    const blog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1})
    if(blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }

})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

	const body = request.body

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        comments: [],
        user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

})

blogsRouter.post('/:id/comments', async (request, response) => {
    const { comment } = request.body
    const blog = await Blog.findById(request.params.id)
  
    if (blog) {
      blog.comments = blog.comments.concat(comment)
      await blog.save()
      response.status(201).json(blog)
    } else {
      response.status(404).end()
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    const user = request.user
    if(!blog.user.equals(user._id)) {
        return response.status(401).json({ error: 'user unauthorised to delete blog'})
    }
	
    await Blog.findByIdAndDelete(request.params.id)
    await User.updateOne({_id: user._id}, {$pull: {blogs: blog._id}})
    response.status(204).end()

})

blogsRouter.put('/:id',  
                // middleware.userExtractor, 
                async (request, response) => {

	const body = request.body

    const user = User.findById(body.user)
  
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
        user: user._id
	}
  
    const blogToUpdate = await Blog.findById(request.params.id)
    if (!blogToUpdate) {
        return response.status(404).json({ error: 'blog not found' })
    }
    // if(!blogToUpdate.user.equals(user._id)) {
    //     return response.status(401).json({ error: 'user unauthorised to update blog'})
    // }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true}).populate('user', { username: 1, name: 1})
    await User.updateOne({_id: user._id, "blogs._id": blog._id}, {$set: {"blogs.$": updatedBlog}})
    response.json(updatedBlog)
})

module.exports = blogsRouter