const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/Blog')
const User = require('../models/User')
const { nonExistingId, format, initialBlogs, blogsInDb, usersInDb } = require('./test_helper')


beforeAll(async () => {
    await Blog.remove({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.remove({})
    const user = new User({ username: 'tester', name: 'testi testaaja', password: 'eiole' })
    await user.save()
})

describe('addition of a new blog', async () => {



    test('POST /api/blogs responses with 200 with valid data', async () => {
        const newBlog = {
            title: 'Keijo kallen tarinat',
            author: 'Keivo Kalle',
            url: 'http://blog.tataOsoitettaEiOleOlemassa.com',
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-type', /application\/json/)

        const blogsAfterOperation = await blogsInDb()
        expect(blogsAfterOperation.length).toBe(initialBlogs.length + 1)
        const titles = blogsAfterOperation.map(r => r.title)
        expect(titles).toContain('Keijo kallen tarinat')
    })


    test('POST /api/blogs adds 0 to likes if likes does not have value', async () => {

        const newBlog = {
            title: 'Velho Gandalfin seikkailut',
            author: 'Gandalf Harmaa',
            url: 'http://blog.FallOfbaradDurWasInsideJob.com',
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-type', /application\/json/)


        const blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(initialBlogs.length + 2)
        const blogi = blogsAfterOperation.find(r => r.title === 'Velho Gandalfin seikkailut')
        expect(blogi.likes).toBe(0)
    })

    test('POST /api/blogs responses with 400 with invalid data', async () => {
        const newBlogWithoutTitle = {
            author: 'Keivo Kalle',
            url: 'http://blog.tataOsoitettaEiOleOlemassa.com',
            likes: 0
        }

        const newBlogWithoutAuthor = {
            title: 'Keijo kallen tarinat',
            url: 'http://blog.tataOsoitettaEiOleOlemassa.com',
            likes: 0
        }

        const newBlogWithoutUrl = {
            title: 'Keijo kallen tarinat',
            author: 'Keivo Kalle',
            likes: 0
        }

        const blogsBeforeOperation = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlogWithoutAuthor)
            .expect(400)
            .expect('Content-type', /application\/json/)

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitle)
            .expect(400)
            .expect('Content-type', /application\/json/)

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .expect(400)
            .expect('Content-type', /application\/json/)

        var blogsAfterOperation = await blogsInDb()

        expect(blogsAfterOperation.length).toBe(blogsBeforeOperation.length)
    })
})




describe('when there is initially some blogs saved', async () => {
    test('GET to api/blogs returns all blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedTitles = response.body.map(n => n.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedtitles = response.body.map(n => n.title))
        })
    })
})


describe('When blog is removed', async () => {
    let addedBlog
    beforeAll(async () => {
        addedBlog = new Blog({
            title: 'Mina olen poisto-ohje',
            author: 'Kalle Poistaja',
            url: 'www.PoistaTietokone.fi',
            likes: 500
        })
        await addedBlog.save()
    })

    test('DELETE to api/blogs/:id with valid id removes wanted blog', async () => {
        const blogsInDatabase = await blogsInDb()

        await api
            .delete(`/api/blogs/${addedBlog._id}`)
            .expect(204)

        const blogsAfterOperation = await blogsInDb()

        const titles = blogsAfterOperation.map(r => r.title)

        expect(titles).not.toContain(addedBlog.title)
        expect(blogsAfterOperation.length).toBe(blogsInDatabase.length - 1)
    })

    test('DELETE to api/blogs/:id with invalid id returns 400', async () => {
        await api
            .delete(`/api/blogs/${'totalyNotId'}`)
            .expect(400)



    })
})

describe('When new user data is invalid', async () => {
    test('throws 400 if password is too short', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'automaatti',
            name: 'Automaatti Matti',
            password: '12'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

    })



    test('throws 400 if username is already taken', async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: 'tester',
            name: 'Automaatti Matti',
            password: 'Paavo'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)


        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

    })

})

afterAll(() => {
    server.close()
})