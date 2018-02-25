const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var totalLikes = 0

    for (var i = 0; i < blogs.length; i++) {
        totalLikes += blogs[i].likes
    }
    return totalLikes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return '{}'
    }
    var max = 0
    var num = 0
    for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > max) {
            max = blogs[i].likes
            num = i
        }

    }
    return blogs[num]
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    var blogAuthors = []

    const valiVaihe = (authors, item) => {
        const test = {
            author: item.author,
            blogs: 1
        }

        var found = false
        var foundIndex = 0
        for (var i = 0; i < blogAuthors.length; i++) {
            if (blogAuthors[i].author === test.author) {
                found = true
                foundIndex = i
                break;
            }
        }

        if (!found) {
            return blogAuthors = blogAuthors.concat(test)
        } else {
            blogAuthors[foundIndex].blogs = blogAuthors[foundIndex].blogs + 1
            return blogAuthors
        }
    }

    blogAuthors = blogs.reduce(valiVaihe, blogAuthors)

    var indexOfBiggest = 0
    for (var i = 0; i < blogAuthors.length; i++) {
        if (blogAuthors[i].blogs > blogAuthors[indexOfBiggest].blogs) {
            indexOfBiggest = i
        }
    }
    return blogAuthors[indexOfBiggest]
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) {
        return null
    }

    if (blogs.length === 1) {
        return { author: blogs[0].author, likes: blogs[0].likes }
    }

    var authors = []
    var totalLikes = []
    var indexOfMostLikes = 0
    var highest = 0

    for (var i = 0; i < blogs.length; i++) {
        var likes = 0
        var index = 0
        if (authors.indexOf(blogs[i].author) !== -1) {
            index = authors.indexOf(blogs[i].author)
            totalLikes[index] += blogs[i].likes
            likes = totalLikes[index]
        } else {
            authors.push(blogs[i].author)
            totalLikes.push(blogs[i].likes)
            likes = blogs[i].likes
            index = authors.length
        } if (highest < likes) {
            highest = likes
            indexOfMostLikes = index
        }
    }
    console.log({ author: authors[indexOfMostLikes], likes: highest })
    return { author: authors[indexOfMostLikes], likes: highest }
}




module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}