const _ = require('lodash')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const totalLikes = (blogs) => {
	const likesArray = blogs.map(b => b.likes)
    const reducer = (sum, item) => {
        return sum + item
      }
    
      return likesArray.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return 0
    } else {
        const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes).reverse()
        const result = {
            title: sortedBlogs[0].title,
            author: sortedBlogs[0].author,
            likes: sortedBlogs[0].likes
        }
        return result
    }
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) {
        return 0
    } else {
        const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes).reverse()
        const result = {
            author: sortedBlogs[0].author,
            likes: sortedBlogs[0].likes
        }
        return result
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) {
        return 0
    } else {
        //to get each author's count in the blogs array
        const authorCounts = _.countBy(blogs, 'author')
        // Convert the authorCounts object into an array of [author, count] pairs, 
        //then find the pair with the max count
        const mostBlogsAuthorPair = _.maxBy(_.toPairs(authorCounts), 1);
        const result = {
            author: mostBlogsAuthorPair[0],
            blogs: mostBlogsAuthorPair[1]
        }
        return result
    }
}
  
module.exports = {
	totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs
}