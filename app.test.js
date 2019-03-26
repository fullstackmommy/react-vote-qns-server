const request = require("supertest")
const app = require("./app")

describe('App', () => {
    test('should return with status code 200', () => {
        return request(app)
            .get('/')
            .expect(200)
    });
});