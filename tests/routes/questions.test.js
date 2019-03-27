const request = require("supertest")
const app = require("../../app")
const {sequelize} = require('../../models')
const createEventsAndQuestions = require('../../seed')

const route = (params = "") => {
    const path = "/api/v1/questions";
    return `${path}/${params}`;
};

beforeAll(async() => {
    await sequelize.sync({force: true})
    await createEventsAndQuestions()
})

afterAll(async() => {
    await sequelize.close()
})

xdescribe('Questions', () => {
    describe('[GET]', () => {
        const verifyQuestions = (res, expected) => {
            const questions = res.body
            questions.forEach((question, index) => {

                expect(question.description).toEqual(expected[index].description)
                expect(question.vote).toEqual(expected[index].vote)
            })
        }

        test('Returns all questions', () => {
            const expectedQuestions = [
                {
                    id: 1,
                    description: "How did you select the specimens?",
                    vote: 5,
                    event: {
                        name: "SJADES 2018 Scientific Talk"
                    }
                }, {
                    id: 2,
                    description: "How did you prepare the specimens?",
                    vote: 10,
                    event: {
                        name: "SJADES 2018 Scientific Talk"
                    }
                }, {
                    id: 3,
                    description: "Why the specimens don't turn mouldy over time?",
                    vote: 20,
                    event: {
                        name: "SJADES 2018 Scientific Talk"
                    }
                }, {
                    id: 4,
                    description: "How did you handle the garbage collected in the trawlers?",
                    vote: 25,
                    event: {
                        name: "SJADES 2018 Scientific Talk"
                    }
                }, {
                    id: 5,
                    description: "How to identify industrially produced batik design?",
                    vote: 10,
                    event: {
                        name: "Translocation and inspiration: Javanese Batik in Europe and Africa"
                    }
                }, {
                    id: 6,
                    description: "Is Ikebana an evolving art?",
                    vote: 15,
                    event: {
                        name: "Ikebana"
                    }
                }
            ]

            return request(app)
                .get(route())
                .expect("content-type", /json/)
                .expect(200)
                .expect(res => verifyQuestions(res, expectedQuestions))
        });
        test('Get the questions based on question ID', () => {
            const id = "1"
            const expectedQuestions = [
                {
                    id: 1,
                    description: "How did you select the specimens?",
                    vote: 5,
                    event: {
                        name: "SJADES 2018 Scientific Talk"
                    }
                }
            ]
            return request(app)
                .get(route(id))
                .expect("content-type", /json/)
                .expect(200)
                .then(res => {
                    const question = res.body
                    expect(question.description).toEqual("How did you select the specimens?")
                    expect(question.vote).toBe(5)
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        });

        test('Get the questions matching the query keywords - no match found', () => {});
        test('Get the questions matching the query keywords', () => {});
    })

    describe('[POST]', () => {
        test('Creates a new question', () => {
            return request(app)
                .post(route())
                .send({description: "How to keep the specimens while onboard?", event: "SJADES 2018 Scientific Talk"})
                .expect(201)
                .then(res => {
                    const question = res.body
                    expect(question.description).toEqual("How to keep the specimens while onboard?")
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                });
        })
    })

    describe('[PUT] Edits a question', () => {
        test('Update a question description', () => {
            const id = "2"
            return request(app)
                .put(route(id))
                .send({id: 2, description: "How did you prepare the specimens onboard?"})
                .expect(202)
                .then(res => {
                    const question = res.body
                    expect(question.id).toEqual(2)
                    expect(question.description).toEqual("How did you prepare the specimens onboard?")
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        })

        test('Update a question - votes', () => {
            const id = "2"
            return request(app)
                .put(route(id))
                .send({id: 2, vote: 100})
                .expect(202)
                .then(res => {
                    const question = res.body
                    expect(question.id).toEqual(2)
                    expect(question.vote).toEqual(100)
                    expect(question.event.name).toEqual("SJADES 2018 Scientific Talk")
                })
        })

        test('Update a question, record not found', (done) => {
            const id = "1000"
            return request(app)
                .put(route(id))
                .send({id: 1000, description: "How did you prepare the specimens onboard?", event: "SJADES 2018 Scientific Talk"})
                .expect(400, done)
        })
    })

    describe('[DELETE]', () => {
        test('Delete a question based on ID', () => {
            const id = "1"
            return request(app)
                .delete(route(id))
                .expect(202)
        })
        test('Delete a question based on ID, record not found', (done) => {
            const id = "1000"
            request(app)
                .delete(route(id))
                .expect(400, done)
        })
    })

})