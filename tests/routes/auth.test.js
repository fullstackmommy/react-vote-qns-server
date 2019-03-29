const request = require("supertest")
const app = require("../../app")
const {sequelize} = require("../../models")
const {createUsers} = require("../../seed")

beforeAll(async() => {
    await sequelize.sync({force: true})
    await createUsers()
})

afterAll(async() => {
    await sequelize.close()
})

describe('Auth', () => {
    test('should register a new user', () => {
        const route = '/register'
        request(app)
            .post(route)
            .send({username: "newUser", firstName: "New", lastName: "User", password: "password"})
            .expect(204)
    })
    test('should not register a new user if the username is already taken', (done) => {
        const route = '/register'
        request(app)
            .post(route)
            .send({username: "admin", firstName: "New", lastName: "User", password: "password"})
            .expect(400, done)
    })
    test('should not log unauthorized user in - username not found', (done) => {
        const route = '/auth/signin'
        request(app)
            .post(route)
            .send({username: "newUser", password: "password"})
            .expect(401, done)
    })
    test('should not log unauthorized user in - incorrect password', (done) => {
        const route = '/auth/signin'
        request(app)
            .post(route)
            .send({username: "admin", password: "password"})
            .expect(401, done)
    })
    test('should log authorized user in', () => {
        const route = '/auth/signin'
        request(app)
            .post(route)
            .send({username: "admin", password: "admin"})
            .expect(200)
            .then(res => {
                const user = res.body
                expect(user.username).toEqual("admin")
                expect(user.token)
                    .not
                    .toBeNull()
            })
    })
    test('should log user out', () => {
        const route = '/auth/signout'
        request(app)
            .get(route)
            .expect(200)
    })
})
