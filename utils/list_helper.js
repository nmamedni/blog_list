const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => sum + (current?.likes ?? 0), 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, current, idx) => {
    if (!acc?.likes && current?.likes) {
      return current
    }
    return (current?.likes > acc?.likes) ? current : acc
  }, undefined)
}

const mostBlogs = (blogs) => {
  const AuthorBlogs = blogs.reduce((acc, current) => {
    if (current?.author) {
      acc[current.author] = (acc?.[current.author] ?? 0) + 1
    }
    return acc
  }, {})

  // console.log('AuthorBlogs = ', AuthorBlogs)

  const result = {
    author: undefined,
    blogs: undefined
  }

  Object.entries(AuthorBlogs).forEach(([key, value]) => {
    if ((result?.blogs === undefined) || (value > result.blogs)) {
      result.author = key
      result.blogs = value
    }
  })

  return result
}

const mostLikes = (blogs) => {
  const AuthorLikes = blogs.reduce((acc, current) => {
    if (current?.author && (current?.likes !== undefined)) {
      acc[current.author] = (acc?.[current.author] ?? 0) + current.likes
    }
    return acc
  }, {})

  // console.log('AuthorLikes = ', AuthorLikes)

  const result = {
    author: undefined,
    likes: undefined
  }

  Object.entries(AuthorLikes).forEach(([key, value]) => {
    if ((result?.likes === undefined) || (value > result.likes)) {
      result.author = key
      result.likes = value
    }
  })

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}