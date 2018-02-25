
const listHelper = require('../utils/list_helper')
test('dummy is called', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listWithMultipleBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }
]

const emptyList = []

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

describe('total likes', () => {

    test('when list has no blogs likes equals zero', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has multiple blogs equals the likes of all', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        expect(result).toBe(17)
    })


})

describe('most blogs', () => {


    test('most blogs from large list', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 2 })
    })

    test('most blogs from small list', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
    })


})

describe('most likes', () => {


    test('most likes from large list', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
    })
    test('most likes from small list', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
    })
})

describe('favorite Blog', () => {


    const mostLiked = {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    }

    const mostLikedWithOneBlog = {

        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0

    }

    test('returns the one with most like from list', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result).toEqual(mostLiked)
    })

    test('returns {} when list is empty', () => {
        const result = listHelper.favoriteBlog(emptyList)
        expect(result).toEqual('{}')
    })

    test('returns the only post when list size equals one', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(mostLikedWithOneBlog)
    })
})




